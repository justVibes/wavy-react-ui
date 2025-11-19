import {
  BasicButton,
  BasicColor,
  Dialog,
  BasicDiv,
  FontSize,
  resolveBasicColor,
  UseDialogControllerReturn,
} from "@/main";
import { SuccessMessage, TaskResult } from "@wavy/types";
import { createContext, useContext } from "react";
import { IconType } from "react-icons";
import { BsCheck2Circle } from "react-icons/bs";
import { GrRotateLeft } from "react-icons/gr";
import { IoWarningOutline } from "react-icons/io5";
import { RiMailCloseLine, RiMailSendLine } from "react-icons/ri";

const MainContext = createContext<{ color: BasicColor }>(null);

interface TaskResultDialogProps {
  controller: UseDialogControllerReturn<TaskResult<SuccessMessage>>;
  unmountOnExit?: boolean;
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
    if (!controller.value) return;

    if (!props.indicator || props.indicator === "normal")
      return isSuccess ? BsCheck2Circle : IoWarningOutline;
    if (props.indicator === "mail")
      return isSuccess ? RiMailSendLine : RiMailCloseLine;
    return props.indicator(isSuccess ? "success" : "error");
  })()!;
  const actionButton = props.actionButton?.(isSuccess ? "succes" : "error");

  return (
    <MainContext.Provider value={{ color }}>
      <Dialog.Root
        controller={controller}
        width={"25rem"}
        gap={"sm"}
        unmountOnExit={props.unmountOnExit}
        borderColor={props.disableColorIndicator ? undefined : [color, "left"]}
      >
        <Dialog.Body grid gridCols="auto 1fr" gap={"lg"}>
          <Indicator color={resolveBasicColor(color)} size={"2.75rem"} />
          <BasicDiv
            width={"full"}
            gap={"sm"}
            spill={"hidden"}
            padding={["md", "top"]}
          >
            <span style={{ fontSize: FontSize.lg }}>{title}</span>
            <span style={{ fontSize: FontSize.sm, opacity: 0.5 }}>
              {message}
            </span>
          </BasicDiv>
        </Dialog.Body>

        <Dialog.Footer row gap={"md"} align="center">
          <BasicButton
            size="xs"
            backgroundColor={actionButton ? "transparent" : "onSurface[0.1]"}
            color="onSurface[0.75]"
            text="Dismiss"
            onClick={controller.hide}
          />
          {actionButton && <ActionButton {...actionButton} />}
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
