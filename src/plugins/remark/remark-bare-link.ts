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
      index: number;
      url: string;
    }> = [];

    visit(tree, "paragraph", (node, index) => {
      if (index == null || node.children.length !== 1) {
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

      tasks.push({
        index,
        url: normalizeUrl(urls[0]),
      });
    });

    const results = await Promise.all(
      tasks.map(async ({ index, url }) => {
        try {
          const ogp = await fetchOgp(url);
          const html = generateLinkCard(ogp);

          return {
            index,
            html,
          };
        } catch (error) {
          console.warn(
            `[remark-bare-link] Failed: ${url}`,
            error,
          );

          return null;
        }
      }),
    );

    // tree.children の変更は非同期処理がすべて終わってから行う
    for (const result of results) {
      if (!result) {
        continue;
      }

      tree.children[result.index] = {
        type: "html",
        value: result.html,
      };
    }
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
      `[remark-bare-link] OGP fetch failed: ${url}`,
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
                <span class="text-lg font-semibold">
                  No Image
                </span>
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
  let timer: ReturnType<typeof setTimeout>;

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
    clearTimeout(timer!);
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

// import type { Root } from "mdast";
// import { visit } from "unist-util-visit";
// import ogs from "open-graph-scraper";

// interface OgpData {
//   url: string;
//   resUrl: string;
//   sitename: string;
//   title: string;
//   description: string;
//   image: string;
//   favicon: string;
// }

// const OGP_TIMEOUT = 10_000;
// const IMAGE_TIMEOUT = 5_000;
// const FAVICON_TIMEOUT = 5_000;

// export default function remarkBareLink() {
//   return async (tree: Root) => {
//     const transformer: Array<() => Promise<void>> = [];

//     visit(tree, "paragraph", (node, index) => {
//       // index === 0 is valid, so don't use `!index`.
//       if (index == null || node.children.length !== 1) {
//         return;
//       }

//       const child = node.children[0];

//       if (!child || child.type !== "text") {
//         return;
//       }

//       const urls = child.value.match(
//         /(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/g,
//       );

//       if (!urls || urls.length !== 1) {
//         return;
//       }

//       const url = urls[0];

//       transformer.push(async () => {
//         try {
//           const ogp = await fetchOgp(url);
//           const linkCard = generateLinkCard(ogp);

//           tree.children.splice(index, 1, {
//             type: "html",
//             value: linkCard,
//           });
//         } catch (error) {
//           // OGP generation must never break the Markdown build.
//           console.warn(
//             `[remark-bare-link] Failed to generate link card: ${url}`,
//             error,
//           );
//         }
//       });
//     });

//     // Every task is best-effort.
//     // Even if one task unexpectedly rejects, the remark plugin resolves.
//     await Promise.allSettled(
//       transformer.map((transform) => transform()),
//     );
//   };
// }

// const generateLinkCard = (data: OgpData): string => {
//   const {
//     url,
//     resUrl,
//     sitename,
//     title,
//     description,
//     image,
//     favicon,
//   } = data;

//   const origin = getOrigin(resUrl || url);

//   const dom = `
//     <div class="my-8 xl:my-12 w-full h-24 xl:h-36 border border-muted-background bg-muted-transparent rounded-xl hover:bg-muted-background transition duration-200">
//       <a
//         class="bare-link-card"
//         href="${escapeHtml(url)}"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <div class="flex flex-row-reverse items-center">
//           <div class="border-l border-muted-background w-32 lg:w-64 h-24 xl:w-96 xl:h-36">
//             ${image
//       ? `
//               <img
//                 src="${escapeHtml(image)}"
//                 class="w-full h-full object-cover rounded-r-[calc(0.75rem-1px)]"
//               />
//             `
//       : `
//               <div class="bg-gradient-to-r from-accent-sub-base to-accent-base w-full h-full flex items-center justify-center rounded-r-[calc(0.75rem-1px)]">
//                 <span class="text-lg font-semibold">No Image</span>
//               </div>
//             `
//     }
//           </div>

//           <div class="relative flex flex-col gap-2 xl:gap-4 px-2 py-1 xl:px-3 xl:py-2 w-full h-24 xl:h-36">
//             <div class="font-bold xl:text-xl truncate">
//               ${escapeHtml(title || sitename || "No title")}
//             </div>

//             <div class="h-12 xl:h-16 text-xs xl:text-base text-muted-foreground truncate">
//               ${escapeHtml(description || "")}
//             </div>

//             <div class="absolute bottom-1 left-1 xl:bottom-2 xl:left-2 flex items-center gap-1 xl:gap-2 w-[calc(100%-1rem)]">
//               ${favicon
//       ? `
//                 <div class="h-3 xl:h-4">
//                   <img
//                     src="${escapeHtml(favicon)}"
//                     class="h-full object-contain"
//                   />
//                 </div>
//               `
//       : `
//                 <div class="h-3 xl:h-4">
//                   <svg
//                     class="h-full fill-muted-foreground"
//                     stroke-width="0"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 512 512"
//                   >
//                     <path
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-miterlimit="10"
//                       stroke-width="32"
//                       d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48Z"
//                     ></path>
//                     <path
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-miterlimit="10"
//                       stroke-width="32"
//                       d="M256 48c-58.07 0-112.67 93.13-112.67 208S197.93 464 256 464s112.67-93.13 112.67-208S314.07 48 256 48Z"
//                     ></path>
//                     <path
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="32"
//                       d="M117.33 117.33c38.24 27.15 86.38 43.34 138.67 43.34s100.43-16.19 138.67-43.34M394.67 394.67c-38.24-27.15-86.38-43.34-138.67-43.34s-100.43 16.19-138.67 43.34"
//                     ></path>
//                     <path
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-miterlimit="10"
//                       stroke-width="32"
//                       d="M256 48 256 464"
//                     ></path>
//                     <path
//                       fill="none"
//                       stroke="currentColor"
//                       stroke-miterlimit="10"
//                       stroke-width="32"
//                       d="M464 256 48 256"
//                     ></path>
//                   </svg>
//                 </div>
//               `
//     }

//               <span class="font-code text-xs xl:text-sm text-muted-foreground whitespace-nowrap truncate">
//                 ${escapeHtml(origin)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </a>
//     </div>
//   `;

//   return dom;
// };

// const fetchOgp = async (url: string): Promise<OgpData> => {
//   const data: OgpData = {
//     url,
//     resUrl: "",
//     sitename: "No title",
//     title: "No title",
//     description: "No description",
//     image: "",
//     favicon: "",
//   };

//   try {
//     // Validate the URL before making any network request.
//     if (!isValidHttpUrl(url)) {
//       console.warn(
//         `[remark-bare-link] Invalid URL: ${url}`,
//       );
//       return data;
//     }

//     const { result } = await withTimeout(
//       ogs({
//         url,
//         timeout: OGP_TIMEOUT,
//       }),
//       OGP_TIMEOUT,
//     );

//     data.resUrl = result.ogUrl ?? "";
//     data.sitename = result.ogSiteName ?? "";
//     data.title = result.ogTitle ?? "";
//     data.description = result.ogDescription ?? "";

//     // These are independent requests.
//     // If either one fails, only that field becomes empty.
//     const [image, favicon] = await Promise.all([
//       validateImageUrl(
//         result.ogImage?.[0]?.url ?? "",
//       ),
//       validateFaviconUrl(
//         url,
//         result.favicon ?? "",
//       ),
//     ]);

//     data.image = image;
//     data.favicon = favicon;

//     return data;
//   } catch (error) {
//     console.warn(
//       `[remark-bare-link] Failed to fetch OGP: ${url}`,
//       error,
//     );

//     return data;
//   }
// };

// const validateImageUrl = async (
//   image: string,
// ): Promise<string> => {
//   if (!image) {
//     return "";
//   }

//   try {
//     if (!isValidHttpUrl(image)) {
//       return "";
//     }

//     const res = await withTimeout(
//       fetch(image, {
//         method: "GET",
//       }),
//       IMAGE_TIMEOUT,
//     );

//     const contentType = res.headers.get("content-type");

//     if (!res.ok || !contentType?.startsWith("image/")) {
//       return "";
//     }

//     // Don't embed large images as base64.
//     if (image.length > 1000) {
//       const buffer = await res.arrayBuffer();
//       const base64 = Buffer.from(buffer).toString("base64");

//       return `data:${contentType};base64,${base64}`;
//     }

//     return image;
//   } catch (error) {
//     console.warn(
//       `[remark-bare-link] Failed to validate image: ${image}`,
//       error,
//     );

//     return "";
//   }
// };

// const validateFaviconUrl = async (
//   url: string,
//   favicon: string,
// ): Promise<string> => {
//   if (!favicon) {
//     return "";
//   }

//   let reqUrl: string;

//   try {
//     const baseUrl = new URL(url);

//     if (/^https?:\/\//i.test(favicon)) {
//       reqUrl = favicon;
//     } else {
//       reqUrl = new URL(
//         favicon,
//         baseUrl.origin,
//       ).href;
//     }
//   } catch (error) {
//     console.warn(
//       `[remark-bare-link] Invalid favicon URL: ${favicon}`,
//       error,
//     );

//     return "";
//   }

//   try {
//     const res = await withTimeout(
//       fetch(reqUrl, {
//         method: "GET",
//         headers: {
//           "User-Agent":
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
//             "AppleWebKit/537.36 (KHTML, like Gecko) " +
//             "Chrome/74.0.3729.169 Safari/537.36",
//         },
//       }),
//       FAVICON_TIMEOUT,
//     );

//     const contentType = res.headers.get("content-type");

//     if (!res.ok || !contentType?.startsWith("image/")) {
//       return "";
//     }

//     return res.url;
//   } catch (error) {
//     console.warn(
//       `[remark-bare-link] Failed to validate favicon: ${reqUrl}`,
//       error,
//     );

//     return "";
//   }
// };

// const isValidHttpUrl = (value: string): boolean => {
//   try {
//     const url = new URL(value);

//     return (
//       url.protocol === "http:" ||
//       url.protocol === "https:"
//     );
//   } catch {
//     return false;
//   }
// };

// const getOrigin = (value: string): string => {
//   try {
//     return new URL(value).origin;
//   } catch {
//     return "";
//   }
// };

// const withTimeout = async <T>(
//   promise: Promise<T>,
//   timeout: number,
// ): Promise<T> => {
//   let timer: ReturnType<typeof setTimeout> | undefined;

//   try {
//     return await Promise.race([
//       promise,
//       new Promise<never>((_, reject) => {
//         timer = setTimeout(() => {
//           reject(
//             new Error(
//               `Request timed out after ${timeout} ms`,
//             ),
//           );
//         }, timeout);
//       }),
//     ]);
//   } finally {
//     if (timer !== undefined) {
//       clearTimeout(timer);
//     }
//   }
// };

// const escapeHtml = (value: string): string => {
//   return value
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// };
