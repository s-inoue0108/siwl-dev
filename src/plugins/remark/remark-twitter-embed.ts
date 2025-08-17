interface TwitterEmbed {
  url: string;
  title: string;
  html: string;
  width: number | null;
  height: number | null;
  type: string;
  cache_age: string;
  provider_name: string;
  provider_url: string;
  version: string;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkTwitterEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {

        if (!/^https:\/\/(?:www\.)?(?:x)|(?:twitter)\.com\/[a-z_]+\/status\/\d{1,19}?$/.test(textNode.value)) return;

        const url = textNode.value;

        transformer.push(async () => {
          const embed = await fetchEmbed(url);
          const iframeNode = {
            type: "html",
            value: embed.html,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-twitter-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<TwitterEmbed> => {
  const endpoint = "https://publish.twitter.com/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}&hide_thread=true&align=center&lang=ja&theme=dark`);
  return await resp.json();
}