import {
  applyBasicStyle,
  BasicColor,
  BasicDiv,
  BasicStyleProps,
  UseModalControlsReturn,
} from "@/main";
import { Drawer as ChakraDrawer, CloseButton, Portal } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import React, { createContext, useContext } from "react";

const Context = createContext<{ sepColor?: BasicColor }>(null);

function Root<T>(props: DrawerProps.RootProps<T>) {
  const handleClose = () => {
    props.onClose?.();
  };

  if (props.controller?.isOpen === false) return;
  return (
    <Context.Provider value={{ sepColor: props.sepColor || "onSurface[0.1]" }}>
      <ChakraDrawer.Root
        open={props.controller?.isOpen}
        onExitComplete={handleClose}
      >
        {props.triggerElement && (
          <ChakraDrawer.Trigger>{props.triggerElement}</ChakraDrawer.Trigger>
        )}
        <OptionalPortal container={props.container}>
          <ChakraDrawer.Backdrop
            pos={props.container ? "absolute" : undefined}
            boxSize={props.container ? "full" : undefined}
          />
          <ChakraDrawer.Positioner
            pos={props.container ? "absolute" : undefined}
            boxSize={props.container ? "full" : undefined}
          >
            <ChakraDrawer.Content
              style={applyBasicStyle({
                ...props,
                spill: props.spill || "hidden",
                backgroundColor: props.backgroundColor,
                padding: props.padding ?? "md",
              })}
            >
              <ChakraDrawer.CloseTrigger>
                <CloseButton />
              </ChakraDrawer.CloseTrigger>
              {props.children}
            </ChakraDrawer.Content>
          </ChakraDrawer.Positioner>
        </OptionalPortal>
      </ChakraDrawer.Root>
    </Context.Provider>
  );
}

function Sep() {
  const ctx = useContext(Context);
  return (
    <BasicDiv backgroundColor={ctx.sepColor} width={"full"} height={"1px"} />
  );
}

function OptionalPortal(props: {
  container: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}) {
  if (!props.container) return props.children;
  return <Portal container={props.container}>{props.children}</Portal>;
}

const Drawer = {
  Root,
  Header: (props: DrawerProps.HeaderProps) => (
    <ChakraDrawer.Header
      style={applyBasicStyle({ ...props, width: props.width ?? "full" })}
      children={props.children}
    />
  ),
  Body: (props: DrawerProps.BodyProps) => (
    <ChakraDrawer.Body
      style={applyBasicStyle({ ...props, width: props.width ?? "full" })}
      children={props.children}
    />
  ),
  Footer: (props: DrawerProps.FooterProps) => (
    <ChakraDrawer.Footer
      style={applyBasicStyle({ ...props, width: props.width ?? "full" })}
      children={props.children}
    />
  ),
  Sep,
  ActionTrigger: ChakraDrawer.ActionTrigger,
  CloseTrigger: ChakraDrawer.CloseTrigger,
};

declare namespace DrawerProps {
  interface RootProps<T> extends BasicStyleProps {
    /**@default "onSurface[0.1]" */
    sepColor?: BasicColor;
    triggerElement?: JSX.Element;
    controller?: UseModalControlsReturn<T>;
    children: JSX.Element | JSX.Element[];
    /**@default "hidden" */
    spill?: BasicStyleProps["spill"];
    container?: React.RefObject<HTMLDivElement>;
    onClose?: () => void;
  }
  interface HeaderProps extends BasicStyleProps {
    children: React.ReactNode;
    /**@default "full" */
    width?: BasicStyleProps["width"];
  }

  interface BodyProps extends HeaderProps {}

  interface FooterProps extends HeaderProps {}
}

export { Drawer, type DrawerProps };
