interface SoundCloudEmbed {
  version: number;
  type: string;
  provider_name: string;
  provider_url: string;
  height: number | string;
  width: number | string;
  title: string;
  description: string;
  html: string;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkSoundCloudEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(textNode.value)) return;

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
      console.error(`[remark-soundcloud-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<SoundCloudEmbed> => {
  const endpoint = "https://soundcloud.com/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?format=json&url=${query}`);
  return await resp.json();
}