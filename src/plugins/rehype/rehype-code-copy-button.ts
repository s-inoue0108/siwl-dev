import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeCodeCopyButton() {

  let count = 0;

  return (tree: Root) => {

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre') return;

      count++;

      const svg = {
        type: 'element',
        tagName: 'svg',
        properties: {
          fill: 'currentColor',
          'stroke-width': '0',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 512 512',
          height: '1em',
          width: '1em',
          style: 'overflow: visible; color: currentcolor;',
        },
        children: [
          {
            type: 'element',
            tagName: 'path',
            properties: {
              d: 'M408 480H184a72 72 0 0 1-72-72V184a72 72 0 0 1 72-72h224a72 72 0 0 1 72 72v224a72 72 0 0 1-72 72Z',
            },
            children: [],
          },
          {
            type: 'element',
            tagName: 'path',
            properties: {
              d: 'M160 80h235.88A72.12 72.12 0 0 0 328 32H104a72 72 0 0 0-72 72v224a72.12 72.12 0 0 0 48 67.88V160a80 80 0 0 1 80-80Z',
            },
            children: [],
          },
        ],
      } satisfies ElementContent;

      const copyButton = {
        type: 'element',
        tagName: 'button',
        properties: {
          className: "code-copy-button",
          id: `code-copy-button-${count}`,
        },
        children: [svg],
      } satisfies ElementContent;

      const script = {
        type: 'element',
        tagName: 'script',
        properties: {
          type: "text/javascript",
        },
        children: [{
          type: 'text',
          value: `
            document.addEventListener('DOMContentLoaded', () => {
              const copyButton = document.getElementById('code-copy-button-${count}');
              copyButton.addEventListener('click', () => {
                const codeBlock = copyButton.previousElementSibling.children[0];
                navigator.clipboard.writeText(codeBlock.innerText);
              });
            });
          `
        }],
      } satisfies ElementContent;

      if (parent && Array.isArray(parent.children)) {
        parent.children.splice(index! + 1, 0, copyButton, script);
      }
    });
  };
}