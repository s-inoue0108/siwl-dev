# SIWL.dev Zenn

This is the subtree of [@s-inoue0108/siwl-dev](https://github.com/s-inoue0108/siwl-dev).

## Zenn CLI

Zenn CLI can be used in `/zenn/*`.

* [📘 How to use](https://zenn.dev/zenn/articles/zenn-cli-guide)

```bash
# add article
yarn zenn new:article

# preview
yarn zenn preview
```

## Deploy

### Push to parent repository with zenn repository

```bash
yarn run deploy --zenn
```

### Push only zenn repository

```bash
git subtree push --prefix=zenn zenn main
```

## Export article from SIWL.dev

Automatically rewrite frontmatter and non-compliant syntax.

```bash
yarn run siwl ex -f <filename> -s zenn
```