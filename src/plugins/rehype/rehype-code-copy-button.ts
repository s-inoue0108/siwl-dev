import type { ElementContent, Root } from 'hast';
import { visit } from 'unist-util-visit';

export default function rehypeCodeCopyButton() {

  let count = 0;

  return (tree: Root) => {

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre') return;

      count++;

      const svgNode = {
        type: 'element',
        tagName: 'svg',
        properties: {
          fill: 'currentColor',
          'stroke-width': '0',
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 512 512',
          height: '1em',
          width: '1em',
          style: "overflow: 'visible', color: 'currentcolor'",
        },
        children: [
          {
            type: 'element',
            tagName: 'rect',
            properties: {
              width: '336',
              height: '336',
              x: '128',
              y: '128',
              fill: 'none',
              stroke: 'currentColor',
              'stroke-linejoin': 'round',
              'stroke-width': '32',
              rx: '57',
              ry: '57',
            },
            children: []
          },
          {
            type: 'element',
            tagName: 'path',
            properties: {
              fill: 'none',
              stroke: 'currentColor',
              'stroke-linecap': 'round',
              'stroke-linejoin': 'round',
              'stroke-width': '32',
              d: 'm383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24',
            },
            children: []
          }
        ]
      } satisfies ElementContent;

      const copySvgTag = `<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><rect width="336" height="336" x="128" y="128" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" rx="57" ry="57"></rect><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m383.5 128 .5-24a56.16 56.16 0 0 0-56-56H112a64.19 64.19 0 0 0-64 64v216a56.16 56.16 0 0 0 56 56h24"></path></svg>`;

      const checkSvgTag = `<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128 192 384 96 288"></path></svg>`;

      const copyButton = {
        type: 'element',
        tagName: 'button',
        properties: {
          className: "code-copy-button",
          id: `code-copy-button-${count}`,
        },
        children: [svgNode],
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
                copyButton.innerHTML = '${checkSvgTag}';
                setTimeout(() => {
                  copyButton.innerHTML = '${copySvgTag}';
                }, 1000);
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