"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  debug = require("gulp-debug"),
  concat = require("gulp-concat"),
  minify = require("gulp-clean-css"),
  jscompress = require("gulp-minify"),
  sourcemaps = require("gulp-sourcemaps"),
  imageResize = require("gulp-image-resize"),
  imageMin = require("gulp-imagemin"),
  htmlMin = require("gulp-htmlmin"),
  gulpIf = require("gulp-if"),
  rename = require("gulp-rename"),
  newer = require("gulp-newer"),
  pump = require("pump"),
  del = require("del"),
  browserSync = require("browser-sync").create();

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("html", () => {
  return pump([
    gulp.src("frontend/html/*.html", {
      since: gulp.lastRun("html")
    }),
    newer("public"),
    gulpIf(!isDev, htmlMin({ collapseWhitespace: true })),
    gulp.dest("public")
  ]);
});

gulp.task("sass", () => {
  return pump([
    gulp.src("frontend/sass/*.scss", {
      since: gulp.lastRun("sass")
    }),
    newer("public"),
    gulpIf(isDev, sourcemaps.init()),
    sass().on("error", sass.logError),
    gulpIf(!isDev, minify({ compatibility: "ie8" })),
    gulpIf(isDev, sourcemaps.write(".")),
    gulp.dest("public/css")
  ]);
});

gulp.task("imgs-compress", () => {
  if (gulp.src("frontend/imgs/*.svg")) {
    pump([
      gulp.src("frontend/imgs/*.svg", {
        base: "frontend",
        since: gulp.lastRun("imgs-compress")
      }),
      newer("public"),
      imageMin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 5,
        svgoPlugins: [{ removeViewBox: true }]
      }),
      gulp.dest("public")
    ]);
  }
  return pump([
    gulp.src("frontend/imgs/*.{jpg,png,gif}", {
      base: "frontend",
      since: gulp.lastRun("imgs")
    }),
    newer("public"),
    imageResize({ width: 1920 }),
    gulp.dest("public")
  ]);
});

gulp.task("imgs", () => {
  return pump([
    gulp.src("frontend/imgs/*.{jpg,png,gif,svg}", {
      base: "frontend",
      since: gulp.lastRun("imgs")
    }),
    newer("public"),
    imageMin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{ removeViewBox: true }]
    }),
    gulp.dest("public")
  ]);
});

gulp.task("js", () => {
  return pump([
    gulp.src("frontend/js/*.js", {
      sinse: gulp.lastRun("js")
    }),
    newer("public"),
    concat("index.js"),
    gulpIf(!isDev, jscompress()),
    gulp.dest("public/js")
  ]);
});

gulp.task("fonts", () => {
  return pump([
    gulp.src("frontend/fonts/*.*", { base: "frontend" }),
    newer("public"),
    gulp.dest("public")
  ]);
});

gulp.task("clean", () => {
  return del("public");
});

gulp.task("serve", () => {
  browserSync.init({
    server: "public"
  });

  browserSync.watch("public/**/*.*").on("change", browserSync.reload);
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("html", "sass", "imgs", "js", "fonts"))
);

gulp.task("watch", () => {
  gulp.watch("frontend/html/**/*.html", gulp.series("html"));
  gulp.watch("frontend/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("frontend/js/**/*.js", gulp.series("js"));
  gulp.watch("frontend/imgs/**/*.{jpg,png,gif}", gulp.series("imgs"));
  gulp.watch("frontend/fonts/**/*.*", gulp.series("fonts"));
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));
