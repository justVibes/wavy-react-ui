import {
  BasicButton,
  Disclaimer,
  resolveBasicColor,
  UseModalControlsReturn,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { TaskResult } from "@wavy/types";
import { BasicDivProps } from "../html/div/BasicDiv";
import { Dialog } from "./Dialog";

interface ConfirmationDialogProps
  extends Partial<
    Record<
      "width" | "height" | `${"min" | "max"}${"Width" | "Height"}`,
      BasicDivProps["width"]
    >
  > {
  title: string;
  message: string;
  hideDisclaimerLabel?: boolean;
  disclaimer?: string;
  controller?: UseModalControlsReturn;
  triggerElement?: JSX.Element;
  /**
   * @default "error"
   */
  severity?: "error" | "info" | "warning";
  /**
   * @default "Cancel"
   */
  cancelLabel?: "Dismiss" | "Cancel" | (string & {});
  onCancelClick?: () => void;
  action: {
    label: string;
    onClick: () => void | Promise<TaskResult> | TaskResult;
  };
}

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const severity = props.severity || "error";
  const color = resolveBasicColor(severity, {
    preference: "res",
  });

  return (
    <Dialog.Root
      controller={props.controller}
      width={props.width ?? "25rem"}
      height={props.height}
      minHeight={props.minHeight}
      maxHeight={props.maxHeight}
      minWidth={props.minWidth}
      maxWidth={props.maxWidth}
      triggerElement={props.triggerElement}
    >
      <Dialog.Header fontSize="2xl">{props.title}</Dialog.Header>
      <Dialog.Body fade={0.75}>
        <span>
          {props.message.split("\n").map((text) => (
            <>
              {text}
              <br />
            </>
          ))}
        </span>
        {props.disclaimer && (
          <Disclaimer
            width={"full"}
            facade={(s) => (s === "error" ? "warning" : s)}
            hideLabel={props.hideDisclaimerLabel}
            severity={severity}
            message={props.disclaimer}
          />
        )}
      </Dialog.Body>
      <Dialog.Footer gap={"md"}>
        <Dialog.ActionTrigger>
          <BasicButton
            size="sm"
            fade={0.75}
            color="onSurface"
            backgroundColor="transparent"
            text={props.cancelLabel || "Cancel"}
            onClick={props.onCancelClick}
          />
        </Dialog.ActionTrigger>
        <BasicButton
          async
          size="sm"
          text={props.action.label}
          backgroundColor={color}
          color="white"
          onClick={props.action.onClick}
        />
      </Dialog.Footer>
    </Dialog.Root>
  );
}

export { ConfirmationDialog, type ConfirmationDialogProps };
