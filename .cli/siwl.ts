#!/usr/bin/env node
// "pnpm run siwl" for ailias, or "pnpm -s dlx tsx .cli/siwl.ts <cmd> --opt" for direct run

import fs from "fs";
import chalk from "chalk";

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
        console.log(chalk.bgYellowBright(`${model}/${filename}.md already exists!`));
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
          if (err) throw err;
          console.log(`added ${chalk.green(`${model}/${filename}.md`)}`);
          process.exit(0);
        });

    } else if (model === "tag") {

      // ファイル
      const file = `./src/content/${model}/${filename}.yaml`;
      if (fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml already exists!`));
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `isDraft: true\nname: \nbelong: tech\nicon: ./icons/\n`,
        (err) => {
          if (err) throw err;
          console.log(`added ${chalk.green(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });

    } else {

      // ファイル
      const file = `./src/content/${model}/${filename}.yaml`;
      if (fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml already exists!`));
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `isDraft: true\nname: \ndescription: \nurl: \n`,
        (err) => {
          if (err) throw err;
          console.log(`added ${chalk.green(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
    }
  });

// rm
program
  .command("rm")
  .alias("delete")
  .description("remove a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {
      fs.unlink(`./src/content/${model}/${filename}.md`, (err) => {
        if (err) {
          console.log(chalk.bgYellowBright(`${model}/${filename}.md does not exist!`));
          process.exit(1);
        };
        console.log(`removed ${chalk.red(`${model}/${filename}.md`)}`);
        process.exit(0);
      });
    } else if (model === "tag") {
      fs.unlink(`./src/content/${model}/${filename}.yaml`, (err) => {
        if (err) {
          console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
          process.exit(1);
        };
        console.log(`removed ${chalk.red(`${model}/${filename}.yaml`)}`);
        process.exit(0);
      });
    } else {
      fs.unlink(`./src/content/${model}/${filename}.yaml`, (err) => {
        if (err) {
          console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
          process.exit(1);
        };
        console.log(`removed ${chalk.red(`${model}/${filename}.yaml`)}`);
        process.exit(0);
      });
    }
  });

// draft
program
  .command("draft")
  .description("drafting a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {

      const file = `./src/content/${model}/${filename}.md`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.md does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: false/, 'isDraft: true');
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`drafted ${chalk.blue(`${model}/${filename}.md`)}`);
          process.exit(0);
        });
      });

    } else if (model === "tag") {

      const file = `./src/content/${model}/${filename}.yaml`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: false/, 'isDraft: true');
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`drafted ${chalk.blue(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
      });

    } else {

      const file = `./src/content/${model}/${filename}.yaml`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: false/, 'isDraft: true');
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`drafted ${chalk.blue(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
      });

    }
  })

// publish
program
  .command("publish")
  .description("publishing a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {

      const file = `./src/content/${model}/${filename}.md`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.md does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: true/, 'isDraft: false').replace(/updateDate: \d{4}-\d{2}-\d{2}/, `updateDate: ${new Date().toLocaleDateString("ja-JP", {
          year: "numeric", month: "2-digit",
          day: "2-digit"
        }).replaceAll('/', '-')}`);
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`published ${chalk.magenta(`${model}/${filename}.md`)}`);
          process.exit(0);
        });
      });

    } else if (model === "tag") {

      const file = `./src/content/${model}/${filename}.yaml`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: true/, 'isDraft: false');
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`published ${chalk.magenta(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
      });

    } else {

      const file = `./src/content/${model}/${filename}.yaml`;
      if (!fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml does not exist!`));
        process.exit(1);
      }

      fs.readFile(file, 'utf8', (err, data) => {
        if (err) throw err;
        const newData = data.replace(/isDraft: true/, 'isDraft: false');
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`published ${chalk.magenta(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
      });

    }
  })

// list
program
  .command("ls")
  .alias("list")
  .description("view content list")
  .option("-m, --model <model>", 'which model to use "article" | "tag" | "bookmark"')
  .action((cmd) => {
    const model = getModel(cmd);

    fs.readdir(`./src/content/${model}/`, { withFileTypes: true }, (_, dirents) => {
      console.log(`${chalk.bgWhiteBright(`${model.toUpperCase()}`)} (${chalk.blue("drafted")}/${chalk.magenta("published")})`);
      for (const dirent of dirents) {
        if (dirent.isDirectory()) continue;
        fs.readFile(`./src/content/${model}/${dirent.name}`, 'utf8', (err, data) => {
          if (err) throw err;
          const isDraft = data.search(/isDraft: true/) === -1 ? false : true;
          console.log(`${isDraft ? chalk.blue("*") : chalk.magenta("*")} ${dirent.name.replace(".md", "").replace(".yaml", "")}`);
        })
      }
    });
  });

program.name("siwl").description("Content Management CLI").version("0.0.1", "-v, --version").parse(process.argv);