"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify"),
  debug = require("gulp-debug"),
  concat = require("gulp-concat"),
  sourcemaps = require("gulp-sourcemaps"),
  gulpIf = require("gulp-if"),
  pump = require("pump"),
  del = require("del");

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("sass", function() {
  return pump([
    gulp.src("./frontend/sass/*.scss"),
    gulpIf(isDev, sourcemaps.init()),
    sass().on("error", sass.logError),
    gulpIf(isDev, sourcemaps.write(".")),
    gulp.dest("./public/css")
  ]);
});

gulp.task("clean", function() {
  return del("public");
});

gulp.task("build", gulp.series("clean", "sass"));
