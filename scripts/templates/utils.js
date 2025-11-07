import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);
export const __root = __dirname
  .split(path.sep)
  .filter((_, i, arr) => i < arr.length - 2)
  .join(path.sep);
