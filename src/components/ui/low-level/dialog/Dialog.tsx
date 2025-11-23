import { UseDialogControllerReturn } from "@/components/hooks/useDialogController";
import { BasicDiv, useRerender } from "@/main";
import {
  Dialog as ChakraDialog,
  CloseButton,
  CloseButtonProps,
  Portal,
} from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { SafeExtract, SafeOmit } from "@wavy/types";
import React from "react";
import applyBasicStyle from "../html/BasicStyle";
import { BasicDivProps } from "../html/div/BasicDiv";

// The generic type basically for the dialogController
function Root<T>(props: DialogProps.RootProps<T>) {
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
    props.controller?.hide?.()
    props.rerenderOnClose && triggerRerender();
  };
  return (
    <ChakraDialog.Root
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
        <ChakraDialog.Trigger asChild>
          {props.triggerElement}
        </ChakraDialog.Trigger>
      )}
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content style={style}>
            {props.children}

            {!props.hideCloseButton && (
              <ChakraDialog.CloseTrigger asChild>
                <CloseButton
                  size={props.closeButtonSize || "sm"}
                  onClick={props.controller?.hide}
                />
              </ChakraDialog.CloseTrigger>
            )}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
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
    key: SafeExtract<keyof typeof ChakraDialog, "Header" | "Body" | "Footer">,
    defaultProps?: SafeOmit<ElementProps, "children">
  ) =>
  (props: ElementProps) => {
    const Wrapper = ChakraDialog[key];

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

const Header = CompoundElement("Header", {
  fontSize: "xl",
  fontWeight: "bold",
});
const Body = CompoundElement("Body", { gap: "md" });
const Footer = CompoundElement("Footer", { row: true, gap: "sm" });
const CloseTrigger = (props: {
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
    <ChakraDialog.CloseTrigger asChild>
      {props.wrap ? (
        <div {...props.slotProps?.divWrapper}>{props.children}</div>
      ) : (
        props.children
      )}
    </ChakraDialog.CloseTrigger>
  );
};

const ActionTrigger = (props: { children: JSX.Element }) => {
  return (
    <ChakraDialog.ActionTrigger asChild>
      {props.children}
    </ChakraDialog.ActionTrigger>
  );
};
const Dialog = {
  Root,
  Header,
  Body,
  Footer,
  CloseTrigger,
  ActionTrigger,
};

declare namespace DialogProps {
  interface RootProps<T = {}>
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
    enterAnimation?: ChakraDialog.RootProps["motionPreset"];
    /**
     * @default "outside"
     */
    scrollBehavior?: ChakraDialog.RootProps["scrollBehavior"];
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
}
export { Dialog, type DialogProps };
