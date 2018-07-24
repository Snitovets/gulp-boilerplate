"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify"),
  debug = require("gulp-debug"),
  concat = require("gulp-concat"),
  minify = require("gulp-minify-css"),
  sourcemaps = require("gulp-sourcemaps"),
  gulpIf = require("gulp-if"),
  pump = require("pump"),
  del = require("del");

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("sass", () => {
  return pump([
    gulp.src("frontend/sass/*.scss"),
    gulpIf(isDev, sourcemaps.init()),
    sass().on("error", sass.logError),
    gulpIf(!isDev, minify()),
    gulpIf(isDev, sourcemaps.write(".")),
    gulp.dest("public/css")
  ]);
});

gulp.task("imgs", () => {
  return pump([
    gulp.src("frontend/imgs/*.*", {
      base: "frontend",
      since: gulp.lastRun("imgs")
    }),
    gulp.dest("public")
  ]);
});

gulp.task("js", () => {
  return pump([
    gulp.src("frontend/js/*.*", { base: "frontend" }),
    gulp.dest("public")
  ]);
});

gulp.task("fonts", () => {
  return pump([
    gulp.src("frontend/fonts/*.*", { base: "frontend" }),
    gulp.dest("public")
  ]);
});

gulp.task("clean", () => {
  return del("public");
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("sass", "imgs", "js", "fonts"))
);

gulp.task("watch", () => {
  gulp.watch("frontend/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("frontend/js/**/*.scss", gulp.series("js"));
  gulp.watch("frontend/imgs/**/*.scss", gulp.series("imgs"));
});

gulp.task("dev", gulp.series("build", "watch"));
