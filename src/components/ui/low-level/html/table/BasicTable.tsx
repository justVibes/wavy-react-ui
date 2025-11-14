import { BasicDiv, BasicSpan, Checkbox } from "@/main";
import { camelCaseToLetter, distinct, lastIndex } from "@wavy/fn";
import type { SafeOmit } from "@wavy/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type JSX,
} from "react";
import { BasicColor, BasicHtmlElementStyleProps } from "../BasicStyle";
import { BasicDivProps } from "../div/BasicDiv";
import { TableColumnConfig } from "./components/types";

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
        onAutoColumnWidthsComputed: (widthMap: Map<string, number>) => void;
        slotProps?: BasicTableProps.RootProps<string>["slotProps"];
      })
  | null
>(null);

type RootStyles = {
  gap?: BasicHtmlElementStyleProps["gap"];
  rowGap?: BasicHtmlElementStyleProps["gap"];
  /**@default "onSurface[0.25]" */
  separatorColor?: BasicColor;
  /**@default "lg" */
  columnGap?: BasicHtmlElementStyleProps["gap"];
  textAlign?: "left" | "center" | "right";
  /**@default "sm" */
  padding?: BasicHtmlElementStyleProps["padding"];
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
  const defaultWeight = props.columnWeight || "1fr";
  const separatorColor = ["none", 0].includes(props.separatorColor!)
    ? undefined
    : props.separatorColor ?? "onSurface[0.25]";

  const getGridCols = (columns: (TableColumnConfig | string)[]) => {
    const leadingColumn = props.selectable ? "auto " : "";
    return (
      leadingColumn +
      columns
        .map((col) =>
          typeof col === "string" || !col.weight ? defaultWeight : col.weight
        )
        .join(" ")
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
    if (!props.columnWeight) return props.columns;
    return props.columns.map((col) => {
      const colConfig =
        typeof col === "object" ? col : ({} as TableColumnConfig);
      return {
        ...colConfig,
        name: getColName(col),
        weight: "weight" in colConfig ? colConfig.weight : props.columnWeight,
      };
    });
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
        onAutoColumnWidthsComputed: (widthMap) => {
          const updatedColumns = props.columns.map(
            (col): TableColumnConfig | string => {
              const maxWidth = widthMap.get(getColName(col));

              if (maxWidth) {
                return { ...(col as any), weight: `${maxWidth}px` };
              }
              return col;
            }
          );
          setGridCols(getGridCols(updatedColumns));
        },
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
  const separatorColor = props.separatorColor || ctx.separatorColor;

  // const handleSelectClick = () => {
  //   props.on
  // };
  return (
    <BasicDiv
      grid
      gridCols={ctx.gridCols}
      gap={ctx.columnGap}
      borderColor={
        props.borderColor ||
        (separatorColor ? [separatorColor, "bottom"] : undefined)
      }
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
      {ctx.columns.map((col, i) => {
        const colName = getColName(col);
        return (
          <BasicSpan
            key={colName + i}
            size={"full"}
            borderColor={
              separatorColor && i !== lastIndex(ctx.columns)
                ? [separatorColor, "right"]
                : undefined
            }
            textAlign={props.textAlign ?? ctx.textAlign}
            text={
              !props.formatColumnName ||
              props.formatColumnName === "camelToLetter"
                ? camelCaseToLetter(colName)
                : props.formatColumnName?.(colName) ?? colName
            }
            style={{ flexGrow: 1 }}
          />
        );
      })}
    </BasicDiv>
  );
}

function Body(props: BasicTableProps.BodyProps) {
  const ctx = useContext(Context)!;
  let columnWidthMap = new Map<string, number>();

  useEffect(() => {
    const cleanup = () => {
      columnWidthMap.clear();
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
            onColWidthComputed={(colName, width) => {
              const maxWidth = columnWidthMap.get(colName);
              if (!maxWidth || width > maxWidth) {
                columnWidthMap.set(colName, width);
              }
            }}
            onCellRendered={(colIdx) => {
              const isLastRow = index === lastIndex(ctx.entries);
              const isLastColumn = colIdx === lastIndex(ctx.columns);

              if (isLastRow && isLastColumn && columnWidthMap.size > 0) {
                ctx.onAutoColumnWidthsComputed(columnWidthMap);
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
  onCellRendered: (colIdx: number) => void;
  onColWidthComputed: (colName: string, width: number) => void;
}) {
  const ctx = useContext(Context)!;
  const selected = ctx.selectedRowIndices.includes(props.index);

  const handleSelectClick = () => {
    ctx.onSelectRowClick(props.index);
  };

  return (
    <BasicDiv
      width={"full"}
      grid
      align="center"
      gridCols={ctx.gridCols}
      gap={ctx.columnGap}
      padding={ctx.padding ?? props.padding}
      backgroundColor={selected ? "onSurface[0.1]" : "transparent"}
    >
      {ctx.selectable && (
        <Select selected={selected} onClick={handleSelectClick} />
      )}

      {ctx.columns.map((col, colIndex) => {
        const colName = getColName(col);
        const cellData = props.rowData[colName];
        const placeholder =
          typeof col === "object" ? col?.placeholder : undefined;
        const handleOnRender = () => {
          props.onCellRendered?.(colIndex);
        };
        const key = colIndex + getColName(col);

        if (typeof col === "object" && col.weight === "auto") {
          return (
            <AutoCell
              key={key}
              data={cellData}
              placeholder={placeholder}
              onWidthComputed={(w) => props.onColWidthComputed(colName, w)}
              onRender={handleOnRender}
            />
          );
        }

        return (
          <Cell
            key={key}
            placeholder={placeholder}
            data={cellData}
            onRender={handleOnRender}
          />
        );
      })}
    </BasicDiv>
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

function AutoCell(props: {
  data: CellProps["data"];
  placeholder?: string;
  onRender?: () => void;
  onWidthComputed: (width: number) => void;
}) {
  const cellRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (cellRef.current) {
      props.onWidthComputed(
        parseFloat(getComputedStyle(cellRef.current).width)
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
      data={props.data}
      placeholder={props.placeholder}
      noWrap
      ref={cellRef}
      onRender={props.onRender}
    />
  );
}

interface CellProps {
  data: BasicTableProps.RootProps<string>["entries"][number][string];
  ref?: React.Ref<HTMLElement | null>;
  placeholder?: string;
  noWrap?: boolean;
  onRender?: () => void;
}
function Cell(props: CellProps) {
  useEffect(() => {
    props.onRender?.();
  }, []);

  if (typeof props.data === "string")
    return (
      <BasicSpan
        style={{ whiteSpace: props.noWrap ? "nowrap" : undefined }}
        ref={props.ref}
        children={props.data}
      />
    );
  return props.data ? (
    props.ref ? (
      // The div ref throws an error because of a missing property in props.ref
      //@ts-expect-error
      <div ref={props.ref} style={{ width: "100%", overflow: "hidden" }}>
        {props.data}
      </div>
    ) : (
      props.data
    )
  ) : (
    <BasicSpan
      ref={props.ref}
      fade={0.75}
      width={"full"}
      text={props.placeholder ?? "-"}
    />
  );
}

const getColName = (
  column: BasicTableProps.RootProps<string>["columns"][number]
) => {
  return typeof column === "string" ? column : column.name;
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
          BasicHtmlElementStyleProps["width"]
        >
      > {
    selectable?: boolean;
    columns: (T | TableColumnConfig<T>)[];
    backgroundColor?: BasicColor;
    color?: BasicColor;
    entries: { [Key in T]?: React.ReactElement | string }[];
    /**Applies a columnWeight to columns where: <"column">.weight === undefined
     * @default "1fr"
     */
    columnWeight?: TableColumnConfig["weight"];
    children: [JSX.Element, JSX.Element];
  }

  interface HeaderProps {
    /**@default "left" */
    textAlign?: "left" | "center" | "right";
    /**@default "onSurface[0.1]" */
    separatorColor?: BasicColor | 0 | "none";
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
  interface BodyProps {
    /**@default [RootProps.rowGap, "top"] */
    padding?: BasicDivProps["padding"];
    color?: BasicColor;
    fontSize?: BasicDivProps["fontSize"];
  }
}

export default BasicTable;
export type { BasicTableProps };
