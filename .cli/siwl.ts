#!/usr/bin/env node

import fs from "fs";
import { exec } from "child_process";
import chalk from "chalk";
import { Command } from "commander";
import { toISOStringWithTimezone } from "../src/utils/common/utilfuncs";

const program = new Command();

const getModel = (cmd: any) => {
  const isModel = (arg: string | undefined): arg is ("article" | "tag" | "bookmark" | "work") => {
    return arg === "article" || arg === "tag" || arg === "bookmark" || arg === "work" ? true : false;
  }
  const model: "article" | "tag" | "bookmark" | "work" = isModel(cmd.model) ? cmd.model : "article";
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
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
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
        `---\nisDraft: true\ntitle: \ncategory: tech\ntags: []\ndescription: ""\npublishDate: ${toISOStringWithTimezone(new Date())}\nupdateDate: ${toISOStringWithTimezone(new Date())}\nrelatedArticles: []\n---`,
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

    } else if (model === "bookmark") {

      // ファイル
      const file = `./src/content/${model}/${filename}.yaml`;
      if (fs.existsSync(file)) {
        console.log(chalk.bgYellowBright(`${model}/${filename}.yaml already exists!`));
        process.exit(1);
      }

      // 書き込み
      fs.writeFile(file,
        `isDraft: true\nname: \ndescription: ""\nurl: \n`,
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
        `isDraft: true\ntitle: \ndescription: ""\nurl: \ngithub: \nkeywords: []\nimage: ./images/\n`,
        (err) => {
          if (err) throw err;
          console.log(`added ${chalk.green(`${model}/${filename}.yaml`)}`);
          process.exit(0);
        });
    }
  });

// rm
program
  .command("remove")
  .alias("rm")
  .description("remove a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
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
  .alias("dft")
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
  .alias("pub")
  .description("publishing a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
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
        const newData = data.replace(/isDraft: true/, 'isDraft: false').replace(/updateDate: \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/, `updateDate: ${toISOStringWithTimezone(new Date())}`);
        fs.writeFile(file, newData, (err) => {
          if (err) throw err;
          console.log(`published ${chalk.magenta(`${model}/${filename}.md`)}`);
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
  .command("list")
  .alias("ls")
  .description("view content list")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
  .option("-d, --drafted", "show drafted contents")
  .option("-p, --published", "show published contents")
  .action((cmd) => {

    const model = getModel(cmd);

    const getSlug = (isDraft: boolean, slug: string) => {
      return isDraft ? chalk.blue(slug) : chalk.magenta(slug);
    }

    fs.readdir(`./src/content/${model}/`, { withFileTypes: true }, (_, dirents) => {
      console.log(`${chalk.bgWhiteBright(`${model.toUpperCase()}`)} (${chalk.blue("drafted")}/${chalk.magenta("published")})`);
      for (const dirent of dirents) {
        if (dirent.isDirectory()) continue;
        fs.readFile(`./src/content/${model}/${dirent.name}`, 'utf8', (err, data) => {
          if (err) throw err;
          const isDraft = data.search(/isDraft: true/) === -1 ? false : true;

          if (cmd.drafted && !isDraft) return;
          if (cmd.published && isDraft) return;

          console.log(getSlug(isDraft, `* ${dirent.name.replace(".md", "").replace(".yaml", "")}`));
          if (model === "article") {
            const title = data.match(/title: (.*)/)![0].replace("title: ", "");
            console.log(`${title}\n`);
          }
        })
      }
    });
  });

// access
program
  .command("access")
  .alias("ac")
  .description("access article")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-l, --local", 'use local server')
  .action((cmd) => {
    const filename = getFilename(cmd);
    const path = `blog/articles/${filename}`;

    const openURL = (url: string) => {
      exec(`bash ./.cli/access.sh ${url}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(stderr);
          return;
        }
        console.log(stdout);
      });
    }

    if (cmd.local) {
      const url = `http://localhost:8000/${path}`;
      openURL(url);
    } else {
      const url = `https://siwl.dev/${path}`;
      openURL(url);
    }
  });

program.name("siwl").description("Contents Management CLI").version("1.0", "-v, --version").parse(process.argv);
