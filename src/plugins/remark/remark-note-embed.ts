import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkNoteEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^\@\{note\}\(n.+\)$/.test(textNode.value)) return;

        const queryMatch = textNode.value.match(/^\@\{note\}\((n[a-z0-9]+)\)$/);
        if (!queryMatch) return;

        const query = queryMatch[1];

        transformer.push(async () => {
          const iframeNode = {
            type: "html",
            value: `<div class="flex justify-center">
                      <iframe src="https://note.com/embed/notes/${query}" style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;" height="400"></iframe>
                    </div>`,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-note-embed] Error: ${error}`);
    }
  }
}