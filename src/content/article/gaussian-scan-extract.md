---
isDraft: true
title: Perl で Gaussian のスキャン計算から座標情報を取得する
category: tech
tags: [perl, gaussian, comp-science]
description: Gaussian16 では、結合長、二面角といったパラメータを固定しながら構造最適化計算を繰り返す Relaxed Scan 計算が利用できます。今回は、Scan 計算の結果から最適構造の座標情報を抽出し、TD-DFT 計算を実行するためのインプットファイルを生成するスクリプトを Perl で作成しましたので、紹介します。
publishDate: 2024-12-10T20:53:35+09:00
updateDate: 2024-12-10T20:53:35+09:00
relatedArticles: []
---

## 参考

実装はこちらの記事を参考にさせていただきました。Python を使って同様の実装を行っている例が記載されています。

https://yamnor.me/2024-11-08-1904/

## 実装戦略

アウトプットファイル `output.log` のあるディレクトリに移動し、次のコマンドを実行してみましょう：

```bash:ターミナル
$ grep "Standard orientation" output.log | wc -l
```

このコマンドは、計算された分子の座標情報の総数を表示します（[詳しくはこちら](https://www.hpc.co.jp/chem/software/gaussian/help/keywords/symmetry/)）。
\
同様に、次のコマンドを実行してみましょう：

```bash:ターミナル
$ grep "Stationary point found" output.log | wc -l
```

このコマンドは、Scan で得られた最終構造の数を表示します。正常に Scan 計算が実行されていれば、インプットファイルで指定したスキャン回数に等しくなるはずです。したがって、上の記事にもある通り、
> [!note] 戦略
>
> 各 Scan ステップに対し、
> - `Standard orientation` という文字列をフラグに、座標情報を抽出
> - `Stationary point found` という文字列が現れた段階で、直前に抽出された座標情報を最適構造として保存

という流れでアウトプットファイルを解析します。

## Perl スクリプト

`extract.pl` というファイル名で以下のようなスクリプトを作成しました。

```perl:extract.pl
#!/usr/bin/perl

use strict;
use warnings;

# 引数の取得
my $file = shift or die "Usage: extract <filename>.out\n";

# マッチさせる文字列
my $start_marker = "Standard orientation:";
my $end_marker = "-----";

# アウトプットファイルの内容を格納
open my $fh, '<', $file or die "Can't open file $file: $!\n";
my $content = do { local $/; <$fh> };
close $fh;

# 繰り返し回数
my $count = 0;

# 座標を抽出
while ($content =~ /\s\s+$start_marker\s+\n(?:.+?\n){4}(.*?)\s$end_marker+/gs) {
  $count++;
  my $filename = $file;
  my $coordinate = $1;

  # 拡張子を置換
  $filename =~ s/\.[^.]+$/\.$iteration.com/;

  # ファイル生成
  open my $fh, '>', $filename or die "Can't open file $filename: $!\n";

# ヒアドキュメントを使ってファイルに書き込む
print $fh <<"EOF";
$coordinate
EOF

  # ファイルを閉じる
  close $fh;
}
```