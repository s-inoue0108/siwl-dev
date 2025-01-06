#!/usr/bin/env node

import fs from "fs";
import readline from 'readline';
import { exec, execSync } from "child_process";
import chalk from "chalk";
import { Command } from "commander";
import { toISOStringWithTimezone } from "../src/utils/common/utilfuncs";
import { randomEmoji } from "../src/utils/api/emoji";

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

const rootpath = "./src/content";

// create
program
  .command("create")
  .alias("new")
  .description("add a new content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);

    if (model === "article") {

      // ファイル
      const file = `${rootpath}/${model}/${filename}.md`;
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
      const file = `${rootpath}/${model}/${filename}.yaml`;
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
      const file = `${rootpath}/${model}/${filename}.yaml`;
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
      const file = `${rootpath}/${model}/${filename}.yaml`;
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
      fs.unlink(`${rootpath}/${model}/${filename}.md`, (err) => {
        if (err) {
          console.log(chalk.bgYellowBright(`${model}/${filename}.md does not exist!`));
          process.exit(1);
        };
        console.log(`removed ${chalk.red(`${model}/${filename}.md`)}`);
        process.exit(0);
      });
    } else {
      fs.unlink(`${rootpath}/${model}/${filename}.yaml`, (err) => {
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

      const file = `${rootpath}/${model}/${filename}.md`;
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

      const file = `${rootpath}/${model}/${filename}.yaml`;
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

      const file = `${rootpath}/${model}/${filename}.md`;
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

      const file = `${rootpath}/${model}/${filename}.yaml`;
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
  });

// rename
program
  .command("rename")
  .alias("rn")
  .description("renaming a content")
  .requiredOption("-f, --filename <filename>", "content filename")
  .requiredOption("-n, --newname <newname>", "new filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
  .action((cmd) => {

    const filename = getFilename(cmd);
    const model = getModel(cmd);
    const newName = cmd.newname;

    const ext = model === "article" ? "md" : "yaml";

    const file = `${rootpath}/${model}/${filename}.${ext}`;
    const newFile = `${rootpath}/${model}/${newName}.${ext}`;

    if (fs.existsSync(newFile)) {
      console.log(chalk.bgYellowBright(`${model}/${newName}.${ext} does already exist!`));
      process.exit(1);
    }

    exec(`mv ${file} ${newFile}`, (error, _, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(stderr);
        return;
      }
      console.log(`renamed ${chalk.yellow(`${model}/${filename}.${ext}`)} to ${chalk.green(`${model}/${newName}.${ext}`)}`);
    });
  });

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

    fs.readdir(`${rootpath}/${model}/`, { withFileTypes: true }, (_, dirents) => {
      console.log(`${chalk.bgWhiteBright(`${model.toUpperCase()}`)} (${chalk.blue("drafted")}/${chalk.magenta("published")})`);
      for (const dirent of dirents) {
        if (dirent.isDirectory()) continue;
        fs.readFile(`${rootpath}/${model}/${dirent.name}`, 'utf8', (err, data) => {
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
  .command("open")
  .alias("op")
  .description("open content by Visual Studio Code")
  .requiredOption("-f, --filename <filename>", "content filename")
  .option("-m, --model <model>", 'which model to use (article|tag|bookmark|work)')
  .action((cmd) => {
    const filename = getFilename(cmd);
    const model = getModel(cmd);

    const ext = model === "article" ? "md" : "yaml";
    const path = `${rootpath}/${model}/${filename}.${ext}`;

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

// view
program
  .command("view")
  .alias("vi")
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
  .requiredOption("-t, --type <mdtype>", 'which markdown type to use (zenn|qiita)')
  .option("-F, --force", 'force export')
  .action(async (cmd) => {

    const filename = getFilename(cmd);
    const file = `${rootpath}/article/${filename}.md`;

    if (cmd.type === "zenn") {
      const zennFile = `./zenn/articles/${filename}.md`;

      if (fs.existsSync(zennFile) && !cmd.force) {
        console.log(chalk.bgYellowBright(`${zennFile} already exists!`));
        process.exit(1);
      } else if (fs.existsSync(zennFile) && cmd.force) {
        execSync(`rm -f ${zennFile}`);
      }

      execSync(`touch ${zennFile}`);

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

      for await (const line of rl) {
        lc++;

        await (async () => {
          if (/^https:\/\/(?:www\.)?speakerdeck\.com\/[a-z0-9_-]+\/[a-z0-9_-]+$/.test(line) && !isCodeBlock) {
            const html = await (async (url: string): Promise<string> => {
              const endpoint = "https://speakerdeck.com/oembed.json";
              const query = encodeURIComponent(url);
              const resp = await fetch(`${endpoint}?url=${query}`);
              const json = await resp.json();
              return json.html;
            })(line);

            const match = html.match(/src\=\"\/\/speakerdeck\.com\/player\/([a-z0-9]+)\" /);
            if (!match) {
              return;
            }

            const newLine = `@[speakerdeck](${match[1]})`;
            ws.write(`${newLine}\n`);

          } else if (/^https:\/\/(?:www\.)?gist\.github\.com\/[a-z0-9_-]+\/[a-z0-9]{1,32}?$/.test(line) && !isCodeBlock) {
            const newLine = `@[gist](${line})`;
            ws.write(`${newLine}\n`);
          } else if (/^https:\/\/(?:www\.)?codepen\.io\/[a-z0-9_-]+\/pen\/[a-zA-Z]+$/.test(line) && !isCodeBlock) {
            const newLine = `@[codepen](${line})`;
            ws.write(`${newLine}\n`);
          } else if (/^https:\/\/(?:www\.)?docswell\.com\/s\/[a-z0-9_-]+\/[a-zA-Z0-9-]+$/.test(line) && !isCodeBlock) {
            const newLine = `@[docswell](${line})`;
            ws.write(`${newLine.replace(/https\:\/\/(?:www\.)?docswell\.com\//, "https://www.docswell.com/")}\n`);
          } else if (/^https?\:\/\//.test(line)) {
            ws.write(`${line}\n`);
          }
        })();

        await (async () => {
          if (/^```/.test(line) || /^\> ```/.test(line)) {
            isCodeBlock = !isCodeBlock;
          }
        })();

        await (async () => {
          if (!isRefBlock && /^\>/.test(line)) {
            isRefBlock = true;
          } else if (isRefBlock && !/^\>/.test(line)) {
            isRefBlock = false;
          }
        })();

        await (async () => {
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
              ws.write(`emoji: ${randomEmoji()}\n`);
            } else {
              ws.write(`${line}\n`);
            }
          } else if (/^\> \[\!.*\]/.test(line) && !isCodeBlock && isRefBlock) {
            lcTmp = lc;
          } else if (lcTmp === lc - 1 && !isCodeBlock && isRefBlock) {
            lcTmp = 0;
          } else if (/^\*\[\!(?:image|table)\].*\*/.test(line) && !isCodeBlock) {
            return;
          } else if (/^\!\[.*\]\(.+(?:\.jpe?g|\.png|\.svg)\)$/.test(line) && !isCodeBlock) {
            const relPathMatch = line.match(/^\!\[.*\]\((.+(?:\.jpe?g|\.png|\.svg))\)$/);
            if (!relPathMatch) return;
            const relPath = relPathMatch[1];
            const partPath = relPath.replace(/^\.{0,2}\/?images\//, "");

            const toDirPath = `./zenn/images`;
            if (!fs.existsSync(`${toDirPath}/${filename}/`)) {
              fs.mkdirSync(`${toDirPath}/${filename}/`);
            }

            execSync(`cp ./src/content/article/images/${partPath} ${toDirPath}/${partPath}`);
          } else if (/^\@\{(?:wiki|wikimedia|wikipedia)(?:\:[a-z]{1,3})?\}\(.+\)$/.test(line) && !isCodeBlock) {
            const strMatch = line.match(/^\@\{(?:wiki|wikimedia|wikipedia)(\:[a-z]{1,3})?\}\((.+)\)$/);
            if (!strMatch) return;

            let lang = "ja";
            if (strMatch[1]) lang = strMatch[1].replace(":", "");

            const str = strMatch[2];
            const url = `https://${lang}.wikipedia.org/wiki/${str}`;
            ws.write(`${url}\n`);
          } else if (!/^https?\:\/\//.test(line)) {
            ws.write(`${line}\n`);
          }
        })();
      };

      rs.close();
      ws.end();
      rl.close();
      console.log(`generated ${chalk.cyan(zennFile)}`);

    } else if (cmd.type === "qiita") {
      const qiitaFile = `./qiita/public/${filename}.md`;

      if (fs.existsSync(qiitaFile) && !cmd.force) {
        console.log(chalk.bgYellowBright(`${qiitaFile} already exists!`));
        process.exit(1);
      } else if (fs.existsSync(qiitaFile) && cmd.force) {
        execSync(`rm -f ${qiitaFile}`);
      }

      execSync(`touch ${qiitaFile}`);

      const rs = fs.createReadStream(file);
      const ws = fs.createWriteStream(qiitaFile);

      const rl = readline.createInterface({
        input: rs,
        output: ws,
      });

      let lc = 0;
      let lcTmp = 0;
      let isCodeBlock = false;
      let isMathBlock = false;
      let isRefBlock = false;

      for await (const line of rl) {
        lc++;

        await (async () => {
          if (/^https:\/\/(?:www\.)?speakerdeck\.com\/[a-z0-9_-]+\/[a-z0-9_-]+$/.test(line) && !isCodeBlock) {
            const html = await (async (url: string): Promise<string> => {
              const endpoint = "https://speakerdeck.com/oembed.json";
              const query = encodeURIComponent(url);
              const resp = await fetch(`${endpoint}?url=${query}`);
              const json = await resp.json();
              return json.html;
            })(line);

            const idMatch = html.match(/src\=\"\/\/speakerdeck\.com\/player\/([a-z0-9]+?)\" /);
            const ratioMatch = html.match(/\aspect-ratio\:?([0-9\/]+?)\;/);

            if (!idMatch || !ratioMatch) {
              return;
            }

            const id = idMatch[1];
            const ratioParts = ratioMatch[1].split("/");
            const ratio = Number(ratioParts[0]) / Number(ratioParts[1]);

            const newLine = `<script async class="speakerdeck-embed" data-id="${id}" data-ratio="${Number(ratio)}" src="//speakerdeck.com/assets/embed.js"></script>`;
            ws.write(`${newLine}\n`);

          } else if (/^https:\/\/(?:www\.)?docswell\.com\/s\/[a-z0-9_-]+\/[a-zA-Z0-9-]+$/.test(line) && !isCodeBlock) {

            const html = await (async (url: string): Promise<string> => {
              const endpoint = "https://www.docswell.com/service/oembed";
              const query = encodeURIComponent(url);
              const resp = await fetch(`${endpoint}?url=${query}`);
              const json = await resp.json();
              return json.html;
            })(line);

            const srcMatch = html.match(/src\=\"([a-zA-Z0-9\.\/\:]+?)\" /);
            const ratioMatch = html.match(/\aspect-ratio\: ([0-9\/]+?)\;/);

            if (!srcMatch || !ratioMatch) {
              return;
            }

            const src = srcMatch[1];
            const ratioParts = ratioMatch[1].split("/");
            const ratio = Number(ratioParts[1]) / Number(ratioParts[0]);

            const newLine = `<script async class="docswell-embed" src="https://www.docswell.com/assets/libs/docswell-embed/docswell-embed.min.js" data-src="${src}" data-aspect="${ratio}"></script>`;
            ws.write(`${newLine}\n`);

          } else if (/^https?\:\/\//.test(line)) {
            ws.write(`${line}\n`);
          }
        })();

        await (async () => {
          if (/^```/.test(line) || /^\> ```/.test(line)) {
            isCodeBlock = !isCodeBlock;
          }
        })();

        await (async () => {
          if (!isRefBlock && /^\>/.test(line)) {
            isRefBlock = true;
          } else if (isRefBlock && !/^\>/.test(line)) {
            isRefBlock = false;
          }
        })();

        await (async () => {
          if (lc > 0 && lc < 11 && !isCodeBlock) {
            if (/^publishDate: |^updateDate: |^relatedArticles: |^category: |^description: /.test(line)) {
              return;
            } else if (/^title: /.test(line)) {
              ws.write(`${line}\n`);
            } else if (/^isDraft: /.test(line)) {
              ws.write(`ignorePublish: true\n`);
            } else if (/^tags: /.test(line)) {
              ws.write(`${line}\n`);
            } else if (/^---$/.test(line) && lc > 2) {
              ws.write(`private: false\nupdated_at: ''\nid: null\norganization_url_name: null\nslide: false\n${line}\n`);
            } else {
              ws.write(`${line}\n`);
            }
          } else if (/^\$\$$/.test(line) && !isMathBlock && !isCodeBlock) {
            isMathBlock = true;
            ws.write(`\`\`\`math\n`);
          } else if (/^\$\$$/.test(line) && isMathBlock && !isCodeBlock) {
            isMathBlock = false;
            ws.write(`\`\`\`\n`);
          } else if (/^\> \[\!.*\]/.test(line) && !isCodeBlock && isRefBlock) {
            lcTmp = lc;
          } else if (lcTmp === lc - 1 && !isCodeBlock && isRefBlock) {
            lcTmp = 0;
          } else if (/^\*\[\!(?:image|table)\].*\*/.test(line) && !isCodeBlock) {
            return;
          } else if (/^\@\{(?:wiki|wikimedia|wikipedia)(?:\:[a-z]{1,3})?\}\(.+\)$/.test(line) && !isCodeBlock) {
            const strMatch = line.match(/^\@\{(?:wiki|wikimedia|wikipedia)(\:[a-z]{1,3})?\}\((.+)\)$/);
            if (!strMatch) return;

            let lang = "ja";
            if (strMatch[1]) lang = strMatch[1].replace(":", "");

            const str = strMatch[2];
            const url = `https://${lang}.wikipedia.org/wiki/${str}`;
            ws.write(`${url}\n`);
          } else if (!/^https?\:\/\//.test(line)) {
            ws.write(`${line}\n`);
          }
        })();
      };

      rs.close();
      ws.end();
      rl.close();
      console.log(`generated ${chalk.green(qiitaFile)}`);
    }
  });

program
  .name("siwl")
  .description("Contents Management CLI")
  .version("2.1", "-v, --version")
  .parse(process.argv);
