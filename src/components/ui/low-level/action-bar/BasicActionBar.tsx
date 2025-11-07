import { ActionBar, Portal } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicDivProps } from "../html/div/BasicDiv";

interface BasicActionBarProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  closeOnEscape?:boolean;
  closeOnInteractOutside?:boolean;
}
function BasicActionBar(props: BasicActionBarProps) {
  return (
    <ActionBar.Root
      open={props.open}
      onOpenChange={({ open }) => props.onOpenChange(open)}
      closeOnEscape={props.closeOnEscape}
      closeOnInteractOutside={props.closeOnInteractOutside}
    >
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content></ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}

BasicActionBar.Content = (
  props: BasicDivProps & { children: JSX.Element | JSX.Element[] }
) => {
  return <ActionBar.Content></ActionBar.Content>;
};

export default BasicActionBar;
