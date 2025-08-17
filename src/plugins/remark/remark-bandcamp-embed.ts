interface BandcampEmbed {
  size?: "small" | "large";       // デフォルト large
  bgcol?: string;                 // "ffffff" など（# なし）
  linkcol?: string;               // "0687f5" など
  tracklist?: boolean;            // true で曲リスト表示
  transparent?: boolean;          // true で透明
  minimal?: boolean;              // true で極簡易表示
  height?: number;                // 明示的に高さ指定したい場合（px）
  width?: number | "100%";        // 幅
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkBandcampEmbed() {

  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?(?:.*)\.bandcamp\.com\/(?:album|track)\/[a-zA-Z0-9_-]+$/.test(textNode.value)) return;

        const url = textNode.value;

        transformer.push(async () => {
          const html = await fetchHtml(url);
          const metaMatch = html.match(
            /<meta[^>]+name=["']bc-page-properties["'][^>]+content=["']([^"']+)["'][^>]*>/i
          );
          if (!metaMatch) return

          // &quot; を " に戻して JSON 化
          const jsonStr = metaMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&");
          const props = JSON.parse(jsonStr) as { item_type: "a" | "t"; item_id: number };

          const type = props.item_type === "a" ? "album" : "track";
          const id = props.item_id;

          // オプションをパラメータへ
          let opts: BandcampEmbed = {};
          const {
            size = "large",
            bgcol = "ffffff",
            linkcol = "0687f5",
            tracklist = false,
            transparent = true,
            minimal = false,
            width = "100%",
            height
          } = opts;

          const params = [
            `size=${size}`,
            `bgcol=${bgcol}`,
            `linkcol=${linkcol}`,
            `tracklist=${tracklist ? "true" : "false"}`,
            `transparent=${transparent ? "true" : "false"}`,
            minimal ? "minimal=true" : null
          ].filter(Boolean).join("/");

          const src = `https://bandcamp.com/EmbeddedPlayer/${type}=${id}/${params}/`;
          const style = `border:0; width:${typeof width === "number" ? `${width}px` : width}; height:${height ?? (size === "large" ? 470 : 120)}px;`;

          const iframe =
            `
            <div class="mx-auto w-fit flex justify-center">
              <iframe style="${style}" src="${src}" seamless><a href="${url}">Bandcamp embed</a></iframe>
            </div>
          `;

          const iframeNode = {
            type: "html",
            value: iframe,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-bandcamp-embed] Error: ${error}`);
    }
  }
}

const fetchHtml = async (url: string) => {
  const res = await fetch(url, {
    redirect: "follow",
  });

  if (!res.ok) throw new Error(`Bandcamp page fetch failed: ${res.status}`);

  const htmlText = await res.text();
  return htmlText;
}