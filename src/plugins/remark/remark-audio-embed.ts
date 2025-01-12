import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkAudioEmbed() {

  let count = 0;

  return async (tree: Root) => {

    count++;

    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^\@\{audio\}\(.+\.(?:mp3|wav|flac)\)$/.test(textNode.value)) return;

        const pathMatch = textNode.value.match(/^\@\{audio\}\((.+\.(?:mp3|wav|flac))\)$/);
        if (!pathMatch) return;

        const path = pathMatch[1];

        transformer.push(async () => {
          const audioNode = {
            type: "html",
            value: `<div class="audio-block">
                      <audio src="${path}" id="audio-${count}" controlslist="nodownload"></audio>
                    </div>`,
          }

          node.children.splice(0, 1, audioNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-audio-embed] Error: ${error}`);
    }
  }
}