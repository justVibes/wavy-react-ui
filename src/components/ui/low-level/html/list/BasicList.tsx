import { JSX } from "@emotion/react/jsx-runtime";
import * as CSS from "csstype";
import applyBasicStyle from "../BasicStyle";
import { BasicDivProps } from "../div/BasicDiv";
import { lastIndex } from "@wavy/fn";

interface BasicListProps {
  type?: "ol" | "ul";
  color?: BasicDivProps["color"];
  fontSize?: string;
  disableLeftMargin?: boolean;
  gap?: string;
  fade?: number;
  items: (string | { render: () => JSX.Element })[];
}
function BasicList(props: BasicListProps) {
  const type: BasicListProps["type"] = props.type ?? "ol";

  const ListWrapper = (props: {
    style: CSS.Properties;
    children: JSX.Element[];
  }) => {
    if (type === "ol") return <ol style={props.style}>{props.children}</ol>;
    return <ul style={props.style}>{props.children}</ul>;
  };

  const basicStyle = applyBasicStyle({ color: props.color });
  return (
    <ListWrapper
      style={{
        color: basicStyle.color,
        fontSize: props.fontSize,
        paddingLeft: props.disableLeftMargin ? undefined : "1rem",
        opacity: props.fade,
      }}
    >
      {props.items.map((item, i) => (
        <li
          key={i}
          style={{
            width: "100%",
            paddingBottom: props.gap
              ? i === lastIndex(props.items)
                ? undefined
                : props.gap
              : undefined,
          }}
        >
          {typeof item === "string" ? (
            <span children={item} />
          ) : (
            <item.render />
          )}
        </li>
      ))}
    </ListWrapper>
  );
}

export default BasicList;
