interface CodepenEmbed {
  success: boolean;
  type: string;
  version: number;
  provider_name: string;
  provider_url: string;
  title: string;
  author_name: string;
  author_url: string;
  height: number;
  width: number;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url: string;
  html: string;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkCodepenEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?codepen\.io\/[a-z0-9_-]+\/pen\/[a-zA-Z]+$/.test(textNode.value)) return;

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
      console.error(`[remark-speakerdeck-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<CodepenEmbed> => {
  const endpoint = "https://codepen.io/api/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?format=json&url=${query}`);
  return await resp.json();
}