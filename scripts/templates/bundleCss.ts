#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { __root } from "./utils";
import { buildWavyTheme } from "./buildTheme";

const resolvePath = (pathnames: string[], parent: string) =>
  pathnames.map((pathname) => path.join(parent, pathname));

const getDirs = (items: string[], parent?: string) => {
  const dirs = items.filter((item) => !path.extname(item));

  return parent ? resolvePath(dirs, parent) : dirs;
};

const getCssFiles = (items: string[], parent?: string) => {
  const files = items.filter((item) => item.includes(".css"));
  return parent ? resolvePath(files, parent) : files;
};

async function bundle(dirPathname: string) {
  const resolvePath = (pathname: string) => path.join(dirPathname, pathname);

  console.log("🤖 Preparing CSS file scan...");
  let items = await fs.readdir(dirPathname),
    folders = getDirs(items, dirPathname),
    cssFiles = getCssFiles(items, dirPathname);

  try {
    for (const folder of folders) {
      items = await fs.readdir(folder);
      folders.push(...getDirs(items, folder));
      cssFiles.push(...getCssFiles(items, folder));
    }
  } catch (error) {
    console.log("Failed to resolve the items found: ", {
      folders,
      cssFiles,
      items,
    });
    throw error;
  }

  console.log("⚡ CSS file scan complete!");

  if (cssFiles.length === 0) {
    console.log("0 CSS files found...", "\nAborting bundler...");
  } else {
    console.log("🤖 Resolving file contents...");
    cssFiles = await Promise.all(
      cssFiles.map(async (path) => {
        const contents = await fs.readFile(path);
        return contents.toString("utf-8").trim();
      })
    );
    console.log("⚡ File contents resolved!", "\n🤖 Preparing bundler...");
    await buildWavyTheme({
      injectStyles: () => cssFiles.join(" "),
    });
    console.log("✨ Successfully bundled css files! ✨");
  }
}

bundle(path.join(__root, "src"));
