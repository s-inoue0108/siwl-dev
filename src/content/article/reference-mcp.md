---
isDraft: false
isLimited: false
title: AI に論文を検索させるための MCP サーバーを作る
category: tech
tags: [python, ai]
description: "論文検索 API のラッパー MCP (Model Context Protocol) を Python で構築してみました。"
publishDate: 2025-11-16T20:21:25+09:00
updateDate: 2025-11-16T21:23:42+09:00
relatedArticles: []
---

## 参考

https://speakerdeck.com/azukiazusa1/mcp-sabanoji-chu-karashi-jian-reberunozhi-shi-made

非常にわかりやすかったため、引用させていただきます:)

## MCP とは

**MCP (Model Context Protocol)** は、生成 AI ブランド「Claude」で有名な Anthropic 社が提案した、生成 AI を外部システム環境に統合するためのプロトコルです。

https://modelcontextprotocol.io/docs/getting-started/intro

上記の説明には、こんな一節があります。

> Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

いわば、MCP は生成 AI にとっての USB-C であり、生成 AI が外部システムといつも同じやり方で通信を行うことを保証する仕組みであるということです。
\
MCP は主に3つの機能を提供します：

1. **Resources**
  ホスト AI がアクセス可能なデータリソースを公開する。
2. **Tools**
  ホスト AI が実行可能な外部ツールを公開する。
3. **Prompts**
  ホスト AI に再利用可能なプロンプトを提供する。

特に Tools は、AI に外部プログラムを実行させることができるため、MCP の機能でも中心的な役割を果たすことが多いと思います。

### MCP サーバー

MCP サーバーは、ホスト AI がアクセス可能な外部システム (API や DB など) を提供するためのサーバーです。MCP サーバーは RPC をもち、ホスト AI からコールされます。
\
MCP クライアントと MCP サーバーの通信を取り持つ RPC には、JSON が用いられます。

### FastMCP

[**FastMCP**](https://github.com/jlowin/fastmcp) は、Python で MCP を作成するためのフレームワークです。

```bash:インストール
pip install fastmcp
```

FastMCP は、MCP を非常にシンプルに扱えるように作られています。例えば以下のように、`FastMCP.tool()` デコレータでメソッドを装飾するだけで tools を実装できます。

```py:greet_server.py
from fastmcp import FastMCP

mcp = FastMCP("greet")

@mcp.tool()
def greet(name: str) -> str:
    """
    挨拶を返す。

    Args:
        挨拶を返す人の名前

    Returns:
        挨拶の文
    """
    return f"Hello, {name} さん！"

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

ホスト AI は tool に登録したメソッドの docstring と引数や戻り値の型アノテーションを解釈し、適当なプロンプトから tools を実行してくれます。
\
上記のサーバーを Claude Desktop から使うには、`設定 > 開発者 > 設定を編集` から `claude_desktop_config.json` を開き、以下の内容を記載します。

```json:claude_desktop_config.json
{
  "mcpServers": {
    "greet": {
      "command": "/path/to/python3",
      "args": [
        "/path/to/greet_server.py"
      ],
      "transport": "stdio"
    }
  }
}
```

## 論文検索 MCP を実装する

AI に論文を検索させて、不正確な情報が返ってきて困ったことがあるかもしれません。ましてや、[ハゲタカジャーナル](https://ja.wikipedia.org/wiki/%E3%83%8F%E3%82%B2%E3%82%BF%E3%82%AB%E3%82%B8%E3%83%A3%E3%83%BC%E3%83%8A%E3%83%AB)から粗悪な論文を拾ってこられてしまったら、たまったもんじゃありません。
\
そこで、論文メタデータを検索できる [Crossref Python API](https://github.com/fabiobatalha/crossrefapi) を AI に使わせるための MCP サーバーを作ってみました。

```bash
pip install crossrefapi
```

```py:reference_search.py
from typing import List, TypedDict, Annotated
from typing_extensions import TypedDict, Literal
from pydantic import Field
from crossref.restful import Journals, Works
from fastmcp import FastMCP

# initialize mcp instance
mcp = FastMCP(name="reference-search")
    
# returns type
class Article(TypedDict):
    title: Annotated[str, Field(description="論文のタイトル")]
    doi: Annotated[str, Field(description="論文のDOIリンク")]
    journal: Annotated[str, Field(description="掲載されているジャーナル")]
    year: Annotated[int, Field(description="掲載年")]
    score: Annotated[float, Field(description="検索クエリと論文の関連度")]
    cited_count: Annotated[int, Field(description="論文が引用された回数")]

@mcp.tool()
async def search_articles(
    keywords: Annotated[str, Field(description="部分一致検索したいキーワード")],
    criterion: Annotated[Literal["year", "score", "cited_count"], Field(description="結果をソートする基準")] = "score",
    nhits: Annotated[int, Field(description="表示件数")] = 10,
) -> List[Article]:
    """キーワードをもとに論文を検索"""
    # issn numbers
    issns = [
        "1476-4687",   # Nature
        "1095-9203",   # Science
        "2041-1723",   # Nature Communications
    ]
    
    # search articles
    works = Works()
    all_articles = []
    for issn in issns:
        hits = works.filter(issn=issn).query(bibliographic=keywords)

        articles = [{
            "title": item.get("title")[0] or None,
            "doi": item.get("URL") or None,
            "journal": item.get("container-title")[0] or None,
            "year": item.get("published").get("date-parts")[0][0] or 0,
            "score": item.get("score") or 0,
            "cited_count": item.get("is-referenced-by-count") or 0,
        } for item in hits]
        
        all_articles += articles
        
    # sort
    all_articles.sort(key=lambda a: -a.get(criterion))
    
    return all_articles[:nhits]

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

ホスト AI に tool のコンテキストを解釈させるために、Python の型ヒントと Pydantic をしっかり活用しています。
\
実際に使用するには、先ほど同様に JSON でサーバーを登録します。

```json:claude_desktop_config.json
{
  "mcpServers": {
    "greet": {
      "command": "/path/to/python3",
      "args": [
        "/path/to/reference_search.py"
      ],
      "transport": "stdio"
    }
  }
}
```
