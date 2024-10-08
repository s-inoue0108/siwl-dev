import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeHeadings() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h1') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        const hashElm = {
          type: "element",
          tagName: "a",
          properties: {
            href: `#h1-${value}`,
            className: "heading bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
          },
          children: [{ type: "text", value: "#" }],
        } satisfies ElementContent;

        const titleElm = {
          type: "element",
          tagName: "span",
          properties: {},
          children: [{ type: "text", value }],
        } satisfies ElementContent;

        node.children = [hashElm, titleElm];
        node.properties.id = `h1-${value}`;
        node.properties.className = "mt-8 mb-4 lg:mt-16 lg:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 w-full pb-2 border-b border-muted-background";

      } else if (node.tagName === 'h2') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        const hashElm = {
          type: "element",
          tagName: "a",
          properties: {
            href: `#h2-${value}`,
            className: "heading bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
          },
          children: [{ type: "text", value: "##" }],
        } satisfies ElementContent;

        const titleElm = {
          type: "element",
          tagName: "span",
          properties: {},
          children: [{ type: "text", value }],
        } satisfies ElementContent;

        node.children = [hashElm, titleElm];
        node.properties.id = `h2-${value}`;
        node.properties.className = "mt-8 mb-4 lg:mt-16 lg:mb-8 text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 w-full pb-1 border-b border-muted-background";

      } else if (node.tagName === 'h3') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        const hashElm = {
          type: "element",
          tagName: "a",
          properties: {
            href: `#h3-${value}`,
            className: "heading bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
          },
          children: [{ type: "text", value: "###" }],
        } satisfies ElementContent;

        const titleElm = {
          type: "element",
          tagName: "span",
          properties: {},
          children: [{ type: "text", value }],
        } satisfies ElementContent;

        node.children = [hashElm, titleElm];
        node.properties.id = `h3-${value}`;
        node.properties.className = "mt-8 mb-4 lg:mt-16 lg:mb-8 text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 w-full";

      } else {
        return;
      }
    });
  };
}