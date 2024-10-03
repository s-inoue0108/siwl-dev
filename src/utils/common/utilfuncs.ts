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

// https://qiita.com/suin/items/1b39ce57dd660f12f34b
export const getSerialNumbers = (start: number = 0, stop: number) => {
  const arr = [];
  for (let n = start; n <= stop; n++) {
    arr.push(n);
  }
  return arr;
}

// age, experienceYears
export const getAge = () => {
  const now = new Date();

  const birthYear = 2003;
  const currentYear = now.getFullYear();

  // GMT
  const currentBirthDay = new Date(`${currentYear}-01-08T04:08:00.000Z`);

  if (currentBirthDay.getTime() > now.getTime()) {
    return currentYear - birthYear - 1;
  }
  return currentYear - birthYear;
}

export const getExperienceYears = () => {
  const now = new Date();

  const startYear = 2025;
  const currentYear = now.getFullYear();

  // GMT
  const currentStartDay = new Date(`${currentYear}-03-31T15:00:00.000Z`);

  if (currentStartDay.getTime() > now.getTime()) {
    const diff = currentYear - startYear - 1;
    return diff < 0 ? 0 : diff;
  }
  const diff = currentYear - startYear;
  return diff < 0 ? 0 : diff;
}