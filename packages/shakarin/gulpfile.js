var gulp = require("gulp");
var imagemin = require("gulp-imagemin");
var gutil = require("gulp-util");
var ftp = require("vinyl-ftp");
var del = require("del"); // ファイル削除
var runSequence = require("run-sequence"); // タスクを非同期に実行する

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

// ------------------------------------------------------------------

gulp.task("hello", function() {
  console.log("（・８・）");
});
/**
HOW TO USE

- default
	- local server起動(Live reload)
- dist
	- dist dirにパッケージング
	- srcのコピー
	- development用のindex.htmlを使用する
- package
	- pacage dirにパッケージング
	- 本番用にconcat, minifyしたもの
	- production用のindex.htmlを使用する
- deploy_dist
	- 開発用サーバにdistパッケージをデプロイ

*/
gulp.task("default", function() {
  runSequence("dist", ["watch", "webserver"]);
});
gulp.task("watch", function() {
  gulp.watch(config.watchTarget, ["webpack"]);
});

gulp.task("webserver", function() {
  gulp.src(config.webServerRootDir).pipe(webserver(config.webserverOpts));
});

// パッケージング -------------------------------------------------
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
    "dist_pro_html",
    "dist_pro_img",
    "dist_pro_lib",
    "dist_pro_sound"
  ]);
});

// FTPタスク-------------------------------------------------

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
  var globs = ["dist/production/**/*"];
  return gulp
    .src(globs, { base: "dist/production/", buffer: false })
    .pipe(conn.newer(config_secret.ftp_dev.remotePath)) // only upload newer files
    .pipe(conn.dest(config_secret.ftp_dev.remotePath));
});

// ビルドタスク ---------------------------------------
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

/* HTML */
// html files: src --> dist
gulp.task("dist_html", function() {
  gulp
    .src("./src/html/development/*.html")
    .pipe(gulp.dest("./dist/development/"));
});
// html files: src --> package
gulp.task("dist_pro_html", function() {
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
gulp.task("dist_pro_lib", function() {
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
gulp.task("dist_pro_img", function() {
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
gulp.task("dist_pro_sound", function() {
  gulp.src("./src/sound/**/*").pipe(gulp.dest("./dist/production/sound/"));
});

/* delete */
gulp.task("del_dist", function() {
  del(["dist"], "");
});
