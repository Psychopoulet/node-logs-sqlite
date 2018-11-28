"use strict";

// deps

	// natives
	const { strictEqual } = require("assert");

	// locals
	const checkNumberParameter = require(require("path").join(__dirname, "..", "lib", "checkNumberParameter.js"));
	const checkStringParameter = require(require("path").join(__dirname, "..", "lib", "checkStringParameter.js"));
	const checkNumberOrStringParameter = require(require("path").join(__dirname, "..", "lib", "checkNumberOrStringParameter.js"));

// tests

describe("checks", () => {

	describe("checkNumberParameter", () => {

		it("should test missing value", () => {

			return new Promise((resolve, reject) => {

				checkNumberParameter("value").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong value", () => {

			return new Promise((resolve, reject) => {

				checkNumberParameter("value", false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test empty number value", () => {

			return new Promise((resolve, reject) => {

				checkNumberParameter("value", 0).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof Error, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test right number value", () => {
			return checkNumberParameter("value", 2018);
		});

	});

	describe("checkStringParameter", () => {

		it("should test missing value", () => {

			return new Promise((resolve, reject) => {

				checkStringParameter("value").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong value", () => {

			return new Promise((resolve, reject) => {

				checkStringParameter("value", false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test empty string value", () => {

			return new Promise((resolve, reject) => {

				checkStringParameter("value", "").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof Error, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test right string value", () => {
			return checkStringParameter("value", "2018");
		});

	});

	describe("checkNumberOrStringParameter", () => {

		it("should test missing value", () => {

			return new Promise((resolve, reject) => {

				checkNumberOrStringParameter("value").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof ReferenceError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test wrong value", () => {

			return new Promise((resolve, reject) => {

				checkNumberOrStringParameter("value", false).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof TypeError, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test empty string value", () => {

			return new Promise((resolve, reject) => {

				checkNumberOrStringParameter("value", "").then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof Error, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test empty number value", () => {

			return new Promise((resolve, reject) => {

				checkNumberOrStringParameter("value", -1).then(() => {
					reject(new Error("No error generated"));
				}).catch((err) => {

					strictEqual(typeof err, "object", "returned value is not a valid error");
					strictEqual(err instanceof Error, true, "returned value is not a valid error");

					resolve();

				});

			});

		});

		it("should test right string value", () => {
			return checkNumberOrStringParameter("value", "2018");
		});

		it("should test right number value", () => {
			return checkNumberOrStringParameter("value", 2018);
		});

	});

});
