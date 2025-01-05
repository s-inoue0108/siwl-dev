interface WikimediaEmbed {
  type: string;
  title: string;
  displaytitle: string;
  namespace: {
    id: number;
    text: string;
  };
  wikibase_item: string;
  titles: {
    canonical: string;
    normalized: string;
    display: string;
  };
  pageid: number;
  thumbnail: {
    source: string;
    width: number;
    height: number;
  };
  originalimage: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  dir: string;
  revision: string;
  tid: string;
  timestamp: string;
  description: string;
  description_source: string;
  content_urls: {
    desktop: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
    mobile: {
      page: string;
      revisions: string;
      edit: string;
      talk: string;
    };
  };
  extract: string;
  extract_html: string;
}

import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export default function remarkWikimediaEmbed() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node) => {
      if (node.children.length !== 1) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {
        if (!/^\@\{(?:wiki|wikimedia|wikipedia)(?:\:[a-z]{1,3})?\}\(.+\)$/.test(textNode.value)) return;

        const strMatch = textNode.value.match(/^\@\{(?:wiki|wikimedia|wikipedia)(\:[a-z]{1,3})?\}\((.+)\)$/);
        if (!strMatch) return;

        let lang = "ja";
        if (strMatch[1]) lang = strMatch[1].replace(":", "");

        const str = strMatch[2];

        transformer.push(async () => {
          const embed = await fetchEmbed(str, lang);
          const iframeNode = {
            type: "html",
            value: `<blockquote>
                      <div class="pb-4 flex items-center gap-2 font-bold text-lg lg:text-xl xl:text-2xl">
                        <svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" width="1em" style="overflow: visible; color: currentcolor;"><path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021a.228.228 0 0 1-.145-.051.15.15 0 0 1-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-.782.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.172-.346-.273-.857-.295l-.42-.016a.255.255 0 0 1-.152-.045c-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z"></path></svg>
                        <span class="font-bold">${embed.title}</span>
                      </div>
                      ${(embed.thumbnail && embed.thumbnail.source) ? `<img src="${embed.thumbnail.source}" alt="${embed.title}" class="mx-auto max-w-full h-fit mb-4" />` : ""}
                      ${embed.extract_html ?? `<p><strong>[Wikimedia API] Contents Not Found</strong></p>`}
                      <p class="mt-8">
                        <a href="${embed.content_urls.desktop.page}" target="_blank" rel="noopener noreferrer">Wikipedia - ${embed.title}</a>
                        より引用
                      </p>
                    </blockquote>`,
          }

          node.children.splice(0, 1, iframeNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-wikimedia-embed] Error: ${error}`);
    }
  }
}

const fetchEmbed = async (str: string, lang: string): Promise<WikimediaEmbed> => {
  const endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary`;
  const query = encodeURIComponent(str);
  const resp = await fetch(`${endpoint}/${query}`);
  return await resp.json();
}