import { writeFile } from 'fs/promises';

export const saveToFile = (file: string, data: string | Buffer) => {
  return writeFile(file, data);
};
