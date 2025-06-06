# SIWL.dev

Personal website of [@s-inoue0108](https://github.com/s-inoue0108).

https://siwl.dev

- [View README on GitHub](https://github.com/s-inoue0108/siwl-dev/blob/main/README.md)
- [View README on Website](https://siwl.dev/readme)

Built with:
- [AstroJS](https://astro.build/) v4.15.9
- [SolidJS](https://solidjs.com) v1.8.23
- [Tailwind CSS](https://tailwindcss.com) v3.4.13

## 💿 GitHub Repo

https://github.com/s-inoue0108/siwl-dev

## 🌐 System Structure

![System Structure](./public/structure.drawio.svg)

## 💻 General Commands

### Start local server

The following environment is recommended:

- Node.js `>=v20` && npm `v10`
- Yarn `v1.22`
- Visual Studio Code `v1.96`
- Git `v2.40`

```bash
yarn dev
```

### Deploy

Execute `/.cli/deploy.sh` via `npm` script.

```bash
# push to origin/main omit zenn/* and qiita/*
yarn deploy

# push to origin/main and @s-inoue0108/siwl-dev-zenn only zenn/*
yarn deploy --zenn

# push to origin/main and @s-inoue0108/siwl-dev-qiita only qiita/*
yarn deploy --qiita

# push all changes
yarn deploy --all
```

## 📂 Contents Management CLI

Execute `/.cli/siwl.ts` via `npm` script. This script is built by [Commander.js](https://github.com/tj/commander.js), execute by [tsx](https://github.com/privatenumber/tsx).

### Usage

```bash
yarn siwl <action> -option <arg>
```

> [!TIP]
> 
> `yarn` can be omitted by setting the `alias siwl="yarn siwl"` to `~/.bashrc`.

### Available actions and options

| `<action>`     | `-option <arg>`                                           | Description                                                                                       |
| :------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| `create\|new`  | `-f <filename> [-m <model>]`                              | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                         |
| `remove\|rm`   | `-f <filename> [-m <model>]`                              | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                               |
| `draft\|dft`   | `-f <filename> [-m <model>]`                              | Draft `src/content/<model>/<filename>.(md\|yaml)`.                                                |
| `publish\|pub` | `-f <filename> [-m <model>] [-R] [-L]`                    | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`.   |
| `rename\|rn`   | `-f <filename> -n <newname> [-m <model>]`                 | Rename `src/content/<model>/<filename>.(md\|yaml)` to `src/content/<model>/<newname>.(md\|yaml)`. |
| `list\|ls`     | `[-m <model>] [-p\|-d]`                                   | List `src/content/<model>/` with status.                                                          |
| `open\|op`     | `-f <filename\|readme> [-m <model>]`                      | Open `src/content/<model>/<filename>.(md\|yaml)` by Visual Studio Code.                           |
| `view\|vi`     | `[-f <filename\|readme>] [-l]`                            | View specified webpage using browser.                                                             |
| `export\|ex`   | `-f <filename\|readme> [-t <mdtype>] [-n <newname>] [-F]` | Export `article` with specified markdown type.                                                    |
|                | `-h`                                                      | Display help.                                                                                     |
|                | `-v`                                                      | Display version.                                                                                  |

> [!IMPORTANT]
> 
> Use `<action> -h` to display help for each actions. Run this command to see the `--longoption`.

### Available `<model>`s

| `<model>`  | Description               | Filetype |
| :--------- | :------------------------ | :------- |
| `article`  | Article page for blog.    | md       |
| `tag`      | Tag to classify articles. | yaml     |
| `bookmark` | Link to external website. | yaml     |
| `work`     | My web work.              | yaml     |

> [!TIP]
> 
> If `<model>` is unspecified or typo, it refers to `article`.

## ✅ Markdown Syntax

https://siwl.dev/blog/articles/markdown-syntax-guide

## 🧑‍💻 Zenn Binding

https://github.com/s-inoue0108/siwl-dev-zenn

## 🧑‍💻 Qiita Binding

https://github.com/s-inoue0108/siwl-dev-qiita