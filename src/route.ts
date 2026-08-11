import { getOmit } from "./utils/common/utilfuncs";

export class AllowedRoutes {

  // /pages ルートの設定
  private static _ROUTE_CONFIG = [
    {
      name: "Home",
      matchers: [/^\/$/,],
      rootpath: "/",
      description: "I'm a Master's student in Computational Materials Chemistry and also a web developer.",
      subsets: [],
    },
    {
      name: "Blog",
      matchers: [/^\/blog\/[0-9]+/,],
      rootpath: "/blog/1",
      description: "The content primarily focuses on AI/ML, computational chemistry, and web development (hobby).",
      subsets: [
        {
          name: "Categories",
          matchers: [/^\/blog\/categories/, /^\/blog\/categories\/[tech|idea]+\/[0-9]+/,],
          rootpath: "/blog/categories",
          description: "A list of article categories.",
          subsets: [],
        },
        {
          name: "Tags",
          matchers: [/^\/blog\/tags/, /^\/blog\/tags\/[^\/]+\/[0-9]+/,],
          rootpath: "/blog/tags",
          description: "A list of tags.",
          subsets: [],
        },
        {
          name: "Articles",
          matchers: [/^\/blog\/articles\/[^\/]+/,],
          rootpath: "/blog/1",
          description: "Article page.",
          subsets: [],
        },
        {
          name: "Archives",
          matchers: [/^\/blog\/archives/, /^\/blog\/archives\/[0-9]{4}-[0-9]{1,2}/],
          rootpath: "/blog/archives",
          description: "Past article headlines.",
          subsets: [],
        },
      ],
    },
    {
      name: "About",
      matchers: [/^\/about/],
      rootpath: "/about",
      description: "I'm a Master's student in Computational Materials Chemistry and also a web developer.",
      subsets: [],
    },
    {
      name: "Bookmarks",
      matchers: [/^\/bookmarks\/[0-9]+/],
      rootpath: "/bookmarks/1",
      description: "A list of links to the websites I use frequently.",
      subsets: [],
    },
    {
      name: "Contact",
      matchers: [/^\/contact/],
      rootpath: "/contact",
      description: "Welcome your feedback and inquiries regarding this website.",
      subsets: [],
    },
    {
      name: "Privacy Policy",
      matchers: [/^\/privacy-policy/],
      rootpath: "/privacy-policy",
      description: "Privacy policy page.",
      subsets: [],
    },
    {
      name: "Readme",
      matchers: [/^\/readme/],
      rootpath: "/readme",
      description: "README of this website.",
      subsets: [],
    },
  ] as const

  // 許されるすべてのルートパターン
  private static _all_patterns = AllowedRoutes._ROUTE_CONFIG.flatMap(({ matchers, subsets }) => {
    return [
      ...matchers,
      ...subsets.flatMap(({ matchers }) => matchers),
    ];
  });

  private _path: string;

  constructor(path: string) {
    this._path = path;
  }

  // バリデーション
  private isAllowedPath = () => {
    return AllowedRoutes._all_patterns.some((pattern) => {
      return pattern.test(this._path);
    });
  }

  // rootページのメタ情報（current）
  getRootPageMeta = () => {
    if (!this.isAllowedPath()) throw new Error(`Invalid path: ${this._path}`);

    const meta = AllowedRoutes._ROUTE_CONFIG.find(({ matchers, subsets }) => {
      const isMatchRoot = matchers.some((matcher) => {
        return matcher.test(this._path);
      });

      if (subsets.length > 0) {
        const subsetPatterns = subsets.flatMap(({ matchers }) => {
          return matchers;
        });

        const isMatchSubset = subsetPatterns.some((matcher) => {
          return matcher.test(this._path);
        });

        return isMatchRoot || isMatchSubset;
      }

      return isMatchRoot;
    });

    const isRoot = AllowedRoutes._ROUTE_CONFIG.flatMap(({ matchers }) => {
      return matchers;
    }).some((matcher) => {
      return matcher.test(this._path);
    });

    if (!meta) throw new Error(`Invalid path: ${this._path}`);
    return { meta, isRoot };
  }

  // rootページのメタ情報（fromName）
  getRootPageMetaFromName = (name: typeof AllowedRoutes._ROUTE_CONFIG[number]["name"]) => {
    if (!this.isAllowedPath()) throw new Error(`Invalid path: ${this._path}`);
    const meta = AllowedRoutes._ROUTE_CONFIG.find((route) => {
      return route.name === name;
    });

    if (!meta) throw new Error(`Invalid path: ${this._path}`);

    return meta;
  }

  // rootページのすべてのメタ情報
  getRootPageMetaAll = (omitRouteNames?: typeof AllowedRoutes._ROUTE_CONFIG[number]["name"][]) => {
    if (omitRouteNames && omitRouteNames.length > 0) {
      return AllowedRoutes._ROUTE_CONFIG.filter(({ name }) => {
        return omitRouteNames.every((routeName) => {
          return routeName !== name;
        });
      });
    }
    return AllowedRoutes._ROUTE_CONFIG;
  }

  // サブページのメタ情報（current）
  getSubsetPageMeta = () => {
    if (!this.isAllowedPath()) throw new Error(`Invalid path: ${this._path}`);

    const { meta } = this.getRootPageMeta();
    if (meta.subsets.length < 1) return { meta: getOmit(meta, "subsets"), isRoot: true };

    const subsetMeta = meta.subsets.find(({ matchers }) => {
      return matchers.some((matcher) => {
        return matcher.test(this._path);
      });
    });

    if (!subsetMeta) return { meta: getOmit(meta, "subsets"), isRoot: true };
    return { meta: subsetMeta, isRoot: false };
  }
}