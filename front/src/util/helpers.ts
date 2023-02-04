type IndexSignature = string | number | symbol;

export const addQuery = (query: string, params: {
  [key:IndexSignature]:string | number; }): string => {
  query += '?';
  Object.keys(params).forEach((key): void => {
    query += `&${key}=${params[key]}`;
  });
  return query;
};
