/**
 * @fileOverview Convenience deploy module with FPT.
 *
 * FPT client reads the following options from environment variables.
 * S_FACTORY_FPT_HOST: Host name of the FPT server.
 * S_FACTORY_FPT_USER: User name.
 * S_FACTORY_FPT_PASSWORD: Password of the user.
 */
const path = require("path");
const fs = require("vinyl-fs");
const Ftp = require("vinyl-ftp");
const spinner = require("ora")("Uploading... ");
const { sFactory } = require("../package.json");

const {
  S_FACTORY_FPT_HOST,
  S_FACTORY_FPT_USER,
  S_FACTORY_FPT_PASSWORD
} = process.env;

/**
 * Target sources.
 */
const globs = [path.join(__dirname, "..", "dist/**/*")];

// TODO handle remote dest with env.
const remoteFolder = `dev.sokontokoro-factory.net/test_package/${
  sFactory.deployPath
}`;

/**
 * FTP client instance.
 *
 * @type {VinylFtp}
 */
const client = new Ftp({
  host: S_FACTORY_FPT_HOST,
  user: S_FACTORY_FPT_USER,
  password: S_FACTORY_FPT_PASSWORD,
  log
});

/**
 * Fired when FTP client status is updated.
 *
 * @param command
 * @param status
 */
function log(command, status) {
  const c = `     ${command}`.substr(-1 * command.length);
  const s = status || "";

  spinner.text = `${c}${s}`;
}

spinner.start();
fs.src(globs, { buffer: false })
  .pipe(client.dest(remoteFolder))
  .on("error", e => spinner.fail(e))
  .on("finish", () =>
    spinner.succeed(`Suceess!\n  From: ${globs}\n  To: ${remoteFolder}`)
  );
