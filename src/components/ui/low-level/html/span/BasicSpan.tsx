import {
  ellipsis,
  restrictLineCount,
} from "@/css/helper-functions/CssHelperFunctions";
import { strictArray } from "@wavy/fn";
import CSS from "csstype";
import {
  applyCoreHTMLProps,
  BasicHtmlElementCoreProps,
} from "../BasicHtmlElementCore";
import applyBasicStyle, { BasicStyleProps } from "../BasicStyle";
import StyledElement, { InlineCss } from "../StyledElements";
import { TextAlign } from "./types/BasicSpanTypes";

interface BasicSpanProps
  extends BasicStyleProps,
    BasicHtmlElementCoreProps<HTMLSpanElement> {
  text?: string;
  link?: boolean;
  fakeHyperlink?: boolean;
  hyperlink?: boolean;
  lineLimit?: number;
  italic?: boolean;
  strikeThrough?: boolean;
  underline?: boolean;
  textAlign?: TextAlign;
  ellipsis?: boolean;
  clickable?: boolean;
  sx?: InlineCss;
  children?: React.ReactNode;
}
function BasicSpan(props: BasicSpanProps) {
  const getStyleWrapper = (style: CSS.Properties) => {
    if (props.ellipsis) return ellipsis(style);
    else if (props.lineLimit) return restrictLineCount(props.lineLimit, style);
    return style;
  };

  const getTextDecoration = () => {
    return strictArray([
      props.underline || props.link || props.fakeHyperlink || props.hyperlink
        ? "underline"
        : undefined,
      props.strikeThrough ? "line-through" : undefined,
    ])
      .join(" ")
      .trim();
  };

  const basicStyle = applyBasicStyle({
    ...props,
    color: props.fakeHyperlink || props.hyperlink ? "hyperlink" : props.color,
    cursor:
      props.link || props.hyperlink || props.clickable
        ? "pointer"
        : props.cursor,
  });
  const StyledSpan = StyledElement.span(props.sx);

  return (
    <StyledSpan
      {...applyCoreHTMLProps(props)}
      ref={props.ref}
      style={getStyleWrapper({
        ...basicStyle,
        width: props.ellipsis ? "100%" : basicStyle.width,
        textAlign: basicStyle.textAlign || props.textAlign || "justify",
        fontStyle: basicStyle.fontStyle || props.italic ? "italic" : undefined,
        textDecoration: basicStyle.textDecoration ||  getTextDecoration() || undefined,
      })}
    >
      {props.text || props.children}
    </StyledSpan>
  );
}

export default BasicSpan;
export type { BasicSpanProps };
