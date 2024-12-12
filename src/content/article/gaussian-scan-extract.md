---
isDraft: false
title: Perl で Gaussian のスキャン計算結果から TD-DFT 計算ファイルを生成する
category: tech
tags: [perl, gaussian, comp-science]
description: Gaussian16 では、結合長、二面角といったパラメータを固定しながら構造最適化計算を繰り返す Relaxed Scan 計算が利用できます。今回は、Scan 計算の結果から最適構造の座標情報を抽出し、TD-DFT 計算を実行するためのインプットファイルを生成するスクリプトを Perl で作成しましたので、紹介します。
publishDate: 2024-12-10T20:53:35+09:00
updateDate: 2024-12-12T22:06:03+09:00
relatedArticles: []
---

## 参考

実装の方針はこちらの記事を参考にさせていただきました。Python を使った例が記載されています。

https://yamnor.me/2024-11-08-1904/

## 実装戦略

構造最適化計算のアウトプット `calc.out (.log)` のあるディレクトリに移動し、次のコマンドを実行してみましょう：

```bash:ターミナル
$ grep "Standard orientation" calc.log | wc -l
```

このコマンドは、計算された分子の座標情報の総数を表示します（[詳しくはこちら](https://www.hpc.co.jp/chem/software/gaussian/help/keywords/symmetry/)）。
\
同様に、次のコマンドを実行してみましょう：

```bash:ターミナル
$ grep "Optimization completed" calc.log | wc -l
```

このコマンドは、Scan で得られた最終構造の数を表示します。正常に Scan 計算が実行されていれば、インプットファイルで指定したスキャン回数に等しくなるはずです。したがって、上の記事にもある通り、

1. `Standard orientation` という文字列に付帯する座標を抽出
2. `Optimization completed` という文字列が現れた段階で、直前に抽出された座標情報を最適構造として保存

というステップをスキャンした回数だけ繰り返し、アウトプットを解析します。

## Perl スクリプトの作成

`extract.pl` というファイル名でスクリプトを作成しました。

### アウトプットファイルの解析

1つのスキャンステップのブロックは概ね以下のようになっています：

```txt:calc.out
                         Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic     Atomic              Coordinates (Angstroms)
 Number     Number      Type              X           Y           Z
 ---------------------------------------------------------------------
    1          6             0       .........   .........    ........
    .          .             .       .........   .........    ........
    .          .             .       .........   .........    ........
    .          .             .       .........   .........    ........
 ---------------------------------------------------------------------

 **************************何やらいろいろ書いてある*************************

                          Standard orientation:                         
 ---------------------------------------------------------------------
 Center     Atomic     Atomic              Coordinates (Angstroms)
 Number     Number      Type              X           Y           Z
 ---------------------------------------------------------------------
    1          6             0       .........   .........    ........
    .          .             .       .........   .........    ........
    .          .             .       .........   .........    ........
    .          .             .       .........   .........    ........
 ---------------------------------------------------------------------

 **************************何やらいろいろ書いてある*************************

 Optimization completed.
```

- `Standard orientation` をとらえた段階でその行数（`$_` という特殊変数を参照します）を `$ln` に保存し、ブロック開始の合図である `$is_block` を `1` にします。
- 座標は4行をスキップして抽出し、`$coordinate` に書き足していきます。
- ブロックの終わりとして `-----` を検出したら `$statinonary_coordinate` にコピーします。
- 以上のステップを繰り返し、`Optimization completed` をとらえたら直前の `$statinonary_coordinate` をファイル生成関数に渡します。

```perl:extract.pl
#!/usr/bin/perl
use strict;
use warnings;

# ファイル名の取得
my $file = shift or die "Usage: extract <filename>.out\n";

# グローバル変数
my $ln = 0;                  # ファイルの行数
my $is_block = 0;            # 座標の抽出中であることを表すブール変数
my $count = 0;               # スキャン回数
my $coordinate = "";         # Standard orientation の座標を保存
my $stationary_coordinate;   # スキャンごとの最終座標を保存

# メインルーチン
open my $fh, '<', $file or die "Can't open file $file: $!\n";

# アウトプットファイルを1行ずつ読み込む
while (my $line = <$fh>) {
  
  if ($line =~ /Standard orientation/) {
    $ln = $.;
    $is_block = 1;
    print "Standard Orientation Found\n";
  } elsif ($. > $ln + 4 and $is_block == 1) {
    if ($line =~ /-----/) {
      $stationary_coordinate = $coordinate;
      $coordinate = "";
      $ln = $.;
      $is_block = 0;
    } else {
      $coordinate .= "$line";
    }
  } elsif ($line =~ /Optimization completed/) {
    $count++;
    print "Optimized Structure Found\n";
    
    gen_tddft($file, $stationary_coordinate, $count);
  }
}
close $fh;
```

実際に活用しているスクリプトでは、`Term::ReadLine` モジュールを用いた対話型インタフェースの実装や、入力のバリデーションなどをしています。

### TD-DFT 計算ファイルの生成

- 正規表現で `$file` をリネームし、拡張子を `*.tddft.com` にしたファイルを生成します。
- 座標データは適切に加工します（後述）。
- 探索する励起構造の数や汎関数、基底関数系はハードコーディングしていますが、ユーザの入力を受け取れるようにするとよいと思います。

```perl:extract.pl
sub gen_tddft {
  my ($file, $coordinate, $count) = @_;

  my $tddft_file = $file;
  my $chk_file = $file;
  my $title = $file;

  $tddft_file =~ s/\.[^.]+$/\.$count.tddft.com/;
  $chk_file =~ s/\.[^.]+$/\.$count.tddft.chk/;
  $title =~ s/\.[^.]+$/\ | No.$count/;

  my $new_coordinate = processed_coordinate($coordinate);

  open my $fh, '>', $tddft_file or die "Can't open file $tddft_file: $!\n";

print $fh <<"EOF";
%nprocshared=8
%mem=1GB
%chk=$chk_file
# td=(nstat=10) b3lyp/6-31g(d)

$title

0 1
$new_coordinate

EOF

  close $fh;
}
```

### 座標データの加工

アウトプットの座標ブロックにおける各行は以下のようになっています：

```txt:calc.out
    1          6             0       .........   .........    ........
```

このうち、デカルト座標の部分と、2列目の Atomic Number 列が xyz 形式のインプットで必要になります：

```txt:想定
 C   .........   .........    ........
 H   .........   .........    ........
 H   .........   .........    ........
```

よって、**Atomic Number は対応する元素記号に置換する必要があります**。ハッシュ（連想配列）を定義して対応します[^1]。

[^1]: 生成 AI に指示して 118 行のハッシュを作ってもらいました。抜け落ちている元素があったりなどしたので、要注意です。

以上の処理を `join` メソッド等を使って実現します[^2]。

[^2]: このコードも生成 AI の力を借りました。もっといい書き方にできると思います...

```perl:extract.pl
# 原子番号と元素記号のハッシュ
my %atoms = (
    1 => 'H',
    2 => 'He',
  # -- 割愛 --
  118 => 'Og'
);

sub processed_coordinate {
  my ($coordinate) = @_;

  my $label_droped_coordinate = join("\n", map {
    # 行をスペースで分割
    my @columns = split(/\s+/, $_);
    
    # ラベル列を drop
    splice(@columns, 1, 1);
    
    # 残りのカラムをスペースで再結合
    join(" ", @columns);

  } split(/\n/, $coordinate));

  my $type_droped_coordinate = join("\n", map {
    # 行をスペースで分割
    my @columns = split(/\s+/, $_);
    
    # タイプ列を drop
    splice(@columns, 2, 1);
    
    # 残りのカラムを空白で再結合
    join(" ", @columns);

  } split(/\n/, $label_droped_coordinate));

  my $number_replaced_coordinate = join("\n", map {
    # 行をスペースで分割
    my @columns = split(/\s+/, $_);
    
    # 原子番号を元素記号に置換
    foreach my $row (@columns) {
      if (exists $atoms{$row}) {
        $row = $atoms{$row};
      }
    }
    
    # 残りのカラムをタブで再結合
    join("\t", @columns);

  } split(/\n/, $type_droped_coordinate));

  # 行ごとに分割して処理
  my @lines = split /\n/, $number_replaced_coordinate;

  # 行頭のタブを除去して、再度\nで結合する
  my $cleaned_coordinate = join("\n", map { s/^\t/ /r } @lines);
  
  return $cleaned_coordinate;
}
```

## 使用法

`calc.out` のあるディレクトリまで移動して次のコマンドを実行します：

```bash:bash
$ perl ./extract.pl calc.out
```
