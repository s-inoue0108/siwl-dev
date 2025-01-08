interface HatenablogEmbed {
  author_name: string;
  author_url: string;
  blog_title: string;
  blog_url: string;
  categories: string[];
  description: string;
  height: string;
  width: string;
  html: string;
  image_url: string;
  provider_name: string;
  provider_url: string;
  published: string;
  title: string;
  type: string;
  url: string;
  version: string;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkHatenablogEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^https:\/\/(?:www\.)?[a-z0-9_-]+\.hatenablog\.com\/entry\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[0-9]{6}$/.test(textNode.value)) return;

        const url = textNode.value;

        transformer.push(async () => {
          const embed = await fetchEmbed(url);
          const iframeNode = {
            type: "html",
            value: `<div class="flex justify-center">${embed.html}</div>`,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-hatenablog-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (url: string): Promise<HatenablogEmbed> => {
  const endpoint = "https://hatena.blog/oembed";
  const query = encodeURIComponent(url);
  const resp = await fetch(`${endpoint}?url=${query}`);
  return await resp.json();
}