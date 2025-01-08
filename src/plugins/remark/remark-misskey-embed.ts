import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkMisskeyEmbed() {

  const generateSerialNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serialNumber = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      serialNumber += chars[randomIndex];
    }
    return serialNumber;
  }

  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^\@\{misskey(?:\:[a-z]{1,3})?\}\(.+\)$/.test(textNode.value)) return;

        const idMatch = textNode.value.match(/^\@\{misskey(\:[a-z]{1,3})?\}\((.+)\)$/);
        if (!idMatch) return;

        let host = "sushi.ski";
        if (idMatch[1]) host = idMatch[1].replace(":", "");

        const id = idMatch[2];
        const random = generateSerialNumber();

        transformer.push(async () => {
          const iframeNode = {
            type: "html",
            value: `<iframe
                        src="https://${host}/embed/notes/${id}"
                        data-misskey-embed-id="v1_${random}"
                        loading="lazy"
                        referrerpolicy="strict-origin-when-cross-origin"
                        style="border: none; width: 100%; max-width: 500px; height: 300px; color-scheme: light dark;"
                    ></iframe>
                    <script defer src="https://${host}/embed.js"></script>`,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-misskey-embed] Error: ${error}`);
    }
  }
}