interface SpeakerDeckEmbed {
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
  ratio: number;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkSpeakerDeckEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?speakerdeck\.com\/[a-z0-9_-]+\/[a-z0-9_-]+$/.test(textNode.value)) return;

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

const fetchEmbed = async (url: string): Promise<SpeakerDeckEmbed> => {
  const endpoint = "https://speakerdeck.com/oembed.json";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}`);
  return await resp.json();
}