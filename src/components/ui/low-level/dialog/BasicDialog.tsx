import { UseDialogControllerReturn } from "@/components/hooks/useDialogController";
import { BasicColor, BasicDiv, resolveBasicColor, useRerender } from "@/main";
import {
  CloseButton,
  CloseButtonProps,
  Dialog,
  Portal,
  useDialog,
} from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import React, { useState } from "react";
import { BasicDivProps } from "../html/div/BasicDiv";
import applyBasicStyle from "../html/BasicStyle";
import { SafeExtract, SafeOmit } from "@wavy/types";
import { BasicButtonProps } from "../html/button/BasicButton";

interface BasicDialogProps<T = {}>
  extends SafeOmit<
    BasicDivProps,
    | "clickable"
    | "ref"
    | "onClick"
    | "onBlur"
    | "onFocus"
    | "onScroll"
    | "decreaseYFaderPadding"
    | "enableYFaders"
    | "rememberScrollPos"
    | "updateScrollPosDeps"
  > {
  /**
   * @default center
   */
  placement?: "center" | "top" | "bottom";
  children: JSX.Element | JSX.Element[];
  triggerElement?: JSX.Element;
  hideCloseButton?: boolean;
  /**@default "sm" */
  closeButtonSize?: CloseButtonProps["size"];
  /**
   * @default false
   */
  unmountOnExit?: boolean;
  /**
   * @default "slide-in-bottom"
   */
  enterAnimation?: Dialog.RootProps["motionPreset"];
  /**
   * @default "outside"
   */
  scrollBehavior?: Dialog.RootProps["scrollBehavior"];
  controller?: UseDialogControllerReturn<T>;
  /**
   * Whether to close the dialog when the escape key is pressed
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether to close the dialog when the outside is clicked
   * @default true
   */
  closeOnInteractOutside?: boolean;
  rerenderOnClose?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  onClose?: () => void;
}
function BasicDialog<T>(props: BasicDialogProps<T>) {
  const { triggerRerender } = useRerender();
  const style = applyBasicStyle({
    ...props,
    padding: props.padding || "xl",
    corners: props.corners || "md",
    gap: props.gap || "lg",
  });

  const handleOnOpenChange = ({ open }: { open: boolean }) => {
    props.onOpenChange?.(open);
  };
  const handleOnExit = () => {
    props.onClose?.();
    props.rerenderOnClose && triggerRerender();
  };
  return (
    <Dialog.Root
      unmountOnExit={props.unmountOnExit}
      open={props.controller?.isOpen}
      onEscapeKeyDown={
        props.closeOnEscape ?? true ? props.controller?.hide : undefined
      }
      scrollBehavior={props.scrollBehavior}
      onInteractOutside={
        props.closeOnInteractOutside ?? true
          ? props.controller?.hide
          : undefined
      }
      placement={props.placement || "center"}
      closeOnEscape={props.closeOnEscape}
      closeOnInteractOutside={props.closeOnInteractOutside}
      onOpenChange={handleOnOpenChange}
      onExitComplete={handleOnExit}
      motionPreset={props.enterAnimation || "slide-in-bottom"}
    >
      {props.triggerElement && (
        <Dialog.Trigger asChild>{props.triggerElement}</Dialog.Trigger>
      )}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content style={style}>
            {props.children}

            {!props.hideCloseButton && (
              <Dialog.CloseTrigger asChild>
                <CloseButton
                  size={props.closeButtonSize || "sm"}
                  onClick={props.controller?.hide}
                />
              </Dialog.CloseTrigger>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

interface ElementProps
  extends SafeOmit<
    BasicDivProps,
    "ref" | "onClick" | "onBlur" | "onFocus" | "onScroll" | "clickable"
  > {
  children: React.ReactNode;
}
const CompoundElement =
  (
    key: SafeExtract<keyof typeof Dialog, "Header" | "Body" | "Footer">,
    defaultProps?: SafeOmit<ElementProps, "children">
  ) =>
  (props: ElementProps) => {
    const Wrapper = Dialog[key];

    let propsCopy: ElementProps = { ...props, spill: props.spill || "hidden" };

    Object.keys(defaultProps || {}).forEach((key) => {
      const validKey = key as keyof typeof defaultProps;
      if (!propsCopy?.[validKey]) {
        propsCopy = Object.assign(propsCopy, {
          [validKey]: defaultProps[validKey],
        });
      }
    });

    return (
      <Wrapper width={"full"} height={"full"} overflow={"hidden"}>
        <BasicDiv {...propsCopy}>{props.children}</BasicDiv>
      </Wrapper>
    );
  };

BasicDialog.Header = CompoundElement("Header", {
  fontSize: "xl",
  fontWeight: "bold",
});
BasicDialog.Body = CompoundElement("Body", { gap: "md" });
BasicDialog.Footer = CompoundElement("Footer", { row: true, gap: "sm" });
BasicDialog.CloseTrigger = (props: {
  children: JSX.Element;
  wrap?: boolean;
  slotProps?: Partial<{
    divWrapper: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
  }>;
}) => {
  return (
    <Dialog.CloseTrigger asChild>
      {props.wrap ? (
        <div {...props.slotProps?.divWrapper}>{props.children}</div>
      ) : (
        props.children
      )}
    </Dialog.CloseTrigger>
  );
};

BasicDialog.ActionTrigger = (props: { children: JSX.Element }) => {
  return <Dialog.ActionTrigger asChild>{props.children}</Dialog.ActionTrigger>;
};
export default BasicDialog;
export type {BasicDialogProps}