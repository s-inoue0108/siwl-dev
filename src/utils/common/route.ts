import { getOmit } from "./utilfuncs";

export class AllowedRoutes {

  // /pages ルートの設定
  private static _ROUTE_CONFIG = [
    {
      name: "Blog",
      matchers: [/^\/blog\/[0-9]+/,],
      rootpath: "/blog/1",
      description: "プログラミングについての情報を発信しています。",
      subsets: [
        {
          name: "Category",
          matchers: [/^\/blog\/category\/[tech|idea]+\/[0-9]+/,],
          rootpath: "/blog/1",
          description: "",
        },
        {
          name: "Tag",
          matchers: [/^\/blog\/tag\/[^\/]+\/[0-9]+/,],
          rootpath: "/blog/1",
          description: "",
        },
        {
          name: "Article",
          matchers: [/^\/blog\/article\/[^\/]+/,],
          rootpath: "/blog/1",
          description: "",
        },
        {
          name: "Archive",
          matchers: [/^\/blog\/archive/, /^\/blog\/archive\/[0-9]{4}-[0-9]{1,2}/],
          rootpath: "/blog/1",
          description: "",
        },
      ],
    },
    {
      name: "About",
      matchers: [/^\/about/],
      rootpath: "/about",
      description: "",
      subsets: [],
    },
    {
      name: "Works",
      matchers: [/^\/works/],
      rootpath: "/works",
      description: "",
      subsets: [],
    },
    {
      name: "Contact",
      matchers: [/^\/contact/],
      rootpath: "/contact",
      description: "",
      subsets: [],
    },
    {
      name: "Privacy Policy",
      matchers: [/^\/privacy-policy/],
      rootpath: "/privacy-policy",
      description: "",
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

  // rootページのメタ情報
  getRootPageMeta = () => {
    if (!this.isAllowedPath()) throw new Error(`Invalid path: ${this._path}`);

    const roots = AllowedRoutes._ROUTE_CONFIG.map((route) => {
      return getOmit(route, "subsets");
    });

    const obj = roots.find(({ matchers }) => {
      return matchers.some((matcher) => {
        return matcher.test(this._path);
      });
    });

    if (!obj) throw new Error(`Invalid path: ${this._path}`);
    return obj;
  }
}