import { isOverflown } from "../../../../../../../../../ui/components/core/helper-functions/CssHelperFunctions";
import { JSX } from "@emotion/react/jsx-runtime";
import type * as CSS from "csstype";
import { memo, useMemo, useState } from "react";
import { v4 } from "uuid";
import {
  useManagedRef,
  useRerender,
} from "../../../../../../helper-functions/CustomHooks";
import {
  isEmpty,
  run,
  upperFirst,
} from "../../../../../../helper-functions/HelperFunctions";
import {
  CssColors,
  CssSpacing,
} from "../../../../../../resources/CssResources";
import AddButton from "../../../contextual/buttons/add/AddButton";
import EditingButtons from "../../../contextual/buttons/EditingButtons";
import BasicTextfield, {
  BasicTextfieldProps,
} from "../../../low-level/textfield/BasicTextfield";
import { InputValidator } from "../../textfield/components/BasicTextfieldTypes";
import BasicDiv, { BasicDivProps } from "../div/BasicDiv";
import BasicSpan from "../html/span/BasicSpan";
import {
  BasicTableColumnDef,
  BasicTableDataType,
  BasicTableStyle,
  ColumnAlign,
} from "./components/BasicTableUtil";

const unadded_error_boundary = "ADD ERROR BOUNDARY";

type CustomTextField = (props: { value: string }) => JSX.Element;
interface BasicTableProps<ColName extends string> {
  data: BasicTableDataType<ColName>[];
  gap?: string | number;
  orderedColNames: ColName[];
  editable?: {
    rowClass: string;
    onCancelClick?: () => void;
    onEditClick?: (rowIdx: number) => void;
    onDeleteRow: (
      rowIdx: number
    ) => DeprecatedCompletionStatus<void | undefined>;
    onUpdateRow: (
      rowIdx: number,
      data: Record<ColName, string>
    ) => DeprecatedCompletionStatus<void | undefined>;
    insertable?: {
      disabled?: boolean;
      maxRows?: number;
      onInsert: (
        data: Record<ColName, string>
      ) => DeprecatedCompletionStatus<void | undefined>;
    };
    textfield: Record<
      ColName,
      | {
          validator: InputValidator;
          format?: BasicTextfieldProps["formatter"];
          manualValidator?: (value: string) => boolean;
        }
      | CustomTextField
    >;
  };
  totals?: Partial<BasicTableDataType<ColName>>;
  columnDef: BasicTableColumnDef<ColName>;
  style?: CSS.Properties;

  padding?: {
    topAndBottom?: string;
    leftAndRight?: string;
  };
  slotProps?: {
    header?: {
      fontSize?: string;
      style?: BasicTableStyle;
      cellStyle?: (column: ColName, index: number) => BasicTableStyle;
    };
    bodyStyle?: CSS.Properties;
    row?: { style?: (params: { rowIdx: number }) => BasicTableStyle };
  };
}

function BasicTable<ColName extends string>(props: BasicTableProps<ColName>) {
  const dataKeys = props.orderedColNames;
  const dataRows = props.data.map((d) => ({ ...d, uid: v4() }));
  const editingButtonSize = "1rem";

  const editingRowRef = useManagedRef<Record<ColName, string>>(undefined);

  const [overFlowing, setIsOverFlowing] = useState(false);
  const [editingButtonsWidth, setEditingButtonsWidth] = useState(0);
  const [editableRowIdx, setEditableRowIdx] = useState<number>();

  const isEditingButtonsVisible =
    (props.editable !== undefined && !isEmpty(props.data)) ||
    Boolean(props.editable?.insertable);

  // Editing Row Event Handlers
  const handleSetRowEditable = (row: number) => {
    setEditableRowIdx(row);
    editingRowRef.upsert(
      structuredClone(dataRows[row] as Record<ColName, string>)
    );
    props.editable.onEditClick?.(row);
  };
  const handleUpdateEditingRow = (key: ColName, value: string) =>
    editingRowRef.upsert((row) => ({ ...row, [key]: value }));
  const handleDeleteRow = (row: number) => {
    const error = props.editable.onDeleteRow(row);
    if (error) {
      console.log(unadded_error_boundary, error);
      return;
    }
  };
  const handleCancelEdit = () => {
    setEditableRowIdx(undefined);
    editingRowRef.delete();
    props.editable.onCancelClick?.();
  };
  const handleApplyEdit = () => {
    const error = props.editable.onUpdateRow(
      editableRowIdx,
      editingRowRef.read()
    );

    if (error) {
      console.log(unadded_error_boundary, error);
      return;
    }

    handleCancelEdit();
  };

  const getColumnAlign = (colName: ColName) => props.columnDef[colName].align;

  const tableRowProps = (
    basicDivProps: BasicDivProps
  ): SafeOmit<TableRowProps<ColName>, "children"> => {
    return {
      ...basicDivProps,
      overflowing: overFlowing,
      columnDef: props.columnDef,
      orderedColumns: dataKeys,
      editingButtonsWidth: editingButtonsWidth,
      editingButtonsVisible: isEditingButtonsVisible,
    };
  };

  const rowTopAndBottomPadding = props.padding?.topAndBottom || CssSpacing.sm;
  const rowLeftAndRightPadding = props.padding?.leftAndRight || CssSpacing.md;
  const TR = (properties: BasicDivProps & { children: React.ReactNode }) => (
    <TableRow
      {...tableRowProps(properties)}
      style={{
        ...properties.style,
        paddingTop: rowTopAndBottomPadding,
        paddingBottom: rowTopAndBottomPadding,
        paddingLeft: rowLeftAndRightPadding,
        paddingRight: overFlowing ? "2rem" : rowLeftAndRightPadding,
      }}
    >
      {properties.children}
    </TableRow>
  );

  const Header = () => {
    const headerSlotProp = props.slotProps?.header;
    return (
      <TR
        md_shape
        style={{
          backgroundColor: CssColors.onSurface,
          color: CssColors.surface,
          ...headerSlotProp?.style,
        }}
      >
        {isEditingButtonsVisible && <span />}
        {dataKeys.map((key, idx) => (
          <TableCell
            bold
            key={idx}
            text={upperFirst(key)}
            align={getColumnAlign(key)}
            style={{
              fontSize: headerSlotProp?.fontSize,
              ...headerSlotProp?.cellStyle?.(key, idx),
            }}
          />
        ))}
      </TR>
    );
  };

  return (
    <BasicDiv
      relative
      fullHeight
      fullWidth
      hideYSpill
      autoXSpill
      grid
      gridRows="auto 1fr auto"
      gap={typeof props.gap === "number" ? `${props.gap}rem` : props.gap}
      style={props.style}
    >
      {/* Used to get an accurate measurement of the editing buttons  */}
      {isEditingButtonsVisible && (
        <BasicDiv abs opacity={0}>
          (
          <EditingButtons
            disabled
            editing
            buttonSize={editingButtonSize}
            ref={(r) => r && setEditingButtonsWidth(r.offsetWidth)}
            class="Subject"
            addEventListener={undefined}
          />
          )
        </BasicDiv>
      )}
      <Header />
      <BasicDiv
        autoYSpill
        fullWidth
        fullHeight
        style={props.slotProps?.bodyStyle}
        ref={(r) => (r ? setIsOverFlowing(isOverflown(r)) : undefined)}
      >
        {dataRows.map((data, rowIdx) => (
          <TR
            key={data.uid}
            height={"fit-content"}
            style={{
              fontSize: ".7rem",
              ...props.slotProps?.row?.style?.({ rowIdx }),
            }}
          >
            {isEditingButtonsVisible && (
              <EditingButtons
                editing={editableRowIdx === rowIdx}
                buttonSize={editingButtonSize}
                class={props.editable.rowClass}
                addEventListener={(e) => {
                  switch (e) {
                    case "set-editable:clicked":
                      handleSetRowEditable(rowIdx);
                      break;
                    case "cancel-edit:clicked":
                      handleCancelEdit();
                      break;
                    case "delete:clicked":
                      handleDeleteRow(rowIdx);
                      break;
                    case "apply-edit:clicked":
                      handleApplyEdit();
                      break;
                  }
                }}
              />
            )}
            {dataKeys.map((key) => {
              if (typeof data[key] === "object") {
                const RenderedValue = data[key].render;
                return (
                  <RenderedValue
                    key={key}
                    editing={editableRowIdx === rowIdx}
                  />
                );
              }
              if (
                rowIdx === editableRowIdx &&
                typeof props.editable.textfield[key]
              ) {
                return (
                  <CellTextField
                    key={key}
                    textfield={props.editable?.textfield}
                    column={key}
                    initialValue={data[key]}
                    onChange={(v) => handleUpdateEditingRow(key, v)}
                  />
                );
              }

              return (
                <TableCell
                  key={key}
                  style={{ fontSize: "inherit" }}
                  text={run(data[key] as string, (value) => {
                    return props.columnDef[key]?.format?.(value) || value;
                  })}
                  align={getColumnAlign(key)}
                />
              );
            })}
          </TR>
        ))}
        {isEditingButtonsVisible && props.editable?.insertable && (
          <InsertDataRow<ColName>
            {...tableRowProps({
              height: "fit-content",
              style: { padding: `${CssSpacing.sm} ${CssSpacing.md}` },
            })}
            {...props.editable?.insertable}
            disabled={
              props.editable?.insertable?.disabled ||
              run(props.editable?.insertable?.maxRows, (maxRows) => {
                if (maxRows === undefined) return false;
                return dataRows.length >= maxRows;
              })
            }
            parentOverflowing={overFlowing}
            textfield={props.editable?.textfield}
          />
        )}
      </BasicDiv>
    </BasicDiv>
  );
}

function TableCell(props: {
  text: string;
  align: ColumnAlign;
  bold?: boolean;
  style?: NoUndefinedField<CSS.Properties>;
}) {
  const getTextAlign = () => {
    switch (props.align) {
      case "start":
        return "left";
      case "center":
        return props.align;
      case "end":
        return "right";
    }
  };
  return (
    <BasicSpan
      sm_font={!props.style?.fontSize}
      fontSize={run(props.style?.fontSize, (size) => {
        if (!size) return;
        return typeof size === "number" ? `${size}lh` : size;
      })}
      fullWidth
      bold={props.bold}
      align={props.align}
      textAlign={getTextAlign()}
      style={props.style}
      text={props.text}
    />
  );
}

interface TableRowProps<ColName extends string> extends BasicDivProps {
  editingButtonsVisible: boolean;
  editingButtonsWidth: number;
  overflowing: boolean;
  // space
  orderedColumns: ColName[];
  columnDef: BasicTableProps<ColName>["columnDef"];
  children: React.ReactNode;
}
function TableRow<ColName extends string>(props: TableRowProps<ColName>) {
  // const hasWidth = "width" in props.columnDef
  const getColWidth = (colName: ColName) => {
    const colDef = props.columnDef[colName];
    if ("width" in colDef) return colDef.width;
    return `${colDef.weight}fr`;
  };
  return (
    <BasicDiv
      grid
      fullWidth
      sm_pad
      md_gap
      alignCenter
      spaceBetween // Only effective when all columns have a set width
      gridCols={
        (props.editingButtonsVisible ? `${props.editingButtonsWidth}px ` : "") +
        props.orderedColumns.map((colName) => getColWidth(colName)).join(" ")
      }
      padding={props.overflowing ? ["xl", "right"] : undefined}
      {...props}
    >
      {props.children}
    </BasicDiv>
  );
}

function InsertDataRow<ColName extends string>(
  props: SafeOmit<TableRowProps<ColName>, "children"> &
    BasicTableProps<ColName>["editable"]["insertable"] & {
      textfield: BasicTableProps<ColName>["editable"]["textfield"];
      parentOverflowing: boolean;
    }
) {
  const defaultRow = Object.fromEntries<string>(
    Object.keys(props.columnDef).map((key) => [key as ColName, ""] as const)
  ) as Record<ColName, string>;
  const columns = useMemo(() => props.orderedColumns, []);
  const { triggerRerender } = useRerender();
  const dataRef = useManagedRef(defaultRow);

  const handleUpdateDataRef = (key: ColName, value: string) => {
    dataRef.upsert((data) => ({ ...data, [key]: value }));
  };

  return (
    <TableRow
      {...props}
      ref={(r) =>
        r && props.parentOverflowing && r.scrollIntoView({ behavior: "smooth" })
      }
      height={"fit-content"}
      style={{
        fontSize: ".7rem",
        padding: `${CssSpacing.sm} ${CssSpacing.md}`,
      }}
    >
      <AddButton
        disabled={props.disabled}
        fontSize=".75rem"
        onClick={() => {
          const error = props.onInsert(dataRef.read());
          if (error) {
            return console.log(unadded_error_boundary, error);
          }
          triggerRerender();
        }}
      />
      {columns.map((key) => (
        <CellTextField
          key={key}
          disabled={props.disabled}
          column={key}
          textfield={props?.textfield}
          onChange={(v) => handleUpdateDataRef(key, v)}
        />
      ))}
    </TableRow>
  );
}

const CellTextField = memo(function <ColName extends string>(props: {
  disabled?: boolean;
  column: ColName;
  textfield: BasicTableProps<ColName>["editable"]["textfield"];
  initialValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const textfield = props.textfield[props.column];
  if (typeof textfield === "function") {
    const TextField = textfield as CustomTextField;
    return <TextField value={props.initialValue || ""} />;
  }

  return (
    <BasicTextfield
      dense
      fullWidth
      size="sm"
      disabled={props.disabled}
      defaultValue={props.initialValue || ""}
      value={props.value}
      placeholder={props.column}
      autoValidator={textfield?.validator}
      manualValidator={textfield?.manualValidator}
      format={textfield?.format}
      onChange={props.onChange}
      style={{ fontSize: ".7rem" }}
    />
  );
});

export default BasicTable;
export { type BasicTableDataType, type BasicTableProps };
