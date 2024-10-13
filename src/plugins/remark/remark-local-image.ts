import type { Root, BlockContent, Paragraph, PhrasingContent } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkLocalImage() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 3) return;
      const imageNode = node.children[0];
      const captionNode = node.children[2];

      if (imageNode.type !== "image" || captionNode.type !== "emphasis") return;

      visit(captionNode, "emphasis", (captionNode) => {
        const captionNodeChild = captionNode.children[0] as { type: "text", value: string };
        const caption = captionNodeChild.value;

        const figcaptionNode = {
          type: "html",
          value: `<p>
                    <figcaption class="w-fit pt-2 flex gap-1 items-center mx-auto text-muted-foreground font-semibold italic">
                      <svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-13.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 10h-7l4-5 1.5 2 3-4 5.5 7h-7z"></path></svg>
                      ${caption}
                    </figcaption>
                  </p>`
        }

        node.children.splice(2, 1, figcaptionNode as PhrasingContent);
      });
    });
  }
}