# SIWL.dev Zenn

This is the subtree of [@s-inoue0108/siwl-dev](https://github.com/s-inoue0108/siwl-dev).

- https://zenn.dev/s_inoue0108

## Zenn CLI

Zenn CLI can be used in `/zenn/*`.

* [📘 How to use](https://zenn.dev/zenn/articles/zenn-cli-guide)

## Export article from this blog

Automatically rewrite frontmatter and non-compliant syntax.

```bash
yarn run siwl ex -f <filename> -t zenn
```

### Push to parent repository with zenn repository

```bash
yarn run deploy --zenn
```

### Push only zenn repository

```bash
git subtree push --prefix=zenn zenn main
```

### Synchronize

```bash
git subtree pull --prefix=zenn --squash zenn main
yarn run deploy
```