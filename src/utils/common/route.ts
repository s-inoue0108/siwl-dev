const routeRule = {
  "Blog": [/^\/blog\/[0-9]+$/, /^\/blog\/tag\/[^\/]+\/[0-9]+/, /^\/blog\/article\/[^\/]+/, /^\/blog\/archive/, /^\/blog\/archive\/[0-9]{4}-[0-9]{1,2}/],
  "About": [/^\/about$/],
  "Works": [/^\/works$/],
  "Contact": [/^\/contact$/],
  "Privacy Policy": [/^\/privacy-policy$/],
}

export class AllowedRoutes {
  private _path: string;
  private static _names = Object.keys(routeRule) as (keyof typeof routeRule)[];
  private static _patterns = this._names.flatMap((key) => {
    return routeRule[key];
  });

  constructor(path: string) {
    this._path = path;
  }

  // Type Guard
  private isAllowedPath = () => {
    return AllowedRoutes._patterns.some((pattern) => {
      return pattern.test(this._path);
    })
  }

  getRootPageName = () => {
    if (!this.isAllowedPath()) throw new Error(`Invalid path: ${this._path}`);

    const bools = AllowedRoutes._names.map((key) => {
      return routeRule[key].some((rule) => rule.test(this._path));
    });

    return AllowedRoutes._names[bools.indexOf(true)];
  }
}