import { applyBasicStyle, BasicStyleProps } from "@/main";
import type { SafeOmit } from "@wavy/types";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/server";
import * as CSS from "csstype";

interface ComputedStyleProps extends SafeOmit<BasicStyleProps, "className"> {
  children?: React.ReactNode;
}

function useComputedStyle(
  elementTag: keyof HTMLElementTagNameMap,
  props: ComputedStyleProps,
  options?: Partial<{ debug: boolean; inject: () => CSS.Properties }>
) {
  const [style, setStyle] = useState<{ [key: string]: string }>({});
  let basicStyle = applyBasicStyle(props);
  basicStyle = { ...basicStyle, ...(options?.inject?.() || {}) };

  const root = document.getElementById("root") ?? document.body;

  useEffect(() => {
    if (options?.debug)
      console.log({
        elementTag,
        props,
        style,
        timestamp: new Date().toLocaleTimeString(),
      });
  }, [style]);

  useEffect(() => {
    const tempElement = document.createElement(elementTag);

    // Convert children to nodes
    const childrenAsArray = Array.isArray(props.children)
      ? props.children
      : [props.children];
    const childrenAsNodes = childrenAsArray.map((child) => {
      const element = document.createElement(elementTag);
      element.innerHTML = ReactDOM.renderToStaticMarkup(child);

      return element;
    });

    // Create clone by mapping properties
    Object.assign(tempElement.style, { ...basicStyle, visibility: "hidden" });
    childrenAsNodes.forEach((node) => tempElement.appendChild(node));

    // Append child to the document so that it can be styled?
    root.appendChild(tempElement);

    // Extract style
    const computedStyle = getComputedStyle(tempElement);
    const styleEntries = Object.keys(basicStyle)
      .filter(
        (key) =>
          key in computedStyle && typeof computedStyle[key as any] === "string"
      )
      .map((key) => {
        const validKey = key as keyof typeof computedStyle;
        const value = computedStyle[validKey] as string | 0;
        return [
          key,
          key === "opacity" ? value.toString() : value === 0 ? "0px" : value,
        ] as const;
      });
    setStyle(Object.fromEntries(styleEntries));
    root.removeChild(tempElement);
  }, [props]);

  return { style };
}

export { useComputedStyle, type ComputedStyleProps };
