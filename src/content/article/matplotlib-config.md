---
isDraft: false
isLimited: false
title: Matplotlib スクリプト集
category: tech
tags: [python]
description: "Matplotlib と Pandas によるプロット生成の例をまとめます。"
publishDate: 2025-01-27T18:22:24+09:00
updateDate: 2025-01-27T18:45:03+09:00
relatedArticles: []
---

## 論文スタイル

データファイル (`txt` や `csv`, `tsv` など) から、オーソドックスな見た目のプロットを生成する例です。

```bash:実行
python plot.py <filename> --save=[True|False]
```

この例では、指数表記を $a \times 10^b$ スタイルで表示します。

```python:plot.py
import matplotlib.pyplot as plt
import matplotlib.ticker as ptick
import pandas as pd
import argparse as ap

def main():
  args = get_args()
  df = get_data()
  exec_plot(df, args)

# コマンドライン引数
def get_args():
  parser = ap.ArgumentParser()
  parser.add_argument("filename", type=str)                # ファイル名
  parser.add_argument("--save", type=bool, default=True)   # 画像保存の有無
  args = parser.parse_args()
  return args

# データファイルから DataFrame を生成
def get_data(args):
  df = pd.read_csv(args.filename, comment='#', header=None, sep='\t', encoding="utf-8", engine="python")
  return df

# プロット実行
def exec_plot(df, args):
  plt.rcParams['font.family'] = 'Times New Roman'   # フォント
  plt.rcParams['mathtext.fontset'] = 'cm'           # 数式フォント
  plt.rcParams["font.size"] = 16                    # フォントサイズ
  plt.rcParams['xtick.labelsize'] = 14              # x軸のフォントサイズ
  plt.rcParams['ytick.labelsize'] = 14              # y軸のフォントサイズ
  plt.rcParams['axes.linewidth'] = 1.0              # サブプロットの囲み枠の太さ
  plt.rcParams['axes.grid'] = True                  # Grid の有無
  plt.rcParams["legend.fancybox"] = False           # 角丸

  # figure と axis の追加
  fig = plt.figure(figsize=(8, 8))
  ax = fig.add_subplot(1, 1, 1)

  # 指数表記を a * 10^b に変更
  ax.xaxis.set_major_formatter(ptick.ScalarFormatter(useMathText=True))
  ax.yaxis.set_major_formatter(ptick.ScalarFormatter(useMathText=True))
  ax.ticklabel_format(style='sci', axis='both')

  # 軸ラベル（r"$formula$" で TeX が使える）
  ax.set_xlabel(r"$x$")
  ax.set_ylabel(r"$y$")

  # プロット
  ax.plot(df["Coordinate"], df["Energy"], color="red")
  ax.scatter(df["Coordinate"], df["Energy"], color="red")

  # 画像の保存
  if (args.save):
    fig.savefig(f'{args.filename}.png', bbox_inches="tight", pad_inches=0.05)

  # 表示
  plt.show()


# 実行
if "__name__" == "__main__":
    main()
```

### 参考

https://qiita.com/MENDY/items/fe9b0c50383d8b2fd919

https://qiita.com/Fortinbras/items/50500423888ef21429be

