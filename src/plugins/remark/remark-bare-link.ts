import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import ogs from "open-graph-scraper";

interface OgpData {
  url: string;
  resUrl: string;
  sitename: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
};

export default function remarkBareLink() {
  return async (tree: Root) => {
    const transformer: any[] = [];
    visit(tree, "paragraph", (node, index) => {
      if (node.children.length !== 1 || !index) return;
      const paragraphNode = node.children[0];
      if (!paragraphNode) return;

      visit(paragraphNode, 'text', (textNode) => {

        const urls = textNode.value.match(
          /(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/g
        );

        if (!urls || urls.length !== 1) return;

        transformer.push(async () => {
          const ogp = await fetchOgp(urls[0]);

          const linkCard = generateLinkCard(ogp);
          const linkCardNode = {
            type: "html",
            value: linkCard,
          }

          tree.children.splice(index, 1, linkCardNode as { type: "text", value: string });
        });
      });
    });

    try {
      await Promise.all(transformer.map((t) => t()));
    } catch (error) {
      console.error(`[remark-bare-link] Error: ${error}`);
    }
  }
}

const fetchOgp = async (url: string): Promise<OgpData> => {

  const data = {
    url: url,
    resUrl: "",
    sitename: "No title",
    title: "No title",
    description: "No description",
    image: "",
    favicon: "",
  }

  try {
    const { result } = await ogs({ url });

    const image = await validateImageUrl(result.ogImage?.[0]?.url ?? "");
    const favicon = await validateFaviconUrl(url, result.favicon ?? "");

    data.resUrl = result.ogUrl ?? "";
    data.sitename = result.ogSiteName ?? "";
    data.title = result.ogTitle ?? "";
    data.description = result.ogDescription ?? "";
    data.image = image;
    data.favicon = favicon;

    return data;
  } catch (error) {
    console.error(`[remark-bare-link] Error: ${error}`);
    return data;
  }
};

const validateImageUrl = async (image: string) => {
  if (!image || image === "") return "";

  try {
    const res = await fetch(image, { method: "GET" });
    const contentType = res.headers.get("content-type");

    if (res.ok && contentType?.startsWith("image/")) {

      // base64 encode
      if (image.length > 1000) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:${contentType};base64,${base64}`
      }

      return image;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
}

const validateFaviconUrl = async (url: string, favicon: string) => {
  if (!favicon || favicon === "") return "";

  let reqUrl;

  if (/^https?:\/\//.test(favicon)) {
    reqUrl = favicon;
  } else if (favicon.startsWith("/")) {
    reqUrl = `${new URL(url).origin}${favicon}`;
  } else {
    reqUrl = `${new URL(url).origin}/${favicon}`;
  }

  try {
    const res = await fetch(reqUrl, {
      method: "GET",
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      },
    });

    const contentType = res.headers.get("content-type");

    if (res.ok && contentType?.startsWith("image/")) {
      return res.url;
    } else {
      return "";
    }
  } catch (err) {
    return "";
  }
};

const generateLinkCard = (data: OgpData): string => {
  const { url, resUrl, sitename, title, description, image, favicon } = data;

  const dom =
    `<div class="my-8 w-full h-24 xl:h-36 border border-muted-background bg-muted-transparent rounded-xl hover:bg-muted-background transition duration-200">
      <a class="bare-link-card" href="${url}" target="_blank" rel="noopener noreferrer">
        <div class="flex items-center">
          <div class="border-r border-muted-background w-32 h-24 xl:w-64 xl:h-36">
            ${image && image !== "" ? `
              <img
                src="${image}"
                class="w-full h-full object-cover rounded-l-[calc(0.75rem-1px)]"
              />
            ` : `
              <div class="bg-gradient-to-r from-accent-sub-base to-accent-base w-full h-full flex items-center justify-center rounded-l-[calc(0.75rem-1px)]">
                <div>
                  <svg class="w-6 h-6 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10 fill-foreground" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M6.879 9.934a.81.81 0 0 1-.575-.238 3.818 3.818 0 0 1 0-5.392l3-3C10.024.584 10.982.187 12 .187s1.976.397 2.696 1.117a3.818 3.818 0 0 1 0 5.392l-1.371 1.371a.813.813 0 0 1-1.149-1.149l1.371-1.371A2.19 2.19 0 0 0 12 1.812c-.584 0-1.134.228-1.547.641l-3 3a2.19 2.19 0 0 0 0 3.094.813.813 0 0 1-.575 1.387z"></path><path fill="currentColor" d="M4 15.813a3.789 3.789 0 0 1-2.696-1.117 3.818 3.818 0 0 1 0-5.392l1.371-1.371a.813.813 0 0 1 1.149 1.149l-1.371 1.371A2.19 2.19 0 0 0 4 14.188c.585 0 1.134-.228 1.547-.641l3-3a2.19 2.19 0 0 0 0-3.094.813.813 0 0 1 1.149-1.149 3.818 3.818 0 0 1 0 5.392l-3 3A3.789 3.789 0 0 1 4 15.813z"></path></svg>
                </div>
              </div>
            `}
          </div>
          <div class="relative flex flex-col gap-2 xl:gap-4 px-2 py-1 xl:px-3 xl:py-2 w-full h-24 xl:h-36">
            <div class="font-bold xl:text-xl truncate">${title ?? sitename}</div>
            <div class="h-12 xl:h-16 text-xs xl:text-base text-muted-foreground truncate">${description}</div>
            <div class="absolute bottom-1 left-1 xl:bottom-2 xl:left-2 flex items-center gap-1 xl:gap-2 w-[calc(100%-1rem)]">
              ${favicon && favicon !== "" ? `
                <div class="h-3 xl:h-4">
                  <img src="${favicon}" class="h-full object-contain" />
                </div>
              ` : `
                <div class="h-3 xl:h-4">
                  <svg class="h-full fill-muted-foreground" stroke-width="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Z"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48Z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 48 256 464"></path><path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M464 256 48 256"></path></svg>
                </div>
              `}
              <span class="font-code text-xs xl:text-sm text-muted-foreground whitespace-nowrap truncate">
                ${resUrl && resUrl !== "" ? new URL(resUrl).origin : new URL(url).origin}
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `
  return dom
}
