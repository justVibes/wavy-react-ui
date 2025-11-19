import { ActionBar as ChakraActionBar, Portal } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicDivProps } from "../html/div/BasicDiv";

interface ActionBarProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  closeOnEscape?:boolean;
  closeOnInteractOutside?:boolean;
}
function ActionBar(props: ActionBarProps) {
  return (
    <ChakraActionBar.Root
      open={props.open}
      onOpenChange={({ open }) => props.onOpenChange(open)}
      closeOnEscape={props.closeOnEscape}
      closeOnInteractOutside={props.closeOnInteractOutside}
    >
      <Portal>
        <ChakraActionBar.Positioner>
          <ChakraActionBar.Content></ChakraActionBar.Content>
        </ChakraActionBar.Positioner>
      </Portal>
    </ChakraActionBar.Root>
  );
}

ActionBar.Content = (
  props: BasicDivProps & { children: JSX.Element | JSX.Element[] }
) => {
  return <ChakraActionBar.Content></ChakraActionBar.Content>;
};

export default ActionBar;
export type {ActionBarProps}