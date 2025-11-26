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
  const { height, width } = getPaperDim(props.size);
  const responsive = props.responsive ?? true;

  const zoom = {
    a4: 95,
    a6: 80,
  }[props.size.toLowerCase()];

  return (
    <BasicDiv
      id={props.id}
      spill={"hidden"}
      backgroundColor="paper"
      color="onPaper"
      style={{
        // ...getPaperDim(props.size, { responsive: props.responsive ?? true }),
        ...props.style,
        maxHeight: height,
        height: responsive ? `${zoom}%` : height,
        width: responsive ? undefined : width,
        aspectRatio: "1/sqrt(2)",
      }}
    >
      {props.children}
    </BasicDiv>
  );
}

const getPaperDim = (
  size: PaperProps["size"]
  // options = {
  //   /**Allows the paper's dimensions to be adaptable to different container sizes.
  //    * @default true */
  //   responsive: true,
  // }
) => {
  return {
    a4: { height: "297mm", width: "210mm" },
    a6: { height: "148mm", width: "105mm" },

    // options.responsive ?? true
    //   ? { maxHeight: "148mm", height: "60vh", aspectRatio: "1/sqrt(2)" }
    //   : ,
  }[size.toLowerCase()];
};

export { Paper, type PaperProps, getPaperDim };
