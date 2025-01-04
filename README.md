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
yarn run deploy

# push with @s-inoue0108/siwl-dev-zenn
yarn run deploy --zenn

# push with @s-inoue0108/siwl-dev-qiita
yarn run deploy --qiita
```

## 📂 Contents Management CLI

Execute `/.cli/siwl.ts` via `npm` script. This script is built by [Commander.js](https://github.com/tj/commander.js), execute by [tsx](https://github.com/privatenumber/tsx).

### Usage

```bash
yarn run siwl <action> -option <arg>
```

> [!TIP]
> `yarn run` can be omitted by setting the `alias siwl="yarn run siwl"` to `~/.bashrc`.

### Available `<action>`s and `-option`s

| `<action>`     | `-option <arg>`              | Description                                                                                     |
| :------------- | :--------------------------- | ----------------------------------------------------------------------------------------------- |
| `add\|new`     | `-f <filename> [-m <model>]` | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                       |
| `remove\|rm`   | `-f <filename> [-m <model>]` | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                             |
| `draft\|dft`   | `-f <filename> [-m <model>]` | Draft `src/content/<model>/<filename>.(md\|yaml)`.                                              |
| `publish\|pub` | `-f <filename> [-m <model>]` | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`. |
| `list\|ls`     | `[-m <model>] [-p] [-d]`     | List `src/content/<model>/` with status.                                                        |
| `code\|cd`     | `-f <filename> [-m <model>]` | Open `src/content/<model>/<filename>.(md\|yaml)` by Visual Studio Code.                         |
| `access\|ac`   | `[-f <filename>] [-l]`       | Access to article using browser.                                                                |
| `export\|ex`   | `-f <filename> [-s]`         | Export markdown with specified style.                                                           |
|                | `-h`                         | Display help.                                                                                   |
|                | `-v`                         | Display version.                                                                                |

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