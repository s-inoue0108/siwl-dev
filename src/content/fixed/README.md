---
title: README
description: README of this site.
publishDate: 2024-10-04T00:00:00+09:00
updateDate: 2026-08-15T09:47:00+09:00
---

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

## 📂 Contents Management CLI

Execute `/cli/main.go` via Go `>=v1.24`.

### Install

Supported macOS or Linux.

```sh
curl -fsSL https://raw.githubusercontent.com/s-inoue0108/siwl-dev/main/cli-install.sh | sh
```

### Usage

```bash
siwl <action> <model> <args> <-options>
```

> [!TIP]
>
> `yarn` can be omitted by setting the `alias siwl="yarn siwl"` to `~/.bashrc`.

### Available actions and options

| `<action>`  | Description                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------ |
| `add`       | Create `src/content/<model>/<filename>.(md\|yaml)` and initialize schema.                         |
| `remove`    | Remove `src/content/<model>/<filename>.(md\|yaml)`.                                               |
| `unpublish` | Unpublish `src/content/<model>/<filename>.(md\|yaml)`.                                            |
| `publish`   | Publish `src/content/<model>/<filename>.(md\|yaml)` and update timestamp if model is `article`.   |
| `list`      | List `src/content/<model>/` with status.                                                          |
|             | Display help.                                                                                     |
|             | Display version.                                                                                  |

### Available asset models

| Model      | Description               | Filetype |
| :--------- | :------------------------ | :------- |
| `article`  | Article page for blog.    | md       |
| `tag`      | Tag to classify articles. | yaml     |
| `bookmark` | Link to external website. | yaml     |

## ✅ Markdown Syntax

https://siwl.dev/blog/articles/markdown-syntax-guide

## 🧑‍💻 Zenn Binding

https://github.com/s-inoue0108/siwl-dev-zenn

## 🧑‍💻 Qiita Binding

https://github.com/s-inoue0108/siwl-dev-qiita