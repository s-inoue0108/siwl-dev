// https://github.com/ricora/alg.tus-ricora.com/blob/06b3aed2b498bb26dc5b083074eaff76b606c47f/src/lib/remark-plugins/remarkCallout.ts

import type { Root, BlockContent, DefinitionContent, Paragraph } from "mdast";
import { visit } from "unist-util-visit";

export const remarkCallout = () => {
  return (tree: Root) => {
    visit(tree, "blockquote", (node) => {
      const paragraphNode = node.children[0];
      if (paragraphNode.type !== "paragraph") return;

      const calloutTypeTextNode = paragraphNode.children[0];
      if (calloutTypeTextNode.type !== "text") return;

      // Parse callout syntax
      // e.g. "[!note] title"
      const [calloutTypeText, ...calloutBodyText] = calloutTypeTextNode.value.split("\n");

      const calloutData = parseCallout(calloutTypeText);
      if (calloutData == null) return;

      // Generate callout root node
      node.data = {
        ...node.data,
        hName: "callout",
        hProperties: {
          class: `callout callout-${calloutData.type}`,
        },
      }

      // Generate callout body node
      const bodyNode: (BlockContent | DefinitionContent)[] = [
        {
          type: "paragraph",
          children: [],
        },
        ...node.children.splice(1),
      ]
      if (bodyNode[0].type !== "paragraph") return; // type check
      if (calloutBodyText.length > 0) {
        bodyNode[0].children.push({
          type: "text",
          value: calloutBodyText.join("\n"),
        });
      }

      // Generate callout title node
      const titleNode: Paragraph = {
        type: "paragraph",
        data: {
          hName: "callout-title",
          hProperties: {
            class: `callout-title callout-title-${calloutData.type}`,
          },
        },
        children: [],
      }
      if (calloutData.title != null) {
        titleNode.children = [
          {
            type: "html",
            value: calloutIcons[calloutData.type],
          },
          {
            type: "text",
            value: calloutData.title,
          }
        ];
      } else {
        titleNode.children = [
          {
            type: "html",
            value: calloutIcons[calloutData.type],
          },
          {
            type: "text",
            value: calloutData.type.charAt(0).toUpperCase() + calloutData.type.slice(1),
          }
        ];
      }
      if (calloutBodyText.length <= 0) {
        for (const [i, child] of paragraphNode.children.slice(1).entries()) {
          // All inline node before the line break is added as callout title
          if (child.type !== "text") {
            titleNode.children.push(child);
            continue;
          }

          // Add the part before the line break as callout title and the part after as callout body
          const [titleText, ...bodyTextLines] = child.value.split("\n")
          if (titleText) {
            // Add the part before the line break as callout title
            titleNode.children.push({
              type: "text",
              value: titleText,
            });
          }
          if (bodyTextLines.length > 0) {
            // Add the part after the line break as callout body
            if (bodyNode[0].type !== "paragraph") return
            bodyNode[0].children.push({
              type: "text",
              value: bodyTextLines.join("\n"),
            });
            // Add all nodes after the current node as callout body
            bodyNode[0].children.push(...paragraphNode.children.slice(i + 2));
            break;
          }
        }
      } else {
        // Add all nodes after the current node as callout body
        bodyNode[0].children.push(...paragraphNode.children.slice(1));
      }

      // Add body and title to callout root node children
      node.children = [titleNode, ...bodyNode];
    })
  }
}

export type CalloutMeta = {
  type: CalloutType
  title?: string
}

/**
 * @example
 * ```
 * const callout = parseCallout("[!info]");  // { type: "info", isFoldable: false, title: undefined }
 * const callout = parseCallout("[!info");   // undefined
 * ```
 */
export const parseCallout = (text: string | null | undefined): CalloutMeta | undefined => {
  if (text == null) return;

  const match = text.trim().match(/^\[!(?<type>.+)\]\s?(?<title>.+)?$/);

  if (match?.groups?.type == null) return undefined;
  const isCalloutType = (type: string): type is CalloutType => {
    return type as CalloutType !== undefined;
  }

  const type = isCalloutType(match.groups.type.toLowerCase()) ? match.groups.type.toLowerCase() : "note";

  return {
    type: type as CalloutType,
    title: match.groups.title,
  }
}

export const calloutIcons = {
  note: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  info: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  important: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd"></path></svg>',
  tip: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z"></path><path fill="currentColor" fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd"></path></svg>',
  warn: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  alert: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  math: '<svg fill="none" stroke-width="2" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-math-integral-x" width="1em" height="1em" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="overflow: visible; color: currentcolor;"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 19a2 2 0 0 0 2 2c2 0 2 -4 3 -9s1 -9 3 -9a2 2 0 0 1 2 2"></path><path d="M14 12l6 6"></path><path d="M14 18l6 -6"></path></svg>'
}

export type CalloutType = keyof typeof calloutIcons