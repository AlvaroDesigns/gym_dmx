type QueryKeyPart = string | number | boolean | null | undefined;

export const generateQueryKey = (...parts: QueryKeyPart[]) =>
  parts.filter((part) => part !== null && part !== undefined);
