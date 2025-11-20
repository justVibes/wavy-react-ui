import { applyBasicStyle, BasicHtmlElementStyleProps } from "@/main";
import type { SafeOmit } from "@wavy/types";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/server";

interface ComputedStyleProps
  extends SafeOmit<BasicHtmlElementStyleProps, "className"> {
  children?: React.ReactNode;
}

function useComputedStyle(
  elementTag: keyof HTMLElementTagNameMap,
  props: ComputedStyleProps,
  options?: Partial<{ log: boolean }>
) {
  const [style, setStyle] = useState<{ [key: string]: string }>({});
  const basicStyle = applyBasicStyle(props);
  const root = document.getElementById("root") ?? document.body;

  useEffect(() => {
    if (options?.log)
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

export default useComputedStyle;
export type { ComputedStyleProps };

