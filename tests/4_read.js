"use strict";

// deps

	// natives
	const { join } = require("path");
	const assert = require("assert");

	// locals
	const unlink = require(join(__dirname, "unlink.js"));
	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const LOCAL_STORAGE = join(__dirname, "logs.db");
	const logs = new NodeLogs();

	const date = new Date();

// tests

describe("read", () => {

	before(() => {

		return unlink(LOCAL_STORAGE).then(() => {

			logs
				.localStorageDatabase(LOCAL_STORAGE)
				.deleteLogsAfterXDays(600)
				.showInConsole(false);

			return Promise.resolve();

		});

	});

	after(() => {

		return logs.release().then(() => {
			return unlink(LOCAL_STORAGE);
		});

	});

	beforeEach(() => {
		return logs.init();
	});

	afterEach(() => {
		return logs.release();
	});

	it("should check getLogs", () => {

		return logs.log("log", [ "background", "bold" ]).then(() => {
			return logs.getLogs();
		}).then((data) => {

			assert.deepEqual(
				data,
				[
					{
						"year": String(date.getFullYear()),
						"month": 9 < date.getMonth() + 1 ? String(date.getMonth() + 1) : "0" + (date.getMonth() + 1),
						"day": 9 < date.getDate() ? String(date.getDate()) : "0" + date.getDate()
					}
				],
				"returned value is not the current date"
			);

			return Promise.resolve();

		});

	});

	it("should return registered log files", () => {

		return logs.getLogs().then((data) => {

			assert.strictEqual(typeof data, "object", "logs value is not an object");
			assert.strictEqual(data instanceof Array, true, "logs value is not an Array");
			assert.strictEqual(data.length, 1, "logs length is not 1");

			assert.strictEqual(typeof data[0].year, "string", "first log's year is not a string");
			assert.strictEqual(typeof data[0].month, "string", "first log's month is not a string");
			assert.strictEqual(typeof data[0].day, "string", "first log's day is not a string");

			return logs.readLog(data[0].year, data[0].month, data[0].day);

		}).then((data) => {

			assert.strictEqual(typeof data, "object", "logs value is not an object");
			assert.strictEqual(data instanceof Array, true, "logs value is not an Array");
			assert.strictEqual(data.length, 1, "logs length is not 1");

			return Promise.resolve(data);

		}).then((data) => {

			assert.strictEqual(typeof data[0].date, "string", "first log's date is not a string");
			assert.strictEqual(typeof data[0].time, "string", "first log's time is not a string");
			assert.strictEqual(typeof data[0].message, "string", "first log's message is not a string");
			assert.strictEqual(typeof data[0].type, "string", "first log's type is not a string");
			assert.strictEqual(typeof data[0].options, "object", "first log's options is not a string");
			assert.strictEqual(data[0].options instanceof Array, true, "first log's options is not an Array");
			assert.strictEqual(data[0].options.length, 2, "first log's options length is not 2");

			return Promise.resolve();

		});

	});

	describe("readLog", () => {

		describe("year", () => {

			it("should test missing year", () => {

				return new Promise((resolve, reject) => {

					logs.readLog().then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test wrong year", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(false).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test empty year", () => {

				return new Promise((resolve, reject) => {

					logs.readLog("").then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

		describe("month", () => {

			it("should test missing month", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear()).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test wrong month", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear(), false).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test empty month", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear(), "").then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

		describe("day", () => {

			it("should test missing day", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear(), date.getMonth() + 1).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test wrong day", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear(), date.getMonth() + 1, false).then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

			it("should test empty day", () => {

				return new Promise((resolve, reject) => {

					logs.readLog(date.getFullYear(), date.getMonth() + 1, "").then(() => {
						reject(new Error("No error generated"));
					}).catch((err) => {

						assert.strictEqual(typeof err, "object", "returned value is not a valid error");
						assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

						resolve();

					});

				});

			});

		});

	});

});
