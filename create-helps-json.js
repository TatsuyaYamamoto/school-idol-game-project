#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const fm = require("front-matter");

const HELP_MARKDOWNS_DIR_PATH = path.resolve(__dirname, "docs/help/");
const OUTPUT_JSON_PATH = path.resolve(
  __dirname,
  "./packages/ranking/app/assets/helps.json"
);
const JAPANESE_KEY = "ja";
const ENGLISH_KEY = "en";

const helpMap = {
  [JAPANESE_KEY]: [],
  [ENGLISH_KEY]: [],
};

async function main() {
  const fileNames = await readDir(HELP_MARKDOWNS_DIR_PATH);

  for (const fileName of fileNames) {
    if (fileName === ".DS_Store") {
      continue;
    }

    const parts = fileName.split(".");
    if (parts.length !== 3) {
      throw new Error(
        `name of provided file (${fileName}) is not expected format.`
      );
    }

    const basename = parts[0];
    const language = parts[1];
    const extension = parts[2];
    const help = helpMap[language];

    if (extension.toLowerCase() !== "md") {
      throw new Error(`provided file (${fileName}) is not markdown.`);
    }

    if (!help) {
      throw new Error(
        `provided help file (${fileName}) is unsupported language. ${language}`
      );
    }

    const content = await readFile(
      path.resolve(HELP_MARKDOWNS_DIR_PATH, fileName)
    );
    const { attributes, body } = fm(content);
    const { title, tags } = attributes;
    if (!title || !tags || !body) {
      throw new Error(
        `provided help file (${fileName}) has no title, tags or body.`
      );
    }

    helpMap[language].push({
      id: basename,
      title: attributes.title,
      tags: attributes.tags,
      body,
    });
  }

  const eachLanguageDocSizes = Object.keys(helpMap).map(
    (language) => helpMap[language].length
  );

  if (!eachLanguageDocSizes.every((size) => size)) {
    console.warn("😈each language doc sizes are different.");
  }

  await writeFile(OUTPUT_JSON_PATH, JSON.stringify(helpMap));

  console.log("🍊 create help.json successfully 🍊");
}

function readDir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, function (err, fileNames) {
      if (err) {
        reject(err);
      } else {
        resolve(fileNames);
      }
    });
  });
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function writeFile(path, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
