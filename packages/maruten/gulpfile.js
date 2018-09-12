var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var del = require("del"); // ファイル削除
var runSequence = require("run-sequence"); // タスクを非同期に実行する
var ftp = require("vinyl-ftp");
var gutil = require("gulp-util");

var webpack = require("gulp-webpack");
var webserver = require("gulp-webserver");
var webpackConf = require("./webpack.config.js");
var webpackConfPro = require("./webpack.config.pro.js");
var config_secret = require("./config.secret.json");
var slack = require("gulp-slack")({
  url: config_secret.slack.webhooks,
  user: config_secret.name
});

var config = {
  watchTarget: "./src/js/**/*.js",
  webServerRootDir: "./dist/development/",
  webserverOpts: {
    host: "localhost",
    port: 8000,
    livereload: false
  }
};

gulp.task("default", function() {
  runSequence("dist", ["watch", "webserver"]);
});

gulp.task("watch", function() {
  gulp.watch(config.watchTarget, ["webpack"]);
});

gulp.task("webpack", function() {
  gulp
    .src("")
    .pipe(webpack(webpackConf))
    .pipe(gulp.dest(webpackConf.output.path));
});

gulp.task("webpack_pro", function() {
  gulp
    .src("")
    .pipe(webpack(webpackConfPro))
    .pipe(gulp.dest(webpackConfPro.output.path));
});

gulp.task("webserver", function() {
  gulp.src(config.webServerRootDir).pipe(webserver(config.webserverOpts));
});

/* 開発用パッケージング */
gulp.task("dist", function() {
  runSequence("del_dist", [
    "webpack",
    "dist_html",
    "dist_img",
    "dist_lib",
    "dist_sound"
  ]);
});

/* 本番用パッケージング */
gulp.task("dist_pro", function() {
  runSequence("del_dist", [
    "webpack_pro",
    "package_html",
    "package_img",
    "package_lib",
    "package_sound"
  ]);
});

/* 開発サーバーへアップロード */
// dist --> dev env.
gulp.task("upload", ["copyDistToDev"], function() {
  slack(
    "開発環境サーバーにパッケージを設置しました。\nhttp://" +
      config_secret.ftp_dev.remotePath
  );
});
gulp.task("copyDistToDev", function() {
  var conn = ftp.create({
    host: config_secret.ftp_dev.connect.host,
    user: config_secret.ftp_dev.connect.user,
    password: config_secret.ftp_dev.connect.password,
    parallel: 2,
    log: gutil.log
  });
  var globs = ["dist/development/**/*"];
  return gulp
    .src(globs, { base: "dist/development/", buffer: false })
    .pipe(conn.newer(config_secret.ftp_dev.remotePath)) // only upload newer files
    .pipe(conn.dest(config_secret.ftp_dev.remotePath));
});

// files: src --> dist or package dir-------------------------------------------------
/* HTML */
// html files: src --> dist
gulp.task("dist_html", function() {
  gulp
    .src("./src/html/development/*.html")
    .pipe(gulp.dest("./dist/development/"));
});
// html files: src --> package
gulp.task("package_html", function() {
  gulp
    .src("./src/html/production/*.html")
    .pipe(gulp.dest("./dist/production/"));
});

/* lib */
// lib files: src --> dist
gulp.task("dist_lib", function() {
  gulp.src("./src/lib/**/*").pipe(gulp.dest("./dist/development/lib/"));
});
// lib files: src --> package
gulp.task("package_lib", function() {
  gulp.src("./src/lib/**/*").pipe(gulp.dest("./dist/production/lib/"));
});

/* image */
// img files: src --> dist
gulp.task("dist_img", function() {
  gulp
    .src("./src/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/development/img/"));
});
// img files: src --> package
gulp.task("package_img", function() {
  gulp
    .src("./src/img/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/production/img/"));
});

/* sound */
// img files: src --> dist
gulp.task("dist_sound", function() {
  gulp.src("./src/sound/**/*").pipe(gulp.dest("./dist/development/sound/"));
});

// img files: src --> package
gulp.task("package_sound", function() {
  gulp.src("./src/sound/**/*").pipe(gulp.dest("./dist/production/sound/"));
});

/* delete */
gulp.task("del_dist", function() {
  del(["dist"], "");
});
