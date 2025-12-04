import { BasicDiv, resolveBasicColor } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import * as CSS from "csstype";

interface PaperProps {
  size: "A4" | "A6";
  /** Allows the paper's dimensions to be adaptable to different container sizes.
   * @default true */
  responsive?: boolean;
  children: JSX.Element | JSX.Element[];
  style?: CSS.Properties;
  id?: string;
}
function Paper(props: PaperProps) {
  return (
    <BasicDiv
      id={props.id}
      style={paperStyle({
        size: props.size,
        responsive: props.responsive,
        style: props.style,
      })}
    >
      {props.children}
    </BasicDiv>
  );
}

const getPaperDim = (size: PaperProps["size"]) => {
  return {
    a4: { height: "297mm", width: "210mm" },
    a6: { height: "148mm", width: "105mm" },
  }[size.toLowerCase()];
};

const paperStyle = (options: {
  size: PaperProps["size"];
  /**Whether the dimensions of the page should be responsive or not.
   * @default true */
  responsive?: boolean;
  style?: CSS.Properties;
}): CSS.Properties => {
  const { height, width } = getPaperDim(options.size);
  const zoom = {
    a4: 95,
    a6: 80,
  }[options.size.toLowerCase()];
  const responsive = options.responsive ?? true;

  return {
    ...(options?.style || {}),
    maxHeight: height,
    height: responsive ? `${zoom}%` : height,
    width: responsive ? undefined : width,
    aspectRatio: "1/sqrt(2)",
    backgroundColor: resolveBasicColor("paper"),
    color: resolveBasicColor("onPaper"),
    overflow: "hidden",
  };
};

export { Paper, type PaperProps, getPaperDim, paperStyle };
