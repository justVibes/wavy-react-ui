import { BasicDiv } from "@/main";
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
      spill={"hidden"}
      backgroundColor="paper"
      color="onPaper"
      style={{
        ...getPaperDim(props.size, { responsive: props.responsive }),
        ...props.style,
      }}
    >
      {props.children}
    </BasicDiv>
  );
}

const getPaperDim = (
  size: PaperProps["size"],
  options = {
    /**Allows the paper's dimensions to be adaptable to different container sizes.
     * @default true */
    responsive: true,
  }
) => {
  return {
    A4: {},
    A6: options.responsive
      ? { maxHeight: "148mm", height: "60vh", aspectRatio: "1/sqrt(2)" }
      : { height: "148mm", width: "105mm" },
  }[size];
};

export { Paper, type PaperProps, getPaperDim };
