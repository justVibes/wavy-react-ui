import { BasicDiv, BasicSpan } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicDivProps } from "../html/div/BasicDiv";
import { createContext, useContext } from "react";
import { ElementDim } from "../html/BasicStyle";
import { BasicSpanProps } from "../html/span/BasicSpan";

const FadeContext = createContext<{ fade: BasicDivProps["fade"] }>(null);

function Root(props: EmptyStateProps.RootProps) {
  return (
    <FadeContext
      value={props.itemFade ? { fade: props.itemFade } : { fade: 0.5 }}
    >
      <BasicDiv
        {...props}
        size={props.size ?? "full"}
        centerContent={props.centerContent ?? true}
        gap={props.gap || "lg"}
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
  interface RootProps extends BasicDivProps {
    /**@default "lg" */
    gap?: BasicDivProps["gap"];
    /**@default "full" */
    size?: BasicDivProps["size"];
    /**@default true */
    centerContent?: BasicDivProps["centerContent"];
    itemFade?: BasicDivProps["fade"];
    children: JSX.Element | JSX.Element[];
  }
  interface IndicatorProps {
    /**@default "4rem" */
    size?: ElementDim;
    element: JSX.Element;
    disableFade?: boolean;
  }
  interface ContentProps {
    /**@default "lg" */
    titleFontSize?: BasicSpanProps["fontSize"];
    descriptionFontSize?: BasicSpanProps["fontSize"];
    title: string;
    description: string;
    /**@default "sm" */
    gap?: BasicDivProps["gap"];
  }
}

const EmptyState = { Root, Indicator, Content };

export { EmptyState, type EmptyStateProps };
