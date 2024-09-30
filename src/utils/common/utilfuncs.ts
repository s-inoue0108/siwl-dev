// https://zenn.dev/zozotech/articles/a107520099d8be
export const getOmit = <
  T extends Record<string, unknown>,
  K extends [keyof T, ...(keyof T)[]]
>(
  obj: T,
  ...keys: K
): Omit<T, K[number]> => {
  const result = { ...obj };
  for (const key of keys) {
    if (key in result) delete result[key];
  }
  return result;
};

export const getPick = <
  T extends Record<string, unknown>,
  K extends [keyof T, ...(keyof T)[]]
>(
  obj: T,
  ...keys: K
): Pick<T, K[number]> => {
  const result = {} as Pick<T, K[number]>;
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
};