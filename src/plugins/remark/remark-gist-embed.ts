import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkGistEmbed() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {

        if (!/^https:\/\/(?:www\.)?gist\.github\.com\/[a-z0-9_-]+\/[a-z0-9]{1,32}?$/.test(textNode.value)) return;

        const url = textNode.value;

        const iframeNode = {
          type: "html",
          value: `<iframe src="${url}.pibb" style="width: 100%; height: fit-content;"></iframe>`,
        }

        node.children.splice(0, 1, iframeNode as { type: "text", value: string });
      });
    });
  }
}