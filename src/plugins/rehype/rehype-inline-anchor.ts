import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeInlineAnchor() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "a") return;
      const id = node.properties.id as string;
      const className = node.properties.className as string[];
      if (id && /^user-content-fnref-\d+$/.test(id)) return;
      if (className && (className.includes("rlc-container") || className.includes("data-footnote-backref"))) return;

      node.properties.className = "text-sky visited:text-purple hover:underline";

      if (node.properties.target && node.properties.target === "_blank") {
        node.children.push({ type: "text", value: "↗" });
      }
    });
  };
}