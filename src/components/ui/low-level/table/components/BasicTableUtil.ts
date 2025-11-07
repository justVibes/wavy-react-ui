import { JSX } from "@emotion/react/jsx-runtime";
import type * as CSS from "csstype";

type ColumnAlign = "start" | "center" | "end";
type BasicTableColumnDef<ColName extends string> = Record<
  ColName,
  {
    align: ColumnAlign;
    format?: (value: string) => string;
  } & ({ weight: number } | { width: string })
>;

type BasicTableDataType<ColName extends string> = Record<
  ColName,
  string | { render: (props: { editing: boolean }) => JSX.Element }
>;

// This is just used to help with type safety when adding to the invalidCssKeys
type CssKeys = (keyof CSS.Properties)[];
const invalidCssKeys = [
  "alignItems",
  "alignContent",
  "justifyContent",
  "justifyItems",
  "gridArea",
  "gridAutoColumns",
  "gridTemplateColumns",
  "gap",
  "width",
  "padding",
  "alignSelf",
  "justifySelf",
] as const;

type BasicTableStyle = Omit<CSS.Properties, (typeof invalidCssKeys)[number]>;

const buildBasicTableColumn = <ColName extends string>(
  name: ColName,
  weight: number,
  align: ColumnAlign
) => ({ [name as ColName]: { weight, align } });

export type {
  ColumnAlign,
  BasicTableColumnDef,
  BasicTableDataType,
  BasicTableStyle,
};
export { buildBasicTableColumn };
