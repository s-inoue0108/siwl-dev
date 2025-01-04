#!/usr/bin/env node

import fs from "fs";
import readline from 'readline';
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

// open
program
  .command("code")
  .alias("cd")
  .description("open content by Visual Studio Code")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
  .action((cmd) => {
    const filename = getFilename(cmd);
    const model = getModel(cmd);

    const ext = model === "article" ? "md" : "yaml";
    const path = `./src/content/${model}/${filename}.${ext}`;

    exec(`code ${path}`, (error, stdout, stderr) => {
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
  });

// access
program
  .command("access")
  .alias("ac")
  .description("access article")
  .option("-f, --filename <filename>", "content filename")
  .option("-l, --local", 'use local server')
  .action((cmd) => {

    const openURL = (url: string) => {
      exec(`bash ./.cli/siwl/access.sh ${url}`, (error, stdout, stderr) => {
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

    let path = "";
    if (cmd.filename) {
      path = `blog/articles/${getFilename(cmd)}`;
    } else {
      path = "";
    }

    if (cmd.local) {
      const url = `http://localhost:8000/${path}`;
      openURL(url);
    } else {
      const url = `https://siwl.dev/${path}`;
      openURL(url);
    }
  });

// export
program
  .command("export")
  .alias("ex")
  .description("export content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-s, --style <style>", 'which markdown style to use (zenn|qiita)')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const file = `./src/content/article/${filename}.md`;

    if (cmd.style === "zenn") {
      const zennFile = `./zenn/articles/${filename}.md`;

      if (fs.existsSync(zennFile)) {
        console.log(chalk.bgYellowBright(`${zennFile} already exists!`));
        process.exit(1);
      }

      exec(`touch ${zennFile}`, (error, stdout, stderr) => {
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

      const rs = fs.createReadStream(file);
      const ws = fs.createWriteStream(zennFile);

      const rl = readline.createInterface({
        input: rs,
        output: ws,
      });

      let lc = 0;
      let lcTmp = 0;
      let isCodeBlock = false;
      let isRefBlock = false;

      rl.on("line", (line) => {

        lc++;

        if (/^```/.test(line) || /^\> ```/.test(line)) {
          isCodeBlock = !isCodeBlock;
        }

        if (isRefBlock === false && /^\>/.test(line)) {
          isRefBlock = true;
        }

        if (isRefBlock === true && !/^\>/.test(line)) {
          isRefBlock = false;
        }

        if (lc > 0 && lc < 11 && !isCodeBlock) {
          if (/^publishDate: |^updateDate: |^relatedArticles: /.test(line)) {
            return;
          } else if (/^title: /.test(line)) {
            ws.write(`${line}\n`);
          } else if (/^isDraft: /.test(line)) {
            ws.write(`published: false\n`);
          } else if (/^category: /.test(line)) {
            const newLine = line.replace(/^category: \"?(tech|idea)\"?$/, "type: $1");
            ws.write(`${newLine}\n`);
          } else if (/^tags: /.test(line)) {
            const newLine = line.replace(/^tags: \[(.*)\]$/, "topics: [$1]");
            ws.write(`${newLine}\n`);
          } else if (/^description: /.test(line)) {
            ws.write(`emoji: ""\n`);
          } else {
            ws.write(`${line}\n`);
          }
        } else if (/^\> \[\!.*\]/.test(line) && !isCodeBlock) {
          lcTmp = lc;
        } else if (lcTmp === lc + 1 && !isCodeBlock && isRefBlock) {
          lcTmp = 0;
        } else if (/^\*\[\!(?:image|table)\].*\*/.test(line) && !isCodeBlock) {
          return;
        } else if (/^https:\/\/(?:www\.)?gist\.github\.com\/[a-z0-9_-]+\/[a-z0-9]{1,32}?$/.test(line) && !isCodeBlock) {
          const newLine = `@[gist](${line})`;
          ws.write(`${newLine}\n`);
        } else if (/^https:\/\/(?:www\.)?codepen\.io\/[a-z0-9_-]+\/pen\/[a-zA-Z]+$/.test(line) && !isCodeBlock) {
          const newLine = `@[codepen](${line})`;
          ws.write(`${newLine}\n`);
        } else if (/^https:\/\/(?:www\.)?speakerdeck\.com\/[a-z0-9_-]+\/[a-z0-9_-]+$/.test(line) && !isCodeBlock) {
          const newLine = `@[speakerdeck](${line})`;
          ws.write(`${newLine}\n`);
        } else if (/^https:\/\/(?:www\.)?docswell\.com\/s\/[a-z0-9_-]+\/[a-zA-Z0-9-]+$/.test(line) && !isCodeBlock) {
          const newLine = `@[docswell](${line})`;
          ws.write(`${newLine}\n`);
        } else {
          ws.write(`${line}\n`);
        }
      });

      rl.on("close", () => {
        console.log(`generated ${chalk.cyan(zennFile)}`);
      });

    }

  });

program.name("siwl").description("Contents Management CLI").version("1.0", "-v, --version").parse(process.argv);
