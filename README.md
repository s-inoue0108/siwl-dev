# SIWL.dev

Personal website of [@s-inoue0108](https://github.com/s-inoue0108), built with [AstroJS](https://astro.build/), [SolidJS](https://solidjs.com) and [Tailwind CSS](https://tailwindcss.com).

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
# push all changes
yarn deploy

# push to origin/main omit zenn/* and qiita/*
yarn deploy --siwl

# push to origin/main and @s-inoue0108/siwl-dev-zenn only zenn/*
yarn deploy --zenn

# push to origin/main and @s-inoue0108/siwl-dev-qiita only qiita/*
yarn deploy --qiita
```

## 📂 Contents Management CLI

Execute `/.cli/siwl.ts` via `npm` script. This script is built by [Commander.js](https://github.com/tj/commander.js), execute by [tsx](https://github.com/privatenumber/tsx).

### Usage

```bash
yarn siwl <action> -option <arg>
```

> [!TIP]
> `yarn` can be omitted by setting the `alias siwl="yarn siwl"` to `~/.bashrc`.

### Available `<action>`s and `-option`s

| `<action>`     | `-option <arg>`                           | `--longoption <arg>`                                          | Description                                                                                       |
| :------------- | :---------------------------------------- | :------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `create\|new`  | `-f <filename> [-m <model>]`              | `--filename <filename> [--model <model>]`                     | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                         |
| `remove\|rm`   | `-f <filename> [-m <model>]`              | `--filename <filename> [--model <model>]`                     | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                               |
| `draft\|dft`   | `-f <filename> [-m <model>]`              | `--filename <filename> [--model <model>]`                     | Draft `src/content/<model>/<filename>.(md\|yaml)`.                                                |
| `publish\|pub` | `-f <filename> [-m <model>]`              | `--filename <filename> [--model <model>]`                     | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`.   |
| `rename\|rn`   | `-f <filename> -n <newname> [-m <model>]` | `--filename <filename> --newname <newname> [--model <model>]` | Rename `src/content/<model>/<filename>.(md\|yaml)` to `src/content/<model>/<newname>.(md\|yaml)`. |
| `list\|ls`     | `[-m <model>] [-p\|-d]`                   | `[--model <model>] [--publised\|--drafted]`                   | List `src/content/<model>/` with status.                                                          |
| `open\|op`     | `-f <filename> [-m <model>]`              | `--filename <filename> [--model <model>]`                     | Open `src/content/<model>/<filename>.(md\|yaml)` by Visual Studio Code.                           |
| `view\|vi`     | `[-f <filename>] [-l]`                    | `[--filename <filename>] [--local]`                           | View specified article using browser.                                                             |
| `export\|ex`   | `-f <filename> -t <mdtype>`               | `--filename <filename> --type <mdtype>`                       | Export markdown with specified type.                                                              |
|                | `-h`                                      | `--help`                                                      | Display help.                                                                                     |
|                | `-v`                                      | `--version`                                                   | Display version.                                                                                  |

> [!TIP]
> Use `<action> -h` to display help for each actions.

### Available `<model>`s

| `<model>`  | Description               | Filetype |
| :--------- | :------------------------ | :------- |
| `article`  | Article page for blog.    | md       |
| `tag`      | Tag to classify articles. | yaml     |
| `bookmark` | Link to external website. | yaml     |
| `work`     | My web work.              | yaml     |

> [!IMPORTANT]
> If `<model>` is unspecified or typo, it refers to `article`.

## ✅ Markdown Syntax

- Please refer to [this page](https://siwl.dev/blog/articles/markdown-syntax-guide).

## 🧑‍💻 Zenn

- Please refer to [this page](https://github.com/s-inoue0108/siwl-dev-zenn).

## 🧑‍💻 Qiita

- Please refer to [this page](https://github.com/s-inoue0108/siwl-dev-qiita).