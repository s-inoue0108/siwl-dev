#!/usr/bin/env node
// "pnpm run siwl" for ailias, or "pnpm -s dlx tsx .cli/siwl.ts <cmd> --opt" for direct run

import fs from "fs";
import { stdin as input, stdout as output } from "node:process";

import { Command } from "commander";
const program = new Command();

const getModel = (cmd: any) => {
  const isModel = (arg: string | undefined): arg is ("article" | "tag" | "bookmark") => {
    return arg === "article" || arg === "tag" || arg === "bookmark" ? true : false;
  }
  const model: "article" | "tag" | "bookmark" = isModel(cmd.model) ? cmd.model : "article";
  return model;
}

const getFilename = (cmd: any) => {
  const filename: string = cmd.filename.toLowerCase();
  return filename;
}

// add
program
  .command("add")
  .alias("new")
  .description("add a new content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {

      // ファイル
      const file = `./src/content/${model}/${filename}.md`;
      if (fs.existsSync(file)) {
        console.log(`	\x1b[33m${model}/${filename}.md already exists!\n\x1b[39mplease run "siwl open -f ${filename}" to open.`);
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `---\nisDraft: true\ntitle: \ncategory: tech\ntags: []\ndescription: \npublishDate: ${new Date().toLocaleDateString("ja-JP", {
          year: "numeric", month: "2-digit",
          day: "2-digit"
        }).replaceAll('/', '-')}\nupdateDate: ${new Date().toLocaleDateString("ja-JP", {
          year: "numeric", month: "2-digit",
          day: "2-digit"
        }).replaceAll('/', '-')}\nrelatedArticles: []\n---`,
        (err) => {
          if (err) { throw err; }
          console.log(`added ${model}/${filename}.md`);
          process.exit(0);
        });

    } else if (model === "tag") {

      // ファイル
      const file = `./src/content/${model}/${filename}.yaml`;
      if (fs.existsSync(file)) {
        console.log(`	\x1b[33m${model}/${filename}.yaml already exists!\n\x1b[39mplease run "siwl open -f ${filename} -m tag" to open.`);
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `isDraft: true\nname: \nbelong: tech\nicon: ./icons/\n`,
        (err) => {
          if (err) { throw err; }
          console.log(`added ${model}/${filename}.yaml`);
          process.exit(0);
        });

    } else {

      // ファイル
      const file = `./src/content/${model}/${filename}.yaml`;
      if (fs.existsSync(file)) {
        console.log(`	\x1b[33m${model}/${filename}.yaml already exists!\n\x1b[39mplease run "siwl open -f ${filename} -m bookmark" to open.`);
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `isDraft: true\nname: \ndescription: \nurl: \n`,
        (err) => {
          if (err) { throw err; }
          console.log(`added ${model}/${filename}.yaml`);
          process.exit(0);
        });
    }
  });

// rm
program
  .command("rm")
  .alias("remove")
  .description("remove a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {
      fs.unlink(`./src/content/${model}/${filename}.md`, (err) => {
        if (err) {
          console.log(`	\x1b[33m${model}/${filename}.md does not exist!`);
          process.exit(1);
        };
        console.log(`removed ${model}/${filename}.md`);
        process.exit(0);
      });
    } else if (model === "tag") {
      fs.unlink(`./src/content/${model}/${filename}.yaml`, (err) => {
        if (err) {
          console.log(`	\x1b[33m${model}/${filename}.yaml does not exist!`);
          process.exit(1);
        };
        console.log(`removed ${model}/${filename}.yaml`);
        process.exit(0);
      });
    } else {
      fs.unlink(`./src/content/${model}/${filename}.yaml`, (err) => {
        if (err) {
          console.log(`	\x1b[33m${model}/${filename}.yaml does not exist!`);
          process.exit(1);
        };
        console.log(`removed ${model}/${filename}.yaml`);
        process.exit(0);
      });
    }
  });

// list
program
  .command("ls")
  .alias("list")
  .description("view content list")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {
    const model = getModel(cmd);

    fs.readdir(`./src/content/${model}/`, (_, files) => {
      files.forEach(file => {
        console.log(file.replace(".md", "").replace(".yaml", ""));
      });
    });
  });

program.name("siwl").description("Content Management CLI").version("0.0.1", "-v, --version").parse(process.argv);
