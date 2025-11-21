import {
  BasicButton,
  Popover,
  BasicSpan,
  TextField,
  ellipsis,
  FontSize,
  useManagedRef,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { Prettify, SafeOmit } from "@wavy/types";
import React, { createContext, useContext, useState } from "react";
import { IconType } from "react-icons";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { BasicButtonProps } from "../html/button/BasicButton";
import BasicDiv, { BasicDivProps } from "../html/div/BasicDiv";
import { PopoverProps } from "../popover/Popover";
import { TextFieldProps } from "../textfield/TextField";
import { BasicSpanProps } from "../html/span/BasicSpan";

const Context = createContext<{
  padding: BasicButtonProps["padding"];
  iconSize: EditableProps["size"];
}>(null);

type Control = "cancel" | "save" | "edit";

interface EditableProps extends Partial<Pick<TextFieldProps, "focusColor">> {
  value?: string;
  disabled?: boolean;
  label?: string;
  defaultValue?: string;
  /**@default "click" */
  activationMode?: "dblclick" | "click" | "none";
  width?: BasicDivProps["width"];
  /**@default "10rem" */
  inputWidth?: BasicDivProps["width"];
  /**@default "md" */
  size?: "2xl" | "xl" | "lg" | "md" | "sm" | "xs" | "2xs";
  iconSize?: EditableProps["size"];
  /** Prevents editing */
  preventDefault?: boolean;
  /**Replaces the predefined controls */
  control?: JSX.Element;
  placeholder?: string;
  /**The padding for the content in its resting (non-editing) state
   * @default ["md", ["top", "bottom"]] */
  contentPadding?: BasicDivProps["padding"];
  spaceBetween?: boolean;
  hideControls?: boolean | Control | Control[];
  maxChars?: number;
  inputSize?: TextFieldProps["size"];
  rowGap?: BasicDivProps["gap"];
  columnGap?: BasicDivProps["gap"];
  showPopoverOnHover?: boolean;
  showCharCounter?: boolean;
  fontSize?: BasicSpanProps["fontSize"];
  charCounterFontSize?: BasicSpanProps["fontSize"];
  allowedChars?: RegExp;
  renderPopoverContent?: (value: string) => React.ReactNode;
  onEditClick?: () => void;
  onContentClick?: () => void;
  onCancelClick?: () => void;
  onSaveClick?: (value: string) => void;
  onSave?: (value: string) => void;
  /** @param value The content after it was changed (includes reversions)*/
  onChange?: (value: string) => void;
  /** Invoked when either onEditClick or onContentClick is fired. */
  onEdit?: () => void;
  slotProps?: {
    popover?: Prettify<
      Partial<
        SafeOmit<PopoverProps, "children"> & {
          /**@default "match-anchor" */
          maxWidth: PopoverProps["maxWidth"];
          /**@default "5rem"*/
          maxHeight: PopoverProps["maxHeight"];
        }
      >
    >;
  };
}
function Editable(props: EditableProps) {
  const clickedControlRef = useManagedRef<"save" | "cancel" | "edit">(null);
  const previousTextRef = useManagedRef(props.defaultValue ?? "");
  const [text, setText] = useState(props.value ?? previousTextRef.read());
  const [editing, setEditing] = useState(false);
  const activationMode = props.activationMode || "click";
  const size = props.size || "md";

  const handleOnChange = (value: string) => {
    if (props.value === undefined) setText(value);
    props.onChange?.(value);
  };
  const rollbackChanges = () => {
    handleOnChange(previousTextRef.read());
  };
  const handleOnEdit = () => {
    props.onEdit?.();
    if (props.preventDefault) return;
    setEditing(true);
  };

  const handleOnCancel = (options = { asClick: true }) => {
    clickedControlRef.upsert("cancel");
    rollbackChanges();
    if (options.asClick) props.onCancelClick?.();
    setEditing(false);
  };
  const handleTextFieldBlur = (e: { preventDefault: VoidFunction }) => {
    e.preventDefault();
    const clickedControl = clickedControlRef.read();

    if (clickedControl !== "save") rollbackChanges();
    setEditing(false);
  };
  const handleOnSave = (isClick = true) => {
    previousTextRef.upsert(text);
    if (isClick) {
      clickedControlRef.upsert("save");
      props.onSaveClick?.(text);
    }
    props.onSave?.(text);
    setEditing(false);
  };
  const handleOnEditClick = () => {
    clickedControlRef.upsert("edit");
    props.onEditClick?.();
    handleOnEdit();
  };
  const handleOnEnterPressed = () => {
    handleOnSave(false);
  };
  const handleOnContentClick = () => {
    props.onContentClick?.();
    handleOnEdit();
  };

  const wrapperProps: BasicDivProps = {
    align: "center",
    gap: props.rowGap ?? "sm",
    width: props.width,
    maxWidth: "full",
  };
  return (
    <Context.Provider
      value={{
        padding: ".25rem",
        iconSize: props.iconSize || size,
      }}
    >
      <BasicDiv
        {...wrapperProps}
        asChildren={!props.label}
        row={false}
        align="start"
      >
        {props.label && (
          <BasicSpan
            text={props.label}
            fontSize={FontSize[size]}
            fade={editing ? 0.75 : 0.5}
            style={{ transition: "all 200ms linear" }}
          />
        )}
        <BasicDiv
          {...wrapperProps}
          grid
          gap={props.columnGap ?? wrapperProps.gap}
          gridCols={
            props.hideControls === true ||
            (Array.isArray(props.hideControls) &&
              (["cancel", "save", "edit"] as const).every((ctrl) =>
                (props.hideControls as Control[]).includes(ctrl)
              ))
              ? "1fr"
              : props.control
              ? "1fr auto"
              : editing // The conditions are "spelt out" for readability
              ? "1fr auto auto"
              : "1fr auto"
          }
          justify={props.spaceBetween ? "space-between" : undefined}
        >
          {editing ? (
            <BasicDiv width={"full"} align="center" gap={"md"}>
              <TextField
                autoFocus
                allowedChars={props.allowedChars}
                maxChars={props.maxChars}
                value={text}
                corners={"md"}
                width={props.inputWidth}
                focusColor={props.focusColor}
                size={props.inputSize || size}
                placeholder={props.placeholder}
                showCharCounter={props.showCharCounter}
                slotProps={{
                  charCounter: { fontSize: props.charCounterFontSize },
                }}
                onChange={handleOnChange}
                onBlur={handleTextFieldBlur}
                onEnterKeyPressed={handleOnEnterPressed}
                onEscapeKeyPressed={() => handleOnCancel({ asClick: false })}
              />
            </BasicDiv>
          ) : (
            <BasicDiv
              spill={"hidden"}
              width={"full"}
              padding={props.contentPadding ?? ["md", ["top", "bottom"]]}
              corners={"sm"}
              fontSize={props.fontSize || size}
              cursor="text"
              css={{
                transition: "all 200ms linear",
                ":hover": { backgroundColor: "onSurface[0.1]" },
              }}
              onDoubleClick={
                activationMode === "dblclick"
                  ? () => handleOnCancel({ asClick: false })
                  : undefined
              }
              onClick={
                activationMode === "click" ? handleOnContentClick : undefined
              }
            >
              <Popover
                {...props.slotProps?.popover}
                allowInteractions
                asChild={
                  props.showPopoverOnHover === false
                    ? true
                    : props.slotProps?.popover?.asChild ?? !!text
                }
                content={
                  (props.slotProps?.popover?.content ||
                    props.renderPopoverContent?.(text)) ??
                  text
                }
                displayAction="hover"
                maxWidth={props.slotProps?.popover?.maxWidth || "10rem"}
                maxHeight={props.slotProps?.popover?.maxHeight || "5rem"}
              >
                <span
                  style={ellipsis({
                    opacity: props.placeholder && !text ? 0.85 : 1,
                    width: "100%",
                  })}
                >
                  {text || props.placeholder}
                </span>
              </Popover>
            </BasicDiv>
          )}
          {props.hideControls !== true &&
            (props.control || (
              <ControlButtons
                editing={editing}
                hideControl={
                  typeof props.hideControls === "boolean"
                    ? undefined
                    : props.hideControls
                }
                onCancel={handleOnCancel}
                onSave={handleOnSave}
                onEdit={handleOnEditClick}
              />
            ))}
        </BasicDiv>
      </BasicDiv>
    </Context.Provider>
  );
}

function ControlButtons(props: {
  editing: boolean;
  hideControl?: Exclude<EditableProps["hideControls"], boolean>;
  onCancel: () => void;
  onSave: () => void;
  onEdit: () => void;
}) {
  const hidden = (control: Control) =>
    Array.isArray(props.hideControl)
      ? props.hideControl.includes(control)
      : props.hideControl === control;
  if (!props.editing) {
    return hidden("edit") ? undefined : (
      <Control icon={LuPencilLine} onClick={props.onEdit} />
    );
  }
  return (
    <>
      {!hidden("cancel") && (
        <Control outlined icon={LuX} onClick={props.onCancel} />
      )}
      {!hidden("save") && (
        <Control
          preventDefault
          outlined
          icon={LuCheck}
          onClick={props.onSave}
        />
      )}
    </>
  );
}

function Control(props: {
  icon: IconType;
  outlined?: boolean;
  preventDefault?: boolean;
  onClick: () => void;
}) {
  const { padding, iconSize } = useContext(Context);

  return (
    <BasicDiv
      asChildren={props.outlined}
      corners={"sm"}
      css={{
        transition: "all 200ms linear",
        ":hover": {
          backgroundColor: "onSurface[0.1]",
        },
      }}
    >
      <BasicButton
        size={iconSize}
        padding={padding}
        leadingEl={props.icon}
        backgroundColor={"transparent"}
        borderColor={props.outlined ? "onSurface[0.25]" : undefined}
        onClick={props.onClick}
        aspectRatio={1}
        color="onSurface"
        corners={"sm"}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      />
    </BasicDiv>
  );
}

export { Editable, type EditableProps };
