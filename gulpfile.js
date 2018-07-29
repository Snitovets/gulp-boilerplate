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
  newer = require("gulp-newer"),
  multipipe = require("multipipe"),
  svgSprite = require("gulp-svg-sprite"),
  pngSprite = require("gulp.spritesmith"),
  spriteSmash = require("gulp-spritesmash"),
  rev = require("gulp-rev"),
  revReplace = require("gulp-rev-replace"),
  del = require("del");

const through2 = require("through2").obj;
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("html", () => {
  return multipipe([
    gulp.src("frontend/*.html", { since: gulp.lastRun("html") }),
    gulpIf(
      !isDev,
      revReplace({
        manifest: gulp.src("manifest/{css,js}.json", { allowEmpty: true })
      })
    ),
    gulpIf(!isDev, htmlMin({ collapseWhitespace: true })),
    gulp.dest("public")
  ]).on("error", notify.onError());
});

gulp.task("sass", () => {
  return multipipe([
    gulp.src("frontend/sass/main.scss", {
      since: gulp.lastRun("sass")
    }),
    newer("public"),
    gulpIf(isDev, sourcemaps.init()),
    sass(),
    gulpIf(isDev, sourcemaps.write(".")),
    gulpIf(!isDev, multipipe([minify({ compatibility: "ie8" }), rev()])),
    gulp.dest("public/css"),
    multipipe([rev.manifest("css.json"), gulp.dest("manifest")])
  ]).on("error", notify.onError());
});

gulp.task("imgs", () => {
  const configPng = {
    imgName: "../imgs/sprite.png",
    cssName: "_png-sprite.scss"
  };

  const configSvg = {
    mode: {
      css: {
        dest: ".",
        bust: !isDev,
        sprite: "../imgs/sprite.svg",
        layout: "vertical",
        prefix: "@mixin %s",
        dimensions: true,
        render: {
          scss: {
            dest: "_svg-sprite"
          }
        }
      }
    }
  };

  return multipipe([
    gulp.src("frontend/imgs/*.*", {
      base: "frontend"
    }),
    imageMin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{ removeViewBox: true }]
    }),
    gulpIf(
      "*.png",
      multipipe([
        pngSprite(configPng),
        gulpIf(!isDev, spriteSmash()),
        gulpIf("*.scss", gulp.dest("tmp/sass"), gulp.dest("public/imgs"))
      ])
    ),
    gulpIf(
      "*.svg",
      multipipe([
        svgSprite(configSvg),
        gulpIf("*.scss", gulp.dest("tmp/sass"), gulp.dest("public/imgs"))
      ]),
      gulpIf("*.jpg", gulp.dest("public"))
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
  let page = "index";

  return multipipe([
    gulp.src("frontend/js/*.js"),
    newer("public"),
    gulpIf(isDev, sourcemaps.init()),
    concat(`${page}.js`),
    gulpIf(isDev, sourcemaps.write(".")),
    gulpIf(!isDev, multipipe([jscompress(), rev()])),
    gulp.dest("public/js"),
    multipipe([rev.manifest("js.json"), gulp.dest("manifest")])
  ]).on("error", notify.onError());
});

gulp.task("js:libs", () => {
  return multipipe([
    gulp.src("frontend/js/libs/*.js"),
    newer("public"),
    concat("libs.js"),
    jscompress(),
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
  return del(["public", "manifest", "tmp"]);
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
  gulp.series(
    ["clean", "imgs"],
    gulp.parallel("sass", "js", "js:libs", "fonts"),
    gulp.series("html")
  )
);

gulp.task("watch", () => {
  gulp.watch("frontend/*.html", gulp.series("html"));
  gulp.watch("frontend/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("frontend/js/*.js", gulp.series("js"));
  gulp.watch("frontend/js/libs/*.js", gulp.series("js:libs"));
  gulp.watch("frontend/imgs/**/*.*", gulp.series("imgs"));
  gulp.watch("frontend/fonts/**/*.*", gulp.series("fonts"));
});

gulp.task(
  "dev",
  gulp.series("clean", "build", gulp.parallel("watch", "serve"))
);

// gulp.task("plugin", () => {
//   return gulp
//     .src("frontend/**/*.*")
//     .pipe(
//       through2((file, enc, callback) => {
//         console.log(file);
//         callback(null, file);
//       })
//     )
//     .on("error", notify.onError())
//     .on("end", () => {
//       console.log("data-stream done his work");
//     });
// });
