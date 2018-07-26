"use strict";

const gulp = require("gulp"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  minify = require("gulp-clean-css"),
  jscompress = require("gulp-minify"),
  sourcemaps = require("gulp-sourcemaps"),
  imageResize = require("gulp-image-resize"),
  imageMin = require("gulp-imagemin"),
  htmlMin = require("gulp-htmlmin"),
  notify = require("gulp-notify"),
  browserSync = require("browser-sync").create(),
  gulpIf = require("gulp-if"),
  rename = require("gulp-rename"),
  newer = require("gulp-newer"),
  multipipe = require("multipipe"),
  svgSprite = require("gulp-svg-sprite"),
  del = require("del");

const through2 = require("through2").obj; // for plugin creation
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("html", () => {
  return multipipe([
    gulp.src("frontend/*.html", { since: gulp.lastRun("html") }),
    newer("public"),
    gulpIf(!isDev, htmlMin({ collapseWhitespace: true })),
    gulp.dest("public")
  ]).on("error", notify.onError());
});

gulp.task("sass", () => {
  return multipipe([
    gulp.src("frontend/sass/*.scss", {
      since: gulp.lastRun("sass")
    }),
    newer("public"),
    gulpIf(isDev, sourcemaps.init()),
    sass(),
    gulpIf(!isDev, minify({ compatibility: "ie8" })),
    gulpIf(isDev, sourcemaps.write(".")),
    gulp.dest("public/css")
  ]).on("error", notify.onError());
});

gulp.task("imgs", () => {
  return multipipe([
    gulp.src("frontend/imgs/*.*", {
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
    gulpIf(
      "*.svg",
      multipipe([
        svgSprite({
          mode: {
            css: {
              dest: ".",
              bust: false,
              sprite: "sprite.svg",
              layout: "vertical",
              prefix: "%",
              dimensions: true,
              render: {
                scss: true
              }
            }
          }
        }),
        gulpIf("*.scss", gulp.dest("public/tmp"), gulp.dest("public/imgs"))
      ]),
      gulp.dest("public")
    )
  ]).on("error", notify.onError());
});

gulp.task("imgs:compress", () => {
  if (gulp.src("frontend/imgs/*.svg")) {
    multipipe([
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
    ]).on("error", notify.onError());
  }
  return multipipe([
    gulp.src("frontend/imgs/*.{jpg,png,gif}", {
      base: "frontend",
      since: gulp.lastRun("imgs")
    }),
    newer("public"),
    imageResize({ width: 1920 }),
    gulp.dest("public")
  ]).on("error", notify.onError());
});

gulp.task("js", () => {
  return multipipe([
    gulp.src("frontend/js/*.js", {
      sinse: gulp.lastRun("js")
    }),
    newer("public"),
    concat("index.js"),
    gulpIf(!isDev, jscompress()),
    gulp.dest("public/js")
  ]).on("error", notify.onError());
});

gulp.task("fonts", () => {
  return multipipe([
    gulp.src("frontend/fonts/*.*", { base: "frontend" }),
    newer("public"),
    gulp.dest("public")
  ]).on("error", notify.onError());
});

gulp.task("clean", () => {
  return del("public");
});

gulp.task("serve", () => {
  browserSync.init({
    server: "public"
  });

  browserSync
    .watch("public/**/*.*")
    .on("change", browserSync.reload)
    .on("error", notify.onError());
});

gulp.task(
  "build",
  gulp.series("clean", gulp.parallel("html", "sass", "imgs", "js", "fonts"))
);

gulp.task("watch", () => {
  gulp.watch("frontend/*.html", gulp.series("html"));
  gulp.watch("frontend/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("frontend/js/**/*.js", gulp.series("js"));
  gulp.watch("frontend/imgs/**/*.*", gulp.series("imgs"));
  gulp.watch("frontend/fonts/**/*.*", gulp.series("fonts"));
});

gulp.task("dev", gulp.series("build", gulp.parallel("watch", "serve")));

gulp.task("plugin", () => {
  return gulp
    .src("frontend/**/*.*")
    .pipe(
      through2((file, enc, callback) => {
        console.log(file);
        callback(null, file);
      })
    )
    .pipe(gulp.dest("public"));
});
