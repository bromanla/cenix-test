export const formatter = (data: Record<string, string | number>) =>
  Object.keys(data).reduce(
    (acc, el) => (data[el] ? acc + `${el}=${data[el]}\n` : acc),
    '',
  );
