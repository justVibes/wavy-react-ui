import {
  BasicButton,
  BasicColor,
  BasicDiv,
  Dialog,
  resolveBasicColor,
  UseDialogControllerReturn
} from "@/main";
import { SuccessMessage, TaskResult } from "@wavy/types";
import { createContext, useContext } from "react";
import { IconType } from "react-icons";
import { BsCheck2Circle } from "react-icons/bs";
import { GrRotateLeft } from "react-icons/gr";
import { IoWarningOutline } from "react-icons/io5";
import { RiMailCloseLine, RiMailSendLine } from "react-icons/ri";
import applyBasicStyle, {
  ElementDim,
  ElementSize,
} from "../../low-level/html/BasicStyle";
import { BasicSpanProps } from "../../low-level/html/span/BasicSpan";

const MainContext = createContext<{ color: BasicColor }>(null);

interface TaskResultDialogProps {
  controller: UseDialogControllerReturn<TaskResult<SuccessMessage>>;
  unmountOnExit?: boolean;
  /**@default "2.75rem" */
  indicatorSize?: ElementDim | ((status: "success" | "error") => ElementDim);
  /**@default "25rem" */
  maxWidth?: ElementSize;
  width?: ElementSize;
  minWidth?: ElementSize;
  /**@default "lg" */
  titleFontSize?: BasicSpanProps["fontSize"];
  /**@default "sm" */
  descriptionFontSize?: BasicSpanProps["fontSize"];
  disableColorIndicator?: boolean;
  /**
   * @default "normal"
   */
  indicator?: ((status: "success" | "error") => IconType) | "normal" | "mail";
  actionButton?: (status: "succes" | "error") => ActionButtonProps | undefined;
}
function TaskResultDialog(props: TaskResultDialogProps) {
  const controller = props.controller;
  const isSuccess = !!controller.value?.response;
  const { title, message } =
    controller.value?.response || controller.value?.error || {};
  const color: BasicColor = isSuccess ? "carlsbergGreen" : "billsRed";

  const Indicator = (() => {
    if (!controller?.value) return;

    if (!props.indicator || props.indicator === "normal")
      return isSuccess ? BsCheck2Circle : IoWarningOutline;
    if (props.indicator === "mail")
      return isSuccess ? RiMailSendLine : RiMailCloseLine;
    return props.indicator(isSuccess ? "success" : "error");
  })()!;
  const actionButton = props.actionButton?.(isSuccess ? "succes" : "error");

  const styles = {
    title: applyBasicStyle({ fontSize: props.titleFontSize || "lg" }),
    description: applyBasicStyle({
      fontSize: props.descriptionFontSize || "sm",
      fade: 0.5,
    }),
  };
  const applyTextStyle = ({
    fontSize,
    lineHeight,
    opacity,
  }: React.CSSProperties) => {
    return { fontSize, lineHeight, opacity };
  };

  return (
    <MainContext.Provider value={{ color }}>
      <Dialog.Root
        controller={controller}
        width={props.width}
        minWidth={props.minWidth}
        maxWidth={props.maxWidth ?? "25rem"}
        gap={"sm"}
        unmountOnExit={props.unmountOnExit}
        borderColor={props.disableColorIndicator ? undefined : [color, "left"]}
      >
        <Dialog.Body grid gridCols="auto 1fr" gap={"lg"}>
          <Indicator
            color={resolveBasicColor(color)}
            size={
              typeof props.indicatorSize === "function"
                ? props.indicatorSize(isSuccess ? "success" : "error")
                : props.indicatorSize ?? "2.75rem"
            }
          />
          <BasicDiv
            width={"full"}
            gap={"sm"}
            spill={"hidden"}
            padding={["md", "top"]}
          >
            <span style={applyTextStyle(styles.title)}>{title}</span>
            <span style={applyTextStyle(styles.description)}>{message}</span>
          </BasicDiv>
        </Dialog.Body>

        <Dialog.Footer row gap={"md"} align="center">
          <Dialog.ActionTrigger>
            <BasicButton
              size="xs"
              backgroundColor={actionButton ? "transparent" : "onSurface[0.1]"}
              color="onSurface[0.75]"
              text="Dismiss"
              onClick={controller.hide}
            />
          </Dialog.ActionTrigger>
          {actionButton ? <ActionButton {...actionButton} /> : undefined}
        </Dialog.Footer>
      </Dialog.Root>
    </MainContext.Provider>
  );
}

interface ActionButtonProps {
  label: string;
  disabled?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  async?: boolean;
  onClick?: () => void;
}
function ActionButton(props: ActionButtonProps) {
  const { color } = useContext(MainContext);

  return (
    <BasicButton
      async={props.async}
      disabled={props.disabled}
      backgroundColor={color}
      leadingEl={props.leadingIcon}
      color="white"
      size="xs"
      trailingEl={props.trailingIcon}
      text={props.label}
      onClick={props.onClick}
    />
  );
}

const createErrorButton = (label: string) => {
  return (options: {
    disabled?: boolean;
    onClick: () => void;
  }): ActionButtonProps => {
    return {
      disabled: options.disabled,
      async: true,
      label: label,
      leadingIcon: GrRotateLeft,
      onClick: options.onClick,
    };
  };
};

TaskResultDialog.tryAgainButton = createErrorButton("Try Again");
TaskResultDialog.retryButton = createErrorButton("Retry");

export default TaskResultDialog;
