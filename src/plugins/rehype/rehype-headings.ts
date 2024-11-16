import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeHeadings() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'h2') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        node.children = [
          {
            type: "element",
            tagName: "div",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: `#h2-${value}`,
                  className: "text-[24px] lg:text-[30px] 2xl:text-[36px] heading min-w-max whitespace-nowrap bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
                },
                children: [{ type: "text", value: "## " }],
              } satisfies ElementContent,
              { type: "text", value },
            ],
          } satisfies ElementContent
        ];
        node.properties.id = `h2-${value}`;
        node.properties.className = "w-full overflow-x-auto mt-12 mb-4 lg:mt-24 lg:mb-8 text-[30px] lg:text-[36px] 2xl:text-[42px] font-bold flex items-center gap-2 pb-2 border-b border-muted-background";

      } else if (node.tagName === 'h3') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        node.children = [
          {
            type: "element",
            tagName: "div",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: `#h3-${value}`,
                  className: "text-[20px] lg:text-[24px] 2xl:text-[30px] heading min-w-max whitespace-nowrap bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
                },
                children: [
                  { type: "text", value: "### " }
                ],
              } satisfies ElementContent,
              { type: "text", value },
            ],
          } satisfies ElementContent
        ];
        node.properties.id = `h3-${value}`;
        node.properties.className = "w-full overflow-x-auto mt-9 mb-3 lg:mt-18 lg:mb-6 text-[24px] lg:text-[30px] 2xl:text-[36px] font-bold flex items-center gap-2";

      } else if (node.tagName === 'h4') {

        const { value } = node.children[0] as { type: "text", value: string };
        if (!value || typeof value !== 'string') return;

        node.children = [
          {
            type: "element",
            tagName: "div",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: `#h4-${value}`,
                  className: "text-[16px] lg:text-[18px] 2xl:text-[20px] heading min-w-max whitespace-nowrap bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent",
                },
                children: [{ type: "text", value: "#### " }],
              } satisfies ElementContent,
              { type: "text", value },
            ],
          } satisfies ElementContent
        ];
        node.properties.id = `h4-${value}`;
        node.properties.className = "w-full overflow-x-auto mt-6 mb-2 lg:mt-12 lg:mb-4 text-[18px] lg:text-[20px] 2xl:text-[24px] font-bold flex items-center gap-2";

      } else {
        return;
      }
    });
  };
}