import { load, type CheerioAPI } from "cheerio";
import katex from "katex";
import { createHighlighter } from 'shiki';
import type { HighlighterGeneric, BundledLanguage, BundledTheme } from 'shiki';

export class Decorator {
  private $: CheerioAPI
  constructor(html: string) {
    this.$ = load(html);
  }

  private Headings = async () => {
    // h1
    this.$("h1").each((_, elm) => {
      const text = this.$(elm).text().trim();
      this.$(elm).replaceWith(
        `<h1 id="h1-${text}" class="mt-8 mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 w-full pb-2 border-b border-muted-background">
          <a href="#h1-${text}" class="bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent">#</a>
          <span>${text}</span>
        </h1>`
      )
    });

    // h2
    this.$("h2").each((_, elm) => {
      const text = this.$(elm).text().trim();
      this.$(elm).replaceWith(
        `<h2 id="h2-${text}" class="mt-8 mb-4 text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 w-full pb-1 border-b border-muted-background">
          <a href="#h2-${text}" class="bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent">##</a>
          <span>${text}</span>
        </h2>`
      )
    });

    // h3
    this.$("h3,h4,h5,h6").each((_, elm) => {
      const text = this.$(elm).text().trim();
      this.$(elm).replaceWith(
        `<h3 id="h3-${text}" class="mt-8 mb-4 text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-2 w-full">
          <a href="#h3-${text}" class="bg-gradient-to-r from-accent-sub-base to-accent-base bg-clip-text text-tranparent">###</a>
          <span>${text}</span>
        </h3>`
      )
    });
  }

  private codeBlock = async () => {

    const highlighter = await createHighlighter({
      themes: ["material-theme-lighter", "material-theme-darker"],
      langs: [],
    });

    const loadLang = async (highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>, lang: BundledLanguage) => {
      await highlighter.loadLanguage(lang);
    };

    const isLang = (lang: string): lang is BundledLanguage => {
      return lang !== undefined;
    };

    const getHighlightedCode = async (highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>, lang: BundledLanguage, code: string) => {
      const highlightedCode = highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: "material-theme-lighter",
          dark: "material-theme-darker",
        },
        colorReplacements: {
          "material-theme-lighter": {
            "#fafafa": "#f3f3f3",
          },
          "material-theme-darker": {
            "#212121": "#111827",
          }
        }
      });
      return highlightedCode;
    }

    const pres = await Promise.all(this.$("pre code").map(async (_, elm) => {
      const classNames = this.$(elm).attr("class");
      const lang = classNames && classNames.split(" ").find((c) => c.startsWith("language-"))?.replace("language-", "");

      // this.$(elm)
      //   .parent()
      //   .before(
      //     `<div div class= "code-title" > <label class="title" > ${fileName ?? ""
      //     }</label><button type="button" id="copy-btn-${idx}" class="copy-btn"><svg xmlns="http:/ / www.w3.org / 2000 / svg" viewBox="${svgViewBoxes.copy
      //     }"><path d="${svgPaths.copy}" /></svg></button></div>`
      //   );

      if (!lang || lang === "" || !isLang(lang)) {
        return;
      }

      const code = this.$(elm).text();
      await loadLang(highlighter, lang);
      const highlightedCode = await getHighlightedCode(highlighter, lang, code);
      return highlightedCode;
    }));

    highlighter.dispose();

    this.$("pre").each((idx, elm) => {
      this.$(elm).replaceWith(pres[idx] as string);
    });
  };

  getDecoratedHtml = async () => {
    await this.Headings();
    await this.codeBlock();
    return this.$.html();
  }
}