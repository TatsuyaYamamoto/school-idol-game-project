#!/usr/bin/env node

const stdin = process.openStdin();
const CONFIRM_MESSAGE = `🔥PRODUCTION SCRIPT🔥\nDo you want to continue this script? [y/N]: `;
const OK_MESSAGE = `✨ OK! Continue scripts!\n`;
const CANCEL_MESSAGE = `👿 CANCEL....\n`;
const IGNORE_MESSAGE = `🍊 I'm circleci and ignore this confirmation!\n`;

process.stdout.write(CONFIRM_MESSAGE);

if (require("os").userInfo().username === "circleci") {
  process.stdout.write(IGNORE_MESSAGE);
  process.exit(0);
}

stdin.on("data", function(chunk) {
  if (chunk.indexOf("y") === 0) {
    process.stdout.write(OK_MESSAGE);
    process.exit(0);
  } else {
    process.stdout.write(CANCEL_MESSAGE);
    process.exit(1);
  }
});
