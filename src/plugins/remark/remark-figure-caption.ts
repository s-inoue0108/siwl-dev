import type { Root, PhrasingContent } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkFigureCaption() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const captionNode = node.children[0];

      if (captionNode.type !== "emphasis") return;

      visit(captionNode, "emphasis", (captionNode) => {
        const captionNodeChild = captionNode.children[0] as { type: "text", value: string };
        const caption = captionNodeChild.value;

        if (!caption.startsWith("[!image]") && !caption.startsWith("[!table]") && !caption.startsWith("[!chem]")) return;

        const match = caption.match(/^\[!(?<type>.+)\]\s?(?<title>.+)?$/);
        if (match?.groups?.type == null) return;

        const isCaptionType = (type: string): type is CaptionType => {
          return type as CaptionType !== undefined;
        }

        const type = (isCaptionType(match.groups.type.toLowerCase()) ? match.groups.type.toLowerCase() : "image") as CaptionType;

        const figcaptionNode = {
          type: "html",
          value: `<p>
                    <figcaption class="caption-${type} w-fit py-2 flex gap-1 items-center mx-auto text-muted-foreground font-semibold">
                      ${captionIcons[type]}
                      ${match.groups.title}
                    </figcaption>
                  </p>`
        }

        node.children = [figcaptionNode as PhrasingContent];
      });
    });
  }
}

const captionIcons = {
  "image": '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M19.999 4h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-13.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 10h-7l4-5 1.5 2 3-4 5.5 7h-7z"></path></svg>',
  "table": '<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M4 21h15.893c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zm0-2v-5h4v5H4zM14 7v5h-4V7h4zM8 7v5H4V7h4zm2 12v-5h4v5h-4zm6 0v-5h3.894v5H16zm3.893-7H16V7h3.893v5z"></path></svg>',
  "chem": '<svg stroke-width="0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="currentColor" style="overflow: visible;"><path d="M15.442.718a2.58 2.58 0 0 0-2.579 2.579 2.58 2.58 0 0 0 1.368 2.275L12.809 8.27a3.505 3.505 0 0 0-1.077-.172 3.505 3.505 0 0 0-3.505 3.505 3.505 3.505 0 0 0 .085.745l-2.83 1.036a2.97 2.97 0 0 0-2.513-1.39A2.97 2.97 0 0 0 0 14.962a2.97 2.97 0 0 0 2.97 2.97 2.97 2.97 0 0 0 2.969-2.97 2.97 2.97 0 0 0-.072-.634l2.716-1.193a3.505 3.505 0 0 0 3.15 1.972 3.505 3.505 0 0 0 2.129-.724l2.276 2.167a4.305 4.305 0 0 0-.749 2.426 4.305 4.305 0 0 0 4.306 4.305A4.305 4.305 0 0 0 24 18.977a4.305 4.305 0 0 0-4.305-4.305 4.305 4.305 0 0 0-2.718.969l-2.424-1.964a3.505 3.505 0 0 0 .684-2.074 3.505 3.505 0 0 0-1.521-2.89l1.204-2.891a2.58 2.58 0 0 0 .522.054 2.58 2.58 0 0 0 2.58-2.58 2.58 2.58 0 0 0-2.58-2.578Z"></path></svg>',
}

type CaptionType = keyof typeof captionIcons