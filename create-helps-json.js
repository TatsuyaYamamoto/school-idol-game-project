#!/usr/bin/env node

const fs = require("fs");

const HELP_MARKDOWNS_DIR_PATH = "./docs/help/";
const OUTPUT_JSON_PATH = "./docs/help/help-search.json";
const JAPANESE_KEY = "ja";
const ENGLISH_KEY = "en";

const helpMap = {
  [JAPANESE_KEY]: [],
  [ENGLISH_KEY]: []
};

fs.readdir(HELP_MARKDOWNS_DIR_PATH, function(err, fileNames) {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    for (const fileName of fileNames) {
      const parts = fileName.split(".");
      if (parts.length !== 3) {
        continue;
      }

      const language = parts[1];
      const help = helpMap[language];

      if (!help) {
        console.error("unsupported language.", language);
        process.exit(1);
      }

      helpMap[language].push(fileName);
    }

    const eachLanguageDocSizes = Object.keys(helpMap).map(
      language => helpMap[language].length
    );

    if (!eachLanguageDocSizes.every(size => size)) {
      console.error("invalid size");
      process.exit(1);
    }

    fs.writeFile(OUTPUT_JSON_PATH, JSON.stringify(helpMap), err => {
      // 書き出しに失敗した場合
      if (err) {
        console.log("エラーが発生しました。" + err);
        throw err;
      }
      // 書き出しに成功した場合
      else {
        console.log("ファイルが正常に書き出しされました");
      }
    });
  }
});
