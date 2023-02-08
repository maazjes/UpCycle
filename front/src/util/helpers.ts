type IndexSignature = string | number | symbol;

export const addParams = (query: string, params: {
  [key:IndexSignature]:string | number; }): string => {
  Object.keys(params).forEach((key, i): void => {
    if (i === 0) {
      query += `?${key}=${params[key]}`;
    } else {
      query += `&${key}=${params[key]}`;
    }
  });
  return query;
};
