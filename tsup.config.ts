import path from "path";
import fs from "fs/promises";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  dts: true,
  treeshake: true,
  format: "esm",
  // clean: true,
  minify: true,
  shims: true,
  external: ["react", "react-dom", /^\.\/assets\//, /^\.\/main\.css/],
  esbuildPlugins: [
    {
      name: "exc",
      setup(build) {
        build.onLoad({ filter: /\.(jsx|tsx)$/ }, async (args) => {
          if (path.matchesGlob(args.path, "exports/static.ts")) return;

          let contents = await fs.readFile(args.path);
          if (!contents.includes(".css")) return;
          return {
            contents: contents
              .toString()
              .replace(/import ?("|')?\.\/assets\/styles?\.css("|')?;?/, ""),
            loader: "tsx",
          };
        });
      },
    },
  ],
});
