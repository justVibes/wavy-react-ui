import { BasicDiv } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import * as CSS from "csstype";

// Move this to the Ui library

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
  const responsive = props.responsive ?? true;
  const dim = {
    A4: {},
    A6: responsive
      ? { maxHeight: "148mm", height: "60vh", aspectRatio: "1/sqrt(2)" }
      : { height: "148mm", width: "105mm" },
  }[props.size];

  return (
    <BasicDiv
      id={props.id}
      spill={"hidden"}
      backgroundColor="paper"
      color="onPaper"
      style={{
        ...dim,
        ...props.style,
      }}
    >
      {props.children}
    </BasicDiv>
  );
}

export { Paper, type PaperProps };
