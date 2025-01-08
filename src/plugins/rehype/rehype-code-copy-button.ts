import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeCodeCopyButton() {

  let count = 0;

  return (tree: Root) => {

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;

      count++;

      node.properties.id = `code-block-${count}`;
      const copyButton = {
        type: 'element',
        tagName: 'button',
        properties: {
          id: `copy-button-${count}`,
        },
        children: node.children,
      } satisfies ElementContent;

      node.children = [copyButton];

      const script = {
        type: 'element',
        tagName: 'script',
        properties: {},
        children: [{
          type: 'text',
          value: `
            document.addEventListener('DOMContentLoaded', () => {
              const copyButton = document.getElementById('copy-button-${count}');
              copyButton.addEventListener('click', () => {
                const code = copyButton.children[0];
                navigator.clipboard.writeText(code.innerText);
              });
            });
          `
        }],
      } satisfies ElementContent;

      node.children.push(script);
    });
  };
}