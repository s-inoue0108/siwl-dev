# SIWL.dev

https://siwl.dev

Personal website of [@s-inoue0108](https://github.com/s-inoue0108).

- [SIWL.dev](#siwldev)
	- [Contents Management CLI](#contents-management-cli)
		- [Alias configuration](#alias-configuration)
		- [Usage](#usage)
		- [Available `<action>`s and `-option`s](#available-actions-and--options)
		- [Available `<model>`s](#available-models)
	- [General Commands](#general-commands)
	- [Markdown Syntax](#markdown-syntax)


## Contents Management CLI

Execute `/.cli/siwl.ts`.
\
Built with [commander.js](https://github.com/tj/commander.js), execute by [tsx](https://github.com/privatenumber/tsx).

### Alias configuration

Add to `~/.bashrc`:

```bash
alias siwl="source /path/to/dir/.cli/siwl.sh"
```

### Usage

```bash
# Using pnpm
pnpm run siwl <action> -option <arg>

# Using alias
siwl -option <arg> <action>
```

### Available `<action>`s and `-option`s

| `<action>`     | `-option <arg>`            | description                                                                                     |
| :------------- | :------------------------- | ----------------------------------------------------------------------------------------------- |
| `add\|new`     | `-f <filename> -m <model>` | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                       |
| `remove\|rm`   | `-f <filename> -m <model>` | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                             |
| `draft\|dft`   | `-f <filename> -m <model>` | Draft `src/content/<model>/<filename>.(md\|yaml)`.                                              |
| `publish\|pub` | `-f <filename> -m <model>` | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`. |
| `list\|ls`     | `-m <model>`               | List `src/content/<model>/` with status.                                                        |
|                | `-h`                       | Display help.                                                                                   |
|                | `-v`                       | Display version.                                                                                |

> [!TIP]
> Type `<action> -h` to display help for each `<action>`s.

### Available `<model>`s

| `<model>`  | description                | filetype |
| :--------- | :------------------------- | :------- |
| `article`  | Article page for blog.     | md       |
| `tag`      | Tags to classify articles. | yaml     |
| `bookmark` | Links to external website. | yaml     |
| `work`     | My production.             | yaml     |

> [!IMPORTANT]
> If `<model>` is unspecified or typo, it refers to `article`.

## General Commands

Execute `/.cli/siwl.sh`. Content Management CLI is integrated into this script.

```bash
# Using alias
$ siwl -option <arg>
```

| `-option <arg>` | description                                                                           |
| :-------------- | :------------------------------------------------------------------------------------ |
| `-d`            | Activate dev server.                                                                  |
| `-b <branch>`   | Push changes to `origin/<branch>` and merge into `origin/main`.                       |
| `-s`            | Synchronize the current local branch with the contents of `origin/main`.              |
| `-h`            | Displays information related to this project and help for the Content Management CLI. |

## Markdown Syntax

Please refer to https://siwl.dev/blog/articles/markdown-syntax-guide.