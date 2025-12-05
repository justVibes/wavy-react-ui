import { BasicDiv, BasicSpan, Checkbox } from "@/main";
import { camelCaseToLetter, distinct, lastIndex, run } from "@wavy/fn";
import type { SafeOmit } from "@wavy/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type JSX,
} from "react";
import applyBasicStyle, { BasicColor, BasicStyleProps } from "../BasicStyle";
import { BasicDivProps } from "../div/BasicDiv";
import { TableColumnConfig } from "./components/types";
import * as CSS from "csstype";

const SEP_WIDTH = "1px";
const WIDTH_BUFFER = 7

const Context = createContext<
  | (Pick<
      BasicTableProps.RootProps<string>,
      "columns" | "entries" | "columnGap" | "rowGap" | "selectable"
    > &
      SafeOmit<RootStyles, "gap"> & {
        gridCols: string;
        allRowsSelected: boolean;
        selectedRowIndices: number[];
        onSelectAllRowsClick: () => void;
        onSelectRowClick: (index: number) => void;
        onColWidthsComputed: (widthMap: Map<string, number>) => void;
        slotProps?: BasicTableProps.RootProps<string>["slotProps"];
      })
  | null
>(null);

type RootStyles = {
  gap?: BasicStyleProps["gap"];
  rowGap?: BasicStyleProps["gap"];
  /**@default "onSurface[0.25]" */
  separatorColor?: SepProps["color"];
  /**@default "lg" */
  columnGap?: BasicStyleProps["gap"];
  /**@default "sm" */
  padding?: BasicStyleProps["padding"];
  corners?: BasicDivProps["corners"];
  spill?: BasicDivProps["spill"];
  fontSize?: BasicDivProps["fontSize"];
  fontWeight?: BasicDivProps["fontWeight"];
  defaultSelectedRows?: number[];
  selectedRows?: number[];
  onSelectedRowsChange?: (selectedRows: number[]) => void;
  slotProps?: Partial<{
    selectColumn?: Partial<{
      separatorColor: BasicColor;
      disableSeparator: boolean;
    }>;
  }>;
};

function Root<T extends string>(props: BasicTableProps.RootProps<T>) {
  const defaultWeight = props.defaultColumnWeight || "1fr";
  const separatorColor = ["none", 0].includes(props.separatorColor!)
    ? undefined
    : props.separatorColor ?? "onSurface[0.25]";

  const getGridCols = (columns: (TableColumnConfig | string)[]) => {
    const leadingColumn = props.selectable ? `auto ${SEP_WIDTH}` : "";
    return (
      leadingColumn +
      columns
        .map((col) =>
          typeof col === "string" || !col.weight ? defaultWeight : col.weight
        )
        .join(` ${SEP_WIDTH} `)
    );
  };

  const controlled = !!props.selectedRows;
  const [selectedRowIndices, setSelectedRowIndices] = useState<number[]>(
    props.defaultSelectedRows || []
  );
  const [gridCols, setGridCols] = useState(getGridCols(props.columns));

  const allRowsSelected =
    selectedRowIndices.length === props.entries.length &&
    props.entries.length > 0;

  const Children = (
    Array.isArray(props.children) ? props.children : [props.children]
  ).filter((_, i) => i < 2);

  const onSelectAllRowsClick = () => {
    let rows: number[] = [];

    if (!allRowsSelected) {
      rows = props.entries.map((_, i) => i);
    }

    props.onSelectedRowsChange?.(rows);
    if (!controlled) setSelectedRowIndices(rows);
  };
  const onSelectRowClick = (index: number) => {
    let rows: number[] = [...selectedRowIndices];

    if (rows.includes(index)) {
      rows = rows.filter((i) => i !== index);
    } else {
      rows.push(index);
    }

    props.onSelectedRowsChange?.(rows);
    if (!controlled) setSelectedRowIndices(rows);
  };

  const getColumns = () => {
    if (!props.defaultColumnWeight) return props.columns;
    return props.columns.map((col) => {
      const colConfig =
        typeof col === "object" ? col : ({} as TableColumnConfig);
      return {
        ...colConfig,
        name: getColName(col),
        weight:
          "weight" in colConfig ? colConfig.weight : props.defaultColumnWeight,
        textAlign:
          "textAlign" in colConfig
            ? colConfig.textAlign
            : props.textAlign || "start",
      };
    });
  };
  const colWidthMap = useRef<Map<string, number>>(null);
  const skipCompute = useRef(false);

  const handleSetWidthMap = (widthMap: Map<string, number>) => {
    if (Children.length === 1 || colWidthMap.current) {
      widthMap.forEach((value, key) => {
        if ((colWidthMap.current.get(key) || 0) < value) {
          colWidthMap.current.set(key, value);
        }
      });
      updateGridCols();
    } else {
      colWidthMap.current = widthMap;
    }
  };
  const updateGridCols = () => {
    if (skipCompute.current) {
      skipCompute.current = false;
      return;
    }

    const updatedColumns = props.columns.map(
      (col): TableColumnConfig | string => {
        const maxWidth = colWidthMap.current.get(getColName(col));

        if (maxWidth) {
          return { ...(col as any), weight: `${maxWidth}px` };
        }
        return col;
      }
    );
    skipCompute.current = true;
    colWidthMap.current = null;
    setGridCols(getGridCols(updatedColumns));
  };

  return (
    <Context.Provider
      value={{
        ...props,
        gridCols,
        selectedRowIndices: controlled
          ? props.selectedRows
          : selectedRowIndices,
        separatorColor,
        allRowsSelected,
        onSelectRowClick,
        onSelectAllRowsClick,
        columns: getColumns(),
        padding: props.padding ?? "sm",
        columnGap: props.columnGap ?? props.gap ?? "lg",
        rowGap: props.rowGap ?? props.gap,
        onColWidthsComputed: handleSetWidthMap,
      }}
    >
      <BasicDiv
        grid
        gridRows="auto auto"
        corners={props.corners}
        height={props.height}
        width={props.width}
        minHeight={props.minHeight}
        maxHeight={props.maxHeight}
        minWidth={props.minWidth}
        maxWidth={props.maxWidth}
        color={props.color}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        backgroundColor={props.backgroundColor}
        spill={props.spill}
        style={{ gridTemplateAreas: `"header" "body"` }}
      >
        {Children}
      </BasicDiv>
    </Context.Provider>
  );
}

function Header(props: BasicTableProps.HeaderProps) {
  const ctx = useContext(Context)!;
  const sepColor = props.separatorColor || ctx.separatorColor;
  let colWidthMap = useRef(new Map<string, number>());

  return (
    <BasicDiv
      grid
      gridCols={ctx.gridCols}
      gap={ctx.columnGap}
      borderColor={
        props.borderColor ||
        (sepColor !== 0 && sepColor !== "none"
          ? [sepColor, "bottom"]
          : undefined)
      }
      borderWidth={SEP_WIDTH}
      spill={"hidden"}
      padding={props.padding ?? ctx.padding}
      corners={props.corners ?? (ctx.separatorColor ? 0 : undefined)}
      color={props.color}
      backgroundColor={props.backgroundColor}
      fontWeight={props.fontWeight}
      fontSize={props.fontSize}
      align="center"
      width={"full"}
      style={{ gridArea: "header" }}
    >
      {ctx.selectable && (
        <Select
          selected={ctx.allRowsSelected}
          onClick={ctx.onSelectAllRowsClick}
        />
      )}
      {ctx.columns.map((col, i, arr) => {
        const colName = getColName(col);
        return (
          <>
            <BasicSpan
              key={colName + i}
              size={"full"}
              ref={(ref) => {
                if (ref) {
                  colWidthMap.current.set(
                    colName,
                    parseFloat(getComputedStyle(ref).width) + WIDTH_BUFFER
                  );

                  if (i === lastIndex(arr)) {
                    ctx.onColWidthsComputed(colWidthMap.current);
                  }
                }
              }}
              // borderColor={
              //   separatorColor && i !== lastIndex(ctx.columns)
              //     ? [separatorColor, "right"]
              //     : undefined
              // }
              text={
                !props.formatColumnName ||
                props.formatColumnName === "camelToLetter"
                  ? camelCaseToLetter(colName)
                  : props.formatColumnName?.(colName) ?? colName
              }
              style={{ flexGrow: 1, textAlign: getColProp("textAlign", col) }}
            />
            {i !== arr.length - 1 && <Sep color={props.separatorColor} />}
          </>
        );
      })}
    </BasicDiv>
  );
}

function Body<T extends string>(props: BasicTableProps.BodyProps<T>) {
  const ctx = useContext(Context)!;
  let columnWidthMap = useRef(new Map<string, number>());

  useEffect(() => {
    const cleanup = () => {
      columnWidthMap.current.clear();
    };

    return cleanup;
  }, []);

  return (
    <BasicDiv
      width={"full"}
      gap={ctx.rowGap}
      padding={props.padding ?? (ctx.rowGap ? [ctx.rowGap, "top"] : undefined)}
      color={props.color}
      fontSize={props.fontSize}
      style={{ paddingTop: ctx.rowGap, gridArea: "body" }}
    >
      {ctx.entries.map((entry, index) => {
        return (
          <Row
            key={index}
            rowData={entry}
            index={index}
            style={props.styleRow?.(index)}
            styleCell={props.styleCell}
            onColWidthComputed={(colName, width) => {
              const maxWidth = columnWidthMap.current.get(colName);
              if (!maxWidth || width > maxWidth) {
                columnWidthMap.current.set(colName, width);
              }
            }}
            onCellRendered={(colIdx) => {
              const isLastRow = index === lastIndex(ctx.entries);
              const isLastColumn = colIdx === lastIndex(ctx.columns);

              if (
                isLastRow &&
                isLastColumn &&
                columnWidthMap.current.size > 0
              ) {
                ctx.onColWidthsComputed(columnWidthMap.current);
              }
            }}
          />
        );
      })}
    </BasicDiv>
  );
}

function Row(props: {
  index: number;
  padding?: BasicDivProps["padding"];
  rowData: Record<string, string | React.ReactElement | undefined>;
  styleCell?: BasicTableProps.BodyProps<string>["styleCell"];
  style?: BasicDivProps["style"];
  onCellRendered: (colIdx: number) => void;
  onColWidthComputed: (colName: string, width: number) => void;
}) {
  const ctx = useContext(Context)!;
  const selected = ctx.selectedRowIndices.includes(props.index);

  const handleSelectClick = () => ctx.onSelectRowClick(props.index);

  const { gap, padding, backgroundColor } = applyBasicStyle({
    gap: ctx.columnGap,
    padding: ctx.padding ?? props.padding,
    backgroundColor: selected ? "onSurface[0.1]" : "transparent",
  });
  return (
    <BasicDiv
      style={{
        gap,
        padding,
        backgroundColor,
        width: "100%",
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: ctx.gridCols,
        ...props.style,
      }}
    >
      {ctx.selectable && (
        <Select selected={selected} onClick={handleSelectClick} />
      )}

      {ctx.columns.map((col, colIndex, arr) => {
        const colName = getColName(col);
        const cellData = props.rowData[colName];

        const placeholder =
          typeof col === "object" ? col?.placeholder : undefined;
        const handleOnRender = () => props.onCellRendered?.(colIndex);

        const key = colIndex + getColName(col);
        const textAlign = getColProp("textAlign", col);

        // console.log({ colName, textAlign });

        const cellStyle: CSS.Properties = {
          textAlign,
          justifyContent: textAlign,
          color: getColProp("color", col),
          opacity: getColProp("opacity", col, 1),
          backgroundColor: getColProp("backgroundColor", col),
          ...(props.styleCell?.({
            cellIndex: props.index * ctx.columns.length + colIndex,
            columnName: colName,
            columnIndex: colIndex,
            rowIndex: props.index,
            data: typeof cellData === "string" ? cellData : null,
            siblingData: {
              previous:
                colIndex === 0
                  ? null
                  : run(props.rowData[getColName(arr[colIndex - 1])], (v) =>
                      typeof v === "string" ? v : null
                    ),
              next:
                colIndex === arr.length - 1
                  ? null
                  : run(props.rowData[getColName(arr[colIndex + 1])], (v) =>
                      typeof v === "string" ? v : null
                    ),
            },
          }) || {}),
        };

        if (typeof col === "object" && col.weight === "auto") {
          return (
            <>
              <AutoCell
                key={key}
                data={cellData}
                style={cellStyle}
                onRender={handleOnRender}
                placeholder={placeholder}
                onWidthComputed={(w) => props.onColWidthComputed(colName, w)}
              />
              {colIndex !== arr.length - 1 && <Sep />}
            </>
          );
        }

        return (
          <>
            <Cell
              key={key}
              data={cellData}
              style={cellStyle}
              placeholder={placeholder}
              onRender={handleOnRender}
            />

            {colIndex !== arr.length - 1 && <Sep />}
          </>
        );
      })}
    </BasicDiv>
  );
}

function AutoCell(props: {
  data: CellProps["data"];
  placeholder?: string;
  style: BasicDivProps["style"];
  onRender?: () => void;
  onWidthComputed: (width: number) => void;
}) {
  const cellRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (cellRef.current) {
      props.onWidthComputed(
        parseFloat(getComputedStyle(cellRef.current).width) + WIDTH_BUFFER
      );
    } else {
      console.error(
        new Error("Failed to compute style for an Auto cell", {
          cause: { data: props.data, cellRef },
        })
      );
    }
  }, []);

  return (
    <Cell
      noWrap
      data={props.data}
      placeholder={props.placeholder}
      ref={cellRef}
      style={props.style}
      onRender={props.onRender}
    />
  );
}

interface CellProps {
  data: BasicTableProps.RootProps<string>["entries"][number][string];
  ref?: React.Ref<HTMLElement | null>;
  placeholder?: string;
  noWrap?: boolean;
  style: BasicDivProps["style"];
  onRender?: () => void;
}
function Cell(props: CellProps) {
  useEffect(() => {
    props.onRender?.();
    // console.log({ data: props.data, style: props.style });
  }, []);

  if (typeof props.data === "string" || !props.data)
    return (
      <BasicSpan
        ref={props.ref}
        children={props.data || "-"}
        fade={props.data ? 1 : 0.75}
        style={{
          ...props.style,
          whiteSpace: props.noWrap ? "nowrap" : undefined,
          width: "100%",
        }}
      />
    );
  return props.ref ? (
    // The div ref throws an error because of a missing property in props.ref
    <div
      //@ts-expect-error
      ref={props.ref}
      style={{
        ...props.style,
        width: "100%",
        overflow: "hidden",
      }}
    >
      {props.data}
    </div>
  ) : (
    props.data
  );
}

interface SepProps {
  color?: BasicColor | "none" | 0;
}
function Sep(props: SepProps) {
  const ctx = useContext(Context);
  const color = props.color || ctx.separatorColor;
  return (
    <BasicDiv
      width={SEP_WIDTH}
      height={"full"}
      backgroundColor={color === "none" || color === 0 ? "transparent" : color}
    />
  );
}
function Select(props: { selected: boolean; onClick: () => void }) {
  const ctx = useContext(Context)!;
  const { disableSeparator, separatorColor } =
    ctx.slotProps?.selectColumn || {};
  const sepColor = separatorColor || ctx.separatorColor;

  return (
    <BasicDiv
      padding={disableSeparator ? undefined : ["md", "right"]}
      borderColor={
        sepColor && !disableSeparator ? [sepColor, "right"] : undefined
      }
    >
      <Checkbox
        padding={"sm"}
        iconSize=".85rem"
        checked={props.selected}
        onChange={props.onClick}
      />
    </BasicDiv>
  );
}

const getColName = (
  column: BasicTableProps.RootProps<string>["columns"][number]
) => {
  return typeof column === "string" ? column : column.name;
};

const getColProp = <Key extends keyof TableColumnConfig>(
  key: Key,
  column: TableColumnConfig | string,
  defaults?: TableColumnConfig[Key]
) => {
  return typeof column === "object" && key in column ? column[key] : defaults;
};

const BasicTable = {
  Root,
  Header,
  Body,
};

declare namespace BasicTableProps {
  interface RootProps<T extends string>
    extends RootStyles,
      Partial<
        Record<
          "width" | "height" | `${"min" | "max"}${"Height" | "Width"}`,
          BasicStyleProps["width"]
        >
      > {
    selectable?: boolean;

    /**The default textAlign for columns
     * @default "start" */
    textAlign?: "start" | "center" | "end";
    columns: (T | TableColumnConfig<T>)[];
    backgroundColor?: BasicColor;
    color?: BasicColor;
    entries: { [Key in T]?: React.ReactElement | string }[];
    /**Applies a columnWeight to columns where: <"column">.weight === undefined
     * @default "1fr"
     */
    defaultColumnWeight?: TableColumnConfig["weight"];
    children: JSX.Element | [JSX.Element, JSX.Element];
  }

  interface HeaderProps {
    /**@default "onSurface[0.1]" */
    separatorColor?: SepProps["color"];
    /**@default "camelToLetter" */
    formatColumnName?: "camelToLetter" | ((name: string) => string);
    color?: BasicColor;
    backgroundColor?: BasicColor;
    borderColor?: BasicDivProps["borderColor"];
    fontSize?: BasicDivProps["fontSize"];
    fontWeight?: BasicDivProps["fontWeight"];
    padding?: BasicDivProps["padding"];
    corners?: BasicDivProps["corners"];
  }
  interface BodyProps<T> {
    /**@default [RootProps.rowGap, "top"] */
    padding?: BasicDivProps["padding"];
    color?: BasicColor;
    fontSize?: BasicDivProps["fontSize"];
    styleCell?: (cell: {
      siblingData: {
        /**The data of the cell directly `before` the current cell.
         */
        previous: string | null;
        /**The data of the cell directly `after` the current cell */
        next: string | null;
      };
      cellIndex: number;
      columnName: T;
      rowIndex: number;
      columnIndex: number;
      data: string;
    }) => CSS.Properties | null | undefined;
    styleRow?: (rowIndex: number) => CSS.Properties | null | undefined;
  }
}

export default BasicTable;
export type { BasicTableProps };
