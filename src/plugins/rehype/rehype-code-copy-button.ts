import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeCodeCopyButton() {

  let count = 0;

  return (tree: Root) => {

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;

      count++;

      node.properties.id = `code-block-${count}`;

      const script = {
        type: 'element',
        tagName: 'script',
        properties: {},
        children: [{
          type: 'text',
          value: `
            document.addEventListener('DOMContentLoaded', () => {
              const codeBlock = document.getElementById('code-block-${count}');
              codeBlock.addEventListener('click', () => {
                const codeTag = codeBlock.children[0];
                const text = codeTag.innerText;
                navigator.clipboard.writeText(text);
              });
            });
          `
        }],
      } satisfies ElementContent;

      node.children.push(script);
    });
  };
}