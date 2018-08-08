"use strict";

// deps

	const { join } = require("path");
	const assert = require("assert");

	const unlink = require(join(__dirname, "unlink.js"));

	const NodeLogs = require(join(__dirname, "..", "lib", "main.js"));

// consts

	const LOCAL_STORAGE = join(__dirname, "logs.db");
	const logs = new NodeLogs();

describe("init", () => {

	beforeEach(() => {

		logs._deleteLogsAfterXDays = 7;
		logs._localStorageDatabase = "";

	});

	after(() => {

		return logs.release().then(() => {
			return unlink(LOCAL_STORAGE);
		});

	});

	it("should check without deleteLogsAfterXDays", () => {

		return new Promise((resolve, reject) => {

			delete logs._deleteLogsAfterXDays;

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

	it("should check with wrong deleteLogsAfterXDays", () => {

		return new Promise((resolve, reject) => {

			logs._deleteLogsAfterXDays = "test";

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

	it("should check with empty deleteLogsAfterXDays", () => {

		return new Promise((resolve, reject) => {

			logs._deleteLogsAfterXDays = 0;

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

	it("should check without localStorageDatabase", () => {

		return new Promise((resolve, reject) => {

			delete logs._localStorageDatabase;

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

	it("should check with wrong localStorageDatabase", () => {

		return new Promise((resolve, reject) => {

			logs._localStorageDatabase = 0;

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

	it("should check with empty localStorageDatabase", () => {

		return new Promise((resolve, reject) => {

			logs._localStorageDatabase = "";

			logs.init().then(() => {
				reject(new Error("No error generated"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "returned value is not a valid error");
				assert.strictEqual(err instanceof Error, true, "returned value is not a valid error");

				resolve();

			});

		});

	});

});
