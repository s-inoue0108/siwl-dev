# SIWL.dev

Personal website of [@s-inoue0108](https://github.com/s-inoue0108), built with Astro, SolidJS and Tailwind CSS.

## General Commands

### Activate local server

```bash
# Using Yarn
yarn dev

yarn start
```

## Contents Management CLI

Execute `/.cli/siwl.ts` using `npm` script. Built with [commander.js](https://github.com/tj/commander.js), execute by [tsx](https://github.com/privatenumber/tsx).

### Usage

```bash
# Using Yarn
yarn run siwl <action> -option <arg>
```

### Available `<action>`s and `-option`s

| `<action>`     | `-option <arg>`            | Description                                                                                     |
| :------------- | :------------------------- | ----------------------------------------------------------------------------------------------- |
| `add\|new`     | `-f <filename> -m <model>` | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                       |
| `remove\|rm`   | `-f <filename> -m <model>` | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                             |
| `draft\|dft`   | `-f <filename> -m <model>` | Draft `src/content/<model>/<filename>.(md\|yaml)`.                                              |
| `publish\|pub` | `-f <filename> -m <model>` | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`. |
| `list\|ls`     | `-m <model>`               | List `src/content/<model>/` with status.                                                        |
|                | `-h`                       | Display help.                                                                                   |
|                | `-v`                       | Display version.                                                                                |

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

## Markdown Syntax

Please refer to [this page](https://siwl.dev/blog/articles/markdown-syntax-guide).