#!/usr/bin/env node

const stdin = process.openStdin();
const CONFIRM_MESSAGE = `🔥PRODUCTION SCRIPT🔥\nDo you want to continue this script? [y/N]: `;
const OK_MESSAGE = `✨ OK! Continue scripts!\n`;
const CANCEL_MESSAGE = `👿 CANCEL....\n`;

process.stdout.write(CONFIRM_MESSAGE);

stdin.on("data", (chunk) => {
  if (chunk.indexOf("y") === 0) {
    process.stdout.write(OK_MESSAGE);
    process.exit(0);
  } else {
    process.stdout.write(CANCEL_MESSAGE);
    process.exit(1);
  }
});
