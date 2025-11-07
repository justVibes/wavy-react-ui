import { ColorResources } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import BasicSpan from "../../low-level/html/span/BasicSpan";

interface JsonViewerProps {
  fullSize?: boolean;
  height?: BasicDivProps["height"];
  width?: BasicDivProps["width"];
  json: string | undefined;
}
function JsonViewer(props: JsonViewerProps) {
  const json = props.json ? JSON.parse(props.json) : undefined;

  return (
    <BasicDiv
      size={props.fullSize ? "full" : undefined}
      height={props.height || "25rem"}
      width={props.width || "35rem"}
      pos="relative"
      centerContent={!props.json}
      padding={"lg"}
      corners={"md"}
      borderColor={"outlineVariant[0.25]"}
      style={{
        overflow: "auto",
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255, .1) 1px, transparent 0)`,
        backgroundSize: "20px 20px",
      }}
    >
      {!props.json ? (
        <EmptyScreen />
      ) : (
        <pre style={{ width: "100%" }}>
          <code>
            <Json value={json} />
          </code>
        </pre>
      )}
    </BasicDiv>
  );
}

function EmptyScreen() {
  const Bracket = (props: { value: string }) => (
    <BasicSpan fontSize="2rem" color={"jsonBracket"} text={props.value} />
  );
  return (
    <BasicDiv centerContent corners={"md"} gap={"md"} padding={"xl"}>
      <pre>
        <code>
          <span style={{ fontSize: "1.5rem" }}>
            <Bracket value="{ " />
            <BasicSpan color={"jsonKey"} text={`\"JSON\"`} />
            {":"}
            <BasicSpan color={"string"} text={`\"Viewer\"`} />
            <Bracket value=" }" />
          </span>
        </code>
      </pre>
    </BasicDiv>
  );
}

type Primitive = string | number | boolean;
const primitives = ["string", "number", "boolean"];
function Primitive(props: { value: Primitive }) {
  const colorKey: keyof typeof ColorResources = (() => {
    const type = typeof props.value;
    if (type === "string") return "string";
    if (type === "number") return "number";
    if (type === "boolean") return "boolean";
  })();

  return (
    <BasicSpan
      color={colorKey}
      text={
        typeof props.value === "string"
          ? `\"${props.value}\"`
          : `${props.value}`
      }
    />
  );
}

function Collection(props: {
  value: (Primitive | Primitive[] | object | object[])[];
}) {
  return (
    <>
      <BasicSpan width="full" color={"arrayBracket"} text="[" />
      {props.value.map((data, i) => {
        const Wrapper = (properties: { children: JSX.Element }) => {
          const indented = props.value.some((v) => typeof v === "object");
          // const indented = false;
          return (
            <>
              {indented && <br />}
              {properties.children}
              {i === props.value.length - 1 ? "" : ", "}
              {indented && i === props.value.length - 1 && <br />}
            </>
          );
        };

        return (
          <Wrapper>
            {(() => {
              if (typeof data === "object")
                return <Json indent indentInitialBracket value={data as any} />;
              if (Array.isArray(data)) return <Collection value={data} />;
              return <Primitive value={data} />;
            })()}
          </Wrapper>
        );
      })}
      <BasicSpan color={"arrayBracket"} text="]" />
    </>
  );
}

function Json(props: {
  value: { [k: string | number]: Primitive | Primitive[] | object };
  indent?: boolean;
  indentInitialBracket?: boolean;
  indentMultiplier?: number;
}) {
  const defaultIndent = "1rem";

  const indentMultiplier = props.indentMultiplier || 2;
  const childrenIndent = props.indent
    ? `calc(${defaultIndent} * ${indentMultiplier})`
    : defaultIndent;
  const bracketIndent = `calc(${childrenIndent} / ${indentMultiplier})`;
  return (
    <>
      <BasicSpan
        style={{
          paddingLeft: props.indentInitialBracket ? bracketIndent : undefined,
        }}
        color={"jsonBracket"}
        text="{"
      />
      <br />
      {Object.keys(props.value).map((key, i, arr) => {
        const validKey = key as keyof typeof props.value;
        const value = props.value[validKey];

        const Content = () => {
          if (primitives.includes(typeof value)) {
            return <Primitive value={value as Primitive} />;
          }
          if (Array.isArray(value)) return <Collection value={value} />;
          if (typeof value === "object") {
            return <Json indent value={value as any} />;
          }
          return <Primitive value={`${value}`} />;
        };

        return (
          <span
            style={{
              paddingLeft: childrenIndent,
              width: "100%",
            }}
          >
            <BasicSpan color={"jsonKey"} text={`\"${validKey}\"`} />
            {" : "}
            <Content />
            {i === arr.length - 1 ? "" : ","}
            <br />
          </span>
        );
      })}
      <BasicSpan
        style={{ paddingLeft: props.indent ? bracketIndent : undefined }}
        color={"jsonBracket"}
        text="}"
      />
    </>
  );
}
export default JsonViewer;
