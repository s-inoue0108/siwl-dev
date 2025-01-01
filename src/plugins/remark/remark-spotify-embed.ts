interface SpotifyEmbed {
  version: string;
  type: string;
  provider_name: string;
  provider_url: string;
  height: number;
  width: number;
  title: string;
  description: string;
  html: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkSpotifyEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?open\.spotify\.com\/.*\/?[a-z0-9_-]+\/[a-zA-Z0-9]+$/.test(textNode.value)) return;

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
      console.error(`[remark-spotify-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<SpotifyEmbed> => {
  const endpoint = "https://open.spotify.com/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}`);
  return await resp.json();
}