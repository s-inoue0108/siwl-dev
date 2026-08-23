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
}

const OGP_TIMEOUT = 10_000;
const IMAGE_TIMEOUT = 5_000;
const FAVICON_TIMEOUT = 5_000;

export default function remarkBareLink() {
  return async (tree: Root) => {
    const tasks: Array<{
      parent: Root;
      index: number;
      url: string;
    }> = [];

    visit(tree, "paragraph", (node, index, parent) => {
      if (index == null || !parent) {
        return;
      }

      // Bare URL だけの paragraph を対象にする
      if (node.children.length !== 1) {
        return;
      }

      const child = node.children[0];

      if (!child || child.type !== "text") {
        return;
      }

      const urls = child.value.match(
        /(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/g,
      );

      if (!urls || urls.length !== 1) {
        return;
      }

      const url = normalizeUrl(urls[0]);

      // paragraph の親と index を保持する
      tasks.push({
        parent: parent as Root,
        index,
        url,
      });
    });

    console.log(
      `[remark-bare-link] Found ${tasks.length} bare link(s)`,
    );

    const results = await Promise.all(
      tasks.map(async ({ index, url }) => {
        try {
          const ogp = await fetchOgp(url);
          const html = generateLinkCard(ogp);

          return {
            index,
            html,
            url,
          };
        } catch (error) {
          console.warn(
            `[remark-bare-link] Failed to generate card: ${url}`,
            error,
          );

          return null;
        }
      }),
    );

    let generated = 0;

    for (const result of results) {
      if (!result) {
        continue;
      }

      const { index, html, url } = result;

      // Root の paragraph を HTML node に置換
      tree.children[index] = {
        type: "html",
        value: html,
      };

      generated++;

      console.log(
        `[remark-bare-link] Generated link card: ${url}`,
      );
    }

    console.log(
      `[remark-bare-link] Generated ${generated}/${tasks.length} link card(s)`,
    );
  };
}

const normalizeUrl = (url: string): string => {
  if (url.startsWith("www.")) {
    return `https://${url}`;
  }

  return url;
};

const fetchOgp = async (url: string): Promise<OgpData> => {
  const data: OgpData = {
    url,
    resUrl: "",
    sitename: "No title",
    title: "No title",
    description: "No description",
    image: "",
    favicon: "",
  };

  try {
    const { result } = await withTimeout(
      ogs({ url }),
      OGP_TIMEOUT,
    );

    data.resUrl = result.ogUrl ?? "";
    data.sitename = result.ogSiteName ?? "";
    data.title = result.ogTitle ?? "";
    data.description = result.ogDescription ?? "";

    const [image, favicon] = await Promise.all([
      validateImageUrl(
        result.ogImage?.[0]?.url ?? "",
      ),
      validateFaviconUrl(
        url,
        result.favicon ?? "",
      ),
    ]);

    data.image = image;
    data.favicon = favicon;

    return data;
  } catch (error) {
    console.warn(
      `[remark-bare-link] Failed to fetch OGP: ${url}`,
      error,
    );

    return data;
  }
};

const generateLinkCard = (data: OgpData): string => {
  const {
    url,
    resUrl,
    sitename,
    title,
    description,
    image,
    favicon,
  } = data;

  const origin = getOrigin(resUrl || url);

  return `
<div class="my-8 xl:my-12 w-full h-24 xl:h-36 border border-muted-background bg-muted-transparent rounded-xl hover:bg-muted-background transition duration-200">
  <a
    class="bare-link-card"
    href="${escapeHtml(url)}"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="flex flex-row-reverse items-center">
      <div class="border-l border-muted-background w-32 lg:w-64 h-24 xl:w-96 xl:h-36">
        ${image
      ? `
          <img
            src="${escapeHtml(image)}"
            class="w-full h-full object-cover rounded-r-[calc(0.75rem-1px)]"
          />
        `
      : `
          <div class="bg-gradient-to-r from-accent-sub-base to-accent-base w-full h-full flex items-center justify-center rounded-r-[calc(0.75rem-1px)]">
            <span class="text-lg font-semibold">No Image</span>
          </div>
        `
    }
      </div>

      <div class="relative flex flex-col gap-2 xl:gap-4 px-2 py-1 xl:px-3 xl:py-2 w-full h-24 xl:h-36">
        <div class="font-bold xl:text-xl truncate">
          ${escapeHtml(title || sitename || "No title")}
        </div>

        <div class="h-12 xl:h-16 text-xs xl:text-base text-muted-foreground truncate">
          ${escapeHtml(description || "")}
        </div>

        <div class="absolute bottom-1 left-1 xl:bottom-2 xl:left-2 flex items-center gap-1 xl:gap-2 w-[calc(100%-1rem)]">
          ${favicon
      ? `
            <div class="h-3 xl:h-4">
              <img
                src="${escapeHtml(favicon)}"
                class="h-full object-contain"
              />
            </div>
          `
      : ""
    }

          <span class="font-code text-xs xl:text-sm text-muted-foreground whitespace-nowrap truncate">
            ${escapeHtml(origin)}
          </span>
        </div>
      </div>
    </div>
  </a>
</div>
`;
};

const validateImageUrl = async (
  image: string,
): Promise<string> => {
  if (!isValidHttpUrl(image)) {
    return "";
  }

  try {
    const res = await withTimeout(
      fetch(image),
      IMAGE_TIMEOUT,
    );

    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType?.startsWith("image/")) {
      return "";
    }

    if (image.length > 1000) {
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      return `data:${contentType};base64,${base64}`;
    }

    return image;
  } catch (error) {
    console.warn(
      `[remark-bare-link] Image validation failed: ${image}`,
      error,
    );

    return "";
  }
};

const validateFaviconUrl = async (
  url: string,
  favicon: string,
): Promise<string> => {
  if (!favicon) {
    return "";
  }

  try {
    const reqUrl = new URL(
      favicon,
      new URL(url).origin,
    ).href;

    const res = await withTimeout(
      fetch(reqUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
            "AppleWebKit/537.36 (KHTML, like Gecko) " +
            "Chrome/74.0.3729.169 Safari/537.36",
        },
      }),
      FAVICON_TIMEOUT,
    );

    const contentType = res.headers.get("content-type");

    if (!res.ok || !contentType?.startsWith("image/")) {
      return "";
    }

    return res.url;
  } catch (error) {
    console.warn(
      `[remark-bare-link] Favicon validation failed: ${favicon}`,
      error,
    );

    return "";
  }
};

const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

const getOrigin = (value: string): string => {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeout: number,
): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(
            new Error(
              `Timeout after ${timeout} ms`,
            ),
          );
        }, timeout);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
