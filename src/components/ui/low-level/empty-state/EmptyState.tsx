import { BasicDiv, BasicSpan } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicDivProps } from "../html/div/BasicDiv";
import { createContext, useContext } from "react";
import { HtmlElementDim } from "../html/BasicStyle";

const FadeContext = createContext<{ fade: BasicDivProps["fade"] }>(null);

function Root(props: EmptyStateProps.RootProps) {
  return (
    <FadeContext
      value={props.itemFade ? { fade: props.itemFade } : { fade: 0.5 }}
    >
      <BasicDiv
        size="full"
        centerContent
        gap={props.gap || "lg"}
        pos={props.pos}
      >
        {props.children}
      </BasicDiv>
    </FadeContext>
  );
}

function Indicator(props: EmptyStateProps.IndicatorProps) {
  const { fade } = useContext(FadeContext);
  return (
    <BasicDiv fade={props.disableFade ? 1 : fade} size={props.size || "4rem"}>
      {props.element}
    </BasicDiv>
  );
}

function Content(props: EmptyStateProps.ContentProps) {
  const { fade } = useContext(FadeContext);
  return (
    <BasicDiv align="center" gap={props.gap || "sm"}>
      <BasicSpan
        fontWeight="bold"
        fontSize={props.titleFontSize || "lg"}
        text={props.title}
      />
      <BasicSpan
        fade={fade}
        fontSize={props.descriptionFontSize}
        text={props.description}
      />
    </BasicDiv>
  );
}

declare namespace EmptyStateProps {
  interface RootProps {
    pos?: BasicDivProps["pos"];
    gap?: BasicDivProps["gap"];
    itemFade?: BasicDivProps["fade"];
    children: JSX.Element | JSX.Element[];
  }
  interface IndicatorProps {
    size?: HtmlElementDim;
    element: JSX.Element;
    disableFade?: boolean;
  }
  interface ContentProps
    extends Partial<
      Record<`${"title" | "description"}FontSize`, BasicDivProps["fontSize"]>
    > {
    title: string;
    description: string;
    gap?: BasicDivProps["gap"];
  }
}

const EmptyState = { Root, Indicator, Content };

export default EmptyState;
export type { EmptyStateProps };
