
"use strict";

// deps

	const { join } = require("path");

	const sqlite3 = require("sqlite3");

// private

	// methods

		const _createFile = require(join(__dirname, "createFile.js"));
		const _fileExists = require(join(__dirname, "fileExists.js"));

		const _formateDate = require(join(__dirname, "formateDate.js"));
		const _formateTime = require(join(__dirname, "formateTime.js"));

// module

module.exports = class NodeLogsSQLite extends require("node-logs") {

	constructor () {

		super();

		// delete old logs
		this._deleteLogsAfterXDays = 7;

		// local storage
		this._localStorageDatabase = "";
		this._localStorageObject = null;

	}

	// accessors

		deleteLogsAfterXDays (deleteLogsAfterXDays) {

			if ("undefined" === typeof deleteLogsAfterXDays) {
				throw new ReferenceError("Missing \"deleteLogsAfterXDays\" data");
			}
				else if ("number" !== typeof deleteLogsAfterXDays) {
					throw new TypeError("\"deleteLogsAfterXDays\" data is not a number");
				}

			else {
				this._deleteLogsAfterXDays = deleteLogsAfterXDays; return this;
			}

		}

		localStorageDatabase (localStorageDatabase) {

			if ("undefined" === typeof localStorageDatabase) {
				throw new ReferenceError("Missing \"localStorageDatabase\" data");
			}
				else if ("string" !== typeof localStorageDatabase) {
					throw new TypeError("\"localStorageDatabase\" data is not a string");
				}

			else {
				this._localStorageDatabase = localStorageDatabase; return this;
			}

		}

	// init / release

		init () {

			return super.init().then(() => {

				// check deleteLogsAfterXDays attribute
				return Promise.resolve().then(() => {

					if ("undefined" === typeof this._deleteLogsAfterXDays) {
						return Promise.reject(new ReferenceError("Missing \"deleteLogsAfterXDays\" data"));
					}
						else if ("number" !== typeof this._deleteLogsAfterXDays) {
							return Promise.reject(new TypeError("\"deleteLogsAfterXDays\" data is not a number"));
						}
						else if (0 >= this._deleteLogsAfterXDays) {
							return Promise.reject(new Error("\"deleteLogsAfterXDays\" data must be higher than 0"));
						}

					else {
						return Promise.resolve();
					}

				// check localStorageDatabase attribute
				}).then(() => {

					if ("undefined" === typeof this._localStorageDatabase) {
						return Promise.reject(new ReferenceError("Missing \"localStorageDatabase\" data"));
					}
						else if ("string" !== typeof this._localStorageDatabase) {
							return Promise.reject(new TypeError("\"localStorageDatabase\" data is not a string"));
						}
						else if ("" === this._localStorageDatabase.trim()) {
							return Promise.reject(new Error("\"localStorageDatabase\" data is empty"));
						}

					else {
						return Promise.resolve();
					}

				});

			// check if local storage exists
			}).then(() => {

				return _fileExists(this._localStorageDatabase);

			// if not, create it
			}).then((isFile) => {

				return isFile ? new Promise((resolve) => {
					this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);
					this._localStorageObject.serialize(resolve);
				}) : _createFile(this._localStorageDatabase).then(() => {

					return new Promise((resolve, reject) => {

						this._localStorageObject = new sqlite3.Database(this._localStorageDatabase);

						this._localStorageObject.serialize(() => {

							this._localStorageObject.run(

								"CREATE TABLE logs (" +
									" type VARCHAR(10)," +
									" datetime DATETIME," +
									" message TEXT," +
									" options TEXT" +
								" );"

							, (err) => {
								return err ? reject(err) : resolve();
							});

						});

					});

				});

			// add local storage interface
			}).then(() => {

				/**
				* Generic local storage method
				* @param {object} localStorageObject localStorage manager
				* @param {string} msg message to log
				* @param {string} type log type
				* @param {Array} options style options
				* @returns {Promise} Ooperation result
				*/
				function _localStorage (localStorageObject, msg, type, options) {

					return new Promise((resolve, reject) => {

						localStorageObject
							.prepare(
								"INSERT INTO logs " +
								"(type, datetime, message, options) " +
								"VALUES (?, DATETIME(), ?, ?);"
							)
							.run(type, msg, options.join("|"))
							.finalize((err) => {
								return err ? reject(err) : resolve();
							});

					});

				}

				return this.addInterface({

					"log": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "log", options);
					},
					"success": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "success", options);
					},
					"information": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "information", options);
					},
					"warning": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "warning", options);
					},
					"error": (msg, options) => {
						return _localStorage(this._localStorageObject, msg, "error", options);
					}

				});

			// delete old logs
			}).then(() => {

				return new Promise((resolve, reject) => {

					this._localStorageObject.run(
						"DELETE FROM logs WHERE datetime <= date('now', '-" + this._deleteLogsAfterXDays + " days');", (err) => {
							return err ? reject(err) : resolve();
					});

				});

			});

		}

		release () {

			return super.release().then(() => {

				return !this._localStorageObject ? Promise.resolve() : new Promise((resolve, reject) => {

					this._localStorageObject.close((err) => {
						return err ? reject(err) : resolve();
					});

				}).then(() => {
					this._localStorageObject = null; return Promise.resolve();
				});

			});

		}

	// get logs

		getLogs () {

			return new Promise((resolve, reject) => {

				this._localStorageObject.all(
					"SELECT " +
						"strftime(\"%Y\", datetime) AS year, strftime(\"%m\", datetime) AS month, strftime(\"%d\", datetime) AS day " +
					"FROM logs " +
					"GROUP BY year, month, day;",
					(err, rows) => {
						return err ? reject(err) : resolve(rows);
				});

			});

		}

		readLog (year, month, day) {

			if ("undefined" === typeof year) {
				return Promise.reject(new ReferenceError("Missing \"year\" data"));
			}
				else if ("string" !== typeof year && "number" !== typeof year) {
					return Promise.reject(new TypeError("\"year\" data is not a string or a number"));
				}
				else if ("string" === typeof year && "" === year) {
					return Promise.reject(new Error("\"year\" data is empty"));
				}

			else if ("undefined" === typeof month) {
				return Promise.reject(new ReferenceError("Missing \"month\" data"));
			}
				else if ("string" !== typeof month && "number" !== typeof month) {
					return Promise.reject(new TypeError("\"month\" data is not a string"));
				}
				else if ("string" === typeof month && "" === month) {
					return Promise.reject(new Error("\"month\" data is empty"));
				}

			else if ("undefined" === typeof day) {
				return Promise.reject(new ReferenceError("Missing \"day\" data"));
			}
				else if ("string" !== typeof day && "number" !== typeof day) {
					return Promise.reject(new TypeError("\"day\" data is not a string"));
				}
				else if ("string" === typeof day && "" === day) {
					return Promise.reject(new Error("\"day\" data is empty"));
				}

			else {

				return new Promise((resolve, reject) => {

						const stmt = this._localStorageObject.prepare(
							"SELECT message, type, datetime, options " +
							"FROM logs " +
							"WHERE strftime(\"%Y\", datetime) = ? AND strftime(\"%m\", datetime) = ? AND strftime(\"%d\", datetime) = ?;"
						);

						stmt.all(year, month, day, (err, rows) => {

							stmt.finalize();

							return err ? reject(err) : resolve(rows);

						});

				}).then((rows) => {

					const result = [];

						rows.forEach((row) => {

							const date = new Date(row.datetime);

							result.push({
								"date": _formateDate(date),
								"time": _formateTime(date),
								"message": row.message,
								"type": row.type,
								"options": row.options.split("|")
							});

						});

					return Promise.resolve(result);

				});

			}

		}

};
