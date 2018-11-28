
"use strict";

// deps

	const path = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const mocha = require("gulp-mocha");

	// reports
	const istanbul = require("gulp-istanbul");
	const coveralls = require("gulp-coveralls");

// consts

	const APP_FILES = [ path.join(__dirname, "lib", "**", "*.js") ];
	const UNITTESTS_FILES = [ path.join(__dirname, "tests", "**", "*.js") ];

// tasks

	gulp.task("istanbul", () => {

		return gulp.src(APP_FILES)
			.pipe(plumber())
			.pipe(istanbul({ "includeUntested": true }))
			.pipe(istanbul.hookRequire());

	});

	gulp.task("mocha", gulp.series("istanbul", () => {

		return gulp.src(UNITTESTS_FILES)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ "thresholds": { "global": 85 } }));

	}));

	gulp.task("coveralls", gulp.series("mocha", () => {

		return gulp.src(path.join(__dirname, "coverage", "lcov.info"))
			.pipe(plumber())
			.pipe(coveralls());

	}));

// default

	gulp.task("default", gulp.series("mocha"));
