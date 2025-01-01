interface DocswellEmbed {
  type: string;
  version: number;
  provider_name: string;
  provider_url: string;
  title: string;
  author_name: string;
  author_url: string;
  html: string;
  width: number;
  height: number;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkDocswellEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?docswell\.com\/s\/[a-z0-9_-]+\/[a-zA-Z0-9-]+$/.test(textNode.value)) return;

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
      console.error(`[remark-docswell-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<DocswellEmbed> => {
  const endpoint = "https://www.docswell.com/service/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}`);
  return await resp.json();
}