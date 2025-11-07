#!/usr/bin/env node
import { upperFirst } from "@wavy/fn";
import { __root } from "./utils";

const alphaSep = "__";
const decimalDivisor = 1_000;
function hexToRgba(hex: string, alpha = 1) {
  // Remove '#' if present
  let hexValue = hex.startsWith("#") ? hex.slice(1) : hex;

  // Handle 3-digit hex codes
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Extract R, G, B components and convert to decimal
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  // Return the RGBA string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function themeKeyVariants(key: string) {
  return [
    ...Array.from(Array(9)).flatMap((_, i) => {
      const nonZeroIndex = i + 1;
      return [`${nonZeroIndex}00`, `${nonZeroIndex}50`].map(
        (alpha) => `${key}${alphaSep}${alpha}`
      );
    }),
    key,
  ];
}
function toCssVar(value: string, options?: Partial<{ wrap: boolean }>) {
  const toKebab = (camel: string) => {
    return camel
      .split("")
      .map((char) =>
        char === char.toUpperCase() && char !== char.toLowerCase()
          ? `-${char.toLowerCase()}`
          : char
      )
      .join("");
  };
  const variable = `--${toKebab(value)}`;

  return options?.wrap ? `var(${variable})` : variable;
}

function getEntries(
  seed: string,
  theme: { [key: string]: string },
  options?: Partial<{ excludeSeed: boolean }>
) {
  const entries = Object.entries(theme);
  if (!options?.excludeSeed) entries.push(["seed", seed]);

  return entries;
}

function toCssRef(...args: Parameters<typeof getEntries>) {
  const mappedTheme = getEntries(...args)
    .map(([key]) => {
      return themeKeyVariants(key).map((fmtKey) => {
        const { 1: alpha } = fmtKey.split(alphaSep);
        let extractedAlpha = "";
        if (alpha) {
          extractedAlpha = `[${parseInt(alpha) / decimalDivisor}]`;
        }

        return `"${key}${extractedAlpha}": "${toCssVar(fmtKey, {
          wrap: true,
        })}"`;
      });
    })
    .flat();

  const name = "CssColors";
  return {
    filename: name + ".ts",
    content: `
    const ${name} = Object.freeze({
      ${mappedTheme.join(",\n")}  
    })

    export default ${name}
  `,
  };
}

function toCss(
  seed: string,
  theme: Record<"light" | "dark", { [key: string]: string }>,
  inject?: () => string
) {
  const mapper = (scheme: { [key: string]: string }, excludeSeed = false) => {
    return getEntries(seed, scheme, { excludeSeed })
      .map(([key, value]) => {
        return themeKeyVariants(key).map((fmtKey) => {
          const appendedValue = parseFloat(fmtKey.replace(/[^0\.0-9]/g, ""));
          const alpha = appendedValue ? appendedValue / decimalDivisor : 1;

          return `${toCssVar(fmtKey)}: ${hexToRgba(value, alpha)}`;
        });
      })
      .flat()
      .join(";\n");
  };

  return `
    @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

    :root {
      color-scheme: light dark;

      ${mapper(theme.light)}
    }

    *,
    *::before,
    *::after {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: inherit;
    }

    body {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--surface);
      color: var(--on-surface);
      scrollbar-color: var(--on-surface__750) transparent;
    }

    #root {
      --size: 100%;
      height: var(--size);
      width: var(--size);
      overflow: hidden;
    }

    ${inject?.() || ""}

    @media (prefers-color-scheme: dark){
      :root {
        ${mapper(theme.dark, true)}
      }
    }
  `
    .replace(/\s+/g, " ")
    .trim();
}

function toCssNew(
  seed: string,
  themes: Record<"light" | "dark", { [key: string]: string }>,
  inject?: () => string
) {
  const cssVariables = (colorName: string, colorCode?: string) => {
    const lightColor = themes.light[colorName] || colorCode,
      darkColor = themes.dark[colorName] || colorCode;

    return themeKeyVariants(colorName).map((colorVariant) => {
      const varName = toCssVar(colorVariant);
      const highLevelAlpha = parseFloat(colorVariant.replace(/[^0\.0-9]/g, ""));
      const alpha = highLevelAlpha ? highLevelAlpha / decimalDivisor : 1;
      const light = hexToRgba(lightColor, alpha);
      const dark = hexToRgba(darkColor, alpha);

      return `${varName}: light-dark(${light}, ${dark})`;
    });
  };
  const colorPalette = getEntries(seed, themes.light)
    .map(([key, value]) => cssVariables(key, value))
    .flat()
    .join(";");

  return `
    @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

    :root {
      color-scheme: light dark;

      ${colorPalette}
    }

    *,
    *::before,
    *::after {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: inherit;
    }

    body {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background-color: var(--surface);
      color: var(--on-surface);
      scrollbar-color: var(--on-surface__750) transparent;
      scrollbar-gutter: stable;
    }

    #root {
      --size: 100%;
      height: var(--size);
      width: var(--size);
      overflow: hidden;
    }

    ${inject?.() || ""}
`
    .replace(/\s+/g, " ")
    .trim();
}

async function buildTheme(
  options?: Partial<{
    flag: string;
    loadCssRefInLocalPackage: boolean;
    injectStyles: () => string;
  }>
) {
  const fs = await import("fs/promises");
  const path = await import("path");
  const { styles } = JSON.parse(
    (await fs.readFile(path.join(__root, "package.json"))).toString("utf-8")
  );

  try {
    // Directories
    const themesDir = path.join(__root, "./external/themes");
    const cssDir = path.join(__root, "./src/css");

    const themeFiles = await fs.readdir(themesDir);
    const acceptedThemes = themeFiles.map(
      (filename) => "--" + filename.match(/.*?(?=\.)/)?.[0]
    );
    const flags = process.argv.splice(2);
    const selectedFlag =
      options?.flag || flags.find((flag) => acceptedThemes.includes(flag));

    if (!selectedFlag) {
      return console.log(
        `Please select a theme using one of these flags: [${acceptedThemes.join(
          ", "
        )}]`
      );
    }

    const selectedTheme = themeFiles.find((filename) =>
      filename.includes(selectedFlag.replace(/[^a-zA-Z]/g, ""))
    );

    if (!selectedTheme) {
      return console.log(
        `Failed to map ${selectedFlag} to a filename in [${themeFiles.join(
          ", "
        )}].`
      );
    }

    const themeAsBuffer = await fs.readFile(
      path.join(themesDir, selectedTheme)
    );
    const { schemes, seed } = JSON.parse(themeAsBuffer.toString("utf-8"));
    const { dark, light } = schemes;

    light.themelessSurface = "#FFF";
    light.themelessOnSurface = "#000";

    dark.themelessSurface = "#000";
    dark.themelessOnSurface = "#FFF";

    const { filename, content } = toCssRef(seed, light);

    if (options?.loadCssRefInLocalPackage) {
      // Load the Css Ref in the local package
      await fs.writeFile(path.join(cssDir, "resources", filename), content);
    }

    // Load the themes in the dist folder
    await fs.writeFile(
      path.join(__root, styles),
      toCssNew(seed, { light, dark }, options?.injectStyles)
    );

    const themeEmojiMapper = {
      green: "🟩",
      purple: "🟪",
    };
    const theme = selectedFlag.toLowerCase().replace(/[^a-z]/g, "");
    console.log(
      `${
        themeEmojiMapper[theme as keyof typeof themeEmojiMapper] || ""
      } ${upperFirst(theme)} theme loaded! ✨`.trim()
    );
  } catch (error) {
    console.error(error);
  }
}

export { buildTheme as buildWavyTheme };
