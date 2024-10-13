interface YoutubeEmbed {
  width: number;
  version: string;
  author_url: string;
  provider_name: string;
  type: string;
  provider_url: string;
  html: string;
  thumbnail_url: string;
  thumbnail_width: number;
  title: string;
  thumbnail_height: number;
  author_name: string;
  height: number;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkYoutubeEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/.test(textNode.value)) return;

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
      console.error(`[remark-youtube-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<YoutubeEmbed> => {
  const endpoint = "https://www.youtube.com/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}`);
  return await resp.json();
}