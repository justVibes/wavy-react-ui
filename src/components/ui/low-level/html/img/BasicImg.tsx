import { resolveBasicColor } from "@/css/helper-functions/CssHelperFunctions";
import applyBasicStyle, { BasicColor, BasicStyleProps } from "../BasicStyle";
import StyledElement, { InlineCss } from "../StyledElements";
import {
  applyCoreHTMLProps,
  BasicHtmlElementCoreProps,
} from "../BasicHtmlElementCore";

interface BasicImgProps
  extends BasicStyleProps,
    BasicHtmlElementCoreProps<HTMLImageElement> {
  src: string;
  alt?: string;
  fill?: boolean;
  cover?: boolean;
  noFit?: boolean;
  scaleDown?: boolean;
  tint?: BasicColor;
  sx?: InlineCss;
}

/**
 *
 *
 * @returns A modded version of the <img/> html tag.
 */
function BasicImg(props: BasicImgProps) {
  const hasTint = Boolean(props.tint);

  const StyledImg = StyledElement.img(props.sx);
  return (
    <StyledImg
      {...applyCoreHTMLProps(props)}
      loading="lazy"
      decoding="async"
      fetchPriority="high"
      src={props.src}
      alt={props.alt}
      style={{
        ...applyBasicStyle(props),
        filter: hasTint
          ? `drop-shadow(0px 1000px 0 ${resolveBasicColor(props.tint)})`
          : undefined,
        transform: hasTint && "translateY(-1000px)",
        objectFit: props.noFit
          ? "none"
          : props.fill
          ? "fill"
          : props.cover
          ? "cover"
          : props.scaleDown
          ? "scale-down"
          : "contain",
      }}
    />
  );
}

export default BasicImg;
