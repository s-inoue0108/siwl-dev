// https://github.com/ricora/alg.tus-ricora.com/blob/06b3aed2b498bb26dc5b083074eaff76b606c47f/src/lib/remark-plugins/remarkCallout.ts

import type { Root, BlockContent, DefinitionContent, Paragraph } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkCallout() {
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
        hName: "details",
        hProperties: {
          class: `callout callout-${calloutData.type}`,
          open: calloutData.isFold ? false : true,
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
          hName: "summary",
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

type CalloutMeta = {
  type: CalloutType
  title?: string
  isFold: boolean
}

/**
 * @example
 * ```
 * const callout = parseCallout("[!info]");  // { type: "info", isFoldable: false, title: undefined }
 * const callout = parseCallout("[!info");   // undefined
 * ```
 */
const parseCallout = (text: string | null | undefined): CalloutMeta | undefined => {
  if (text == null) return;

  const match = text.trim().match(/^\[!(?<type>[^:]+)(?<fold>:fold)?\]\s?(?<title>.+)?$/);

  if (match?.groups?.type == null) return;
  const isCalloutType = (type: string): type is CalloutType => {
    return type as CalloutType !== undefined;
  }

  const type = isCalloutType(match.groups.type.toLowerCase()) ? match.groups.type.toLowerCase() : "note";

  return {
    type: type as CalloutType,
    title: match.groups.title,
    isFold: match.groups.fold ? true : false,
  }
}

const calloutIcons = {
  quote: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" d="M3.516 7a3.5 3.5 0 1 1-3.5 3.5L0 10a7 7 0 0 1 7-7v2a4.97 4.97 0 0 0-3.536 1.464 5.01 5.01 0 0 0-.497.578c.179-.028.362-.043.548-.043zm9 0a3.5 3.5 0 1 1-3.5 3.5L9 10a7 7 0 0 1 7-7v2a4.97 4.97 0 0 0-3.536 1.464 5.01 5.01 0 0 0-.497.578c.179-.028.362-.043.549-.043z"></path></svg>',
  note: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  remark: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M11.587 6.999H7.702a2 2 0 0 0-1.88 1.316l-3.76 10.342c-.133.365-.042.774.232 1.049l.293.293 6.422-6.422c-.001-.026-.008-.052-.008-.078a1.5 1.5 0 1 1 1.5 1.5c-.026 0-.052-.007-.078-.008l-6.422 6.422.293.293a.997.997 0 0 0 1.049.232l10.342-3.761a2 2 0 0 0 1.316-1.88v-3.885L19 10.414 13.586 5l-1.999 1.999zm8.353 2.062-5-5 2.12-2.121 5 5z"></path></svg>',
  info: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  todo: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0 1 24.5 20.58Z"></path></svg>',
  important: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z" clip-rule="evenodd"></path></svg>',
  example: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M160 144 448 144"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M160 256 448 256"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M160 368 448 368"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 128A16 16 0 1 0 80 160 16 16 0 1 0 80 128z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 240A16 16 0 1 0 80 272 16 16 0 1 0 80 240z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 352A16 16 0 1 0 80 384 16 16 0 1 0 80 352z"></path></svg>',
  tip: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z"></path><path fill="currentColor" fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd"></path></svg>',
  break: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M19 5h-1V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a4 4 0 0 0 4 4h6c1.858 0 3.411-1.279 3.858-3H19a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm1 6a1 1 0 0 1-1 1h-1V7h1a1 1 0 0 1 1 1v3zm-2 8H3c0 1.654 1.346 3 3 3h11c1.654 0 3-1.346 3-3h-2z"></path></svg>',
  warn: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  question: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"></path></svg>',
  alert: '<svg fill="none" stroke-width="0" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path fill="currentColor" fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"></path></svg>',
  attention: '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path></svg>',
}

type CalloutType = keyof typeof calloutIcons