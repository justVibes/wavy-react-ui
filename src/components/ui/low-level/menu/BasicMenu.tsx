import { BasicColor, BasicDiv, resolveBasicColor, InlineCss } from "@/main";
import {
  Box,
  Menu,
  MenuItemProps,
  MenuRootProps,
  Portal,
} from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import React, { createContext, useContext } from "react";
import applyBasicStyle, { HtmlElementDim } from "../html/BasicStyle";
import { LuChevronRight } from "react-icons/lu";
import { BasicDivProps } from "../html/div/BasicDiv";
import { SafeOmit } from "@wavy/types";

const Context = createContext<{
  placement: MenuRootProps["positioning"]["placement"];
  color: BasicColor;
  onItemClick: BasicMenuProps<string>["onItemClick"];
}>(null);

type BasicMenuPlacement = MenuRootProps["positioning"]["placement"];

interface BasicMenuProps<Item extends string>
  extends Partial<
    Record<
      `${"max" | "min"}${"Height" | "Width"}` | "height" | "width",
      HtmlElementDim | 0
    >
  > {
  inDialog?: boolean;
  /**
   * @default "right-start"
   */
  placement?: BasicMenuPlacement;
  /**
   * @default "onSurface"
   */
  color?: BasicColor;
  /**
   * @default "surface"
   */
  backgroundColor?: BasicColor;
  wrapTrigger?: boolean;

  // children: JSX.Element[] | JSX.Element;
  children: JSX.Element;
  gutter?: number;
  items: MenuItems<Item>;
  /**@default "xs" */
  gap?: BasicDivProps["gap"];
  onItemClick?: (item: Item) => void;
  slotProps?: Partial<{
    divWrapper: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >;
  }>;
}
function BasicMenu<Item extends string>(props: BasicMenuProps<Item>) {
  const backgroundColor: BasicColor =
    props.backgroundColor || "surfaceContainer";
  const color: BasicColor = props.color || "onSurface";

  const placement: BasicMenuProps<Item>["placement"] =
    props.placement || "right-start";
  return (
    <Context.Provider
      value={{
        color,
        placement,
        onItemClick: props.onItemClick,
      }}
    >
      <Menu.Root positioning={{ placement, hideWhenDetached: true }}>
        <Menu.Trigger asChild>
          {props.wrapTrigger ? (
            <div {...props.slotProps?.divWrapper}>{props.children}</div>
          ) : (
            props.children
          )}
        </Menu.Trigger>
        <OptionalPortal>
          <Menu.Positioner>
            <Menu.Content
              h={props.height}
              w={props.width}
              maxH={props.maxHeight}
              maxW={props.maxWidth}
              minH={props.minHeight}
              minW={props.minWidth}
              backgroundColor={resolveBasicColor(backgroundColor)}
              color={resolveBasicColor(color)}
              style={applyBasicStyle({
                gap: props.gap || "xs",
                padding: ".5rem",
                corners: "md",
              })}
            >
              {Object.keys(props.items).map((key) => {
                const item = props.items[key as Item];

                if (item.subMenu)
                  return (
                    <BasicMenu
                      {...props}
                      gutter={(props.gutter || 0) + 2}
                      items={item.subMenu}
                      wrapTrigger={false}
                    >
                      <MenuItem isTrigger value={key} />
                    </BasicMenu>
                  );
                return <MenuItem {...item} value={key} />;
              })}
            </Menu.Content>
          </Menu.Positioner>
        </OptionalPortal>
      </Menu.Root>
    </Context.Provider>
  );
}
function OptionalPortal(props: { asChild?: boolean; children: JSX.Element }) {
  if (props.asChild) return props.children;
  return <Portal>{props.children}</Portal>;
}

type MenuItems<Key extends string = string> = Record<
  Key,
  (
    | {
        leadingEl?: JSX.Element;
        trailingEl?: JSX.Element | { command: string };
        sx?: Partial<
          Record<
            `:${"hover" | "active"}`,
            Partial<Record<"backgroundColor" | "color", BasicColor>>
          >
        >;
        onClick?: (item: string) => void;
        backgroundColor?: BasicColor;
        color?: BasicColor;
        subMenu?: never;
      }
    | {
        leadingEl?: never;
        trailingEl?: never;
        sx?: never;
        onClick?: never;
        backgroundColor?: never;
        color?: never;
        subMenu: MenuItems;
      }
  ) & {
    disabled?: boolean;
  }
>;

function MenuItem(
  props: MenuItems[string] & { isTrigger?: boolean; value: string }
) {
  const { color, onItemClick } = useContext(Context);

  const TrailingEl = () => {
    if (!props.trailingEl) return;
    if ("command" in props.trailingEl)
      return <Menu.ItemCommand>{props.trailingEl.command}</Menu.ItemCommand>;
    return props.trailingEl;
  };
  const handleOnClick = () => {
    props.onClick?.(props.value);
    onItemClick?.(props.value);
  };

  const {
    backgroundColor: sxBackgroundColor = "onSurface[0.1]",
    color: sxColor,
  } = props.sx?.[":hover"] || {};
  const defaults = {
    disabled: props.disabled,
    backgroundColor: resolveBasicColor(props.backgroundColor || "transparent"),
    color: resolveBasicColor(props.color || color),
    padding: ".25rem",
    borderRadius: ".35rem",
    cursor: "pointer",
    _hover: {
      transition: "all 200ms linear",
      backgroundColor: resolveBasicColor(sxBackgroundColor),
      color: sxColor ? resolveBasicColor(sxColor) : undefined,
    },
    _active: props.sx?.[":active"]
      ? {
          ...(applyBasicStyle({ ...props.sx[":active"] }) as object),
          transition: "all 200ms linear",
        }
      : undefined,
    onClick: handleOnClick,
  } satisfies Partial<MenuItemProps>;

  if (props.isTrigger)
    return (
      <Menu.TriggerItem
        {...defaults}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {props.value} <LuChevronRight />
      </Menu.TriggerItem>
    );
  return (
    <Menu.Item {...defaults} value={props.value}>
      {props.leadingEl}
      <BasicDiv
        style={{ flexGrow: 1 }}
        asChildren={!props.leadingEl && !props.trailingEl}
      >
        {props.value}
      </BasicDiv>
      {<TrailingEl />}
    </Menu.Item>
  );
}
// BasicMenu.Item = (props: {
//   /**
//    * @description This is required if there are other items in the menu with the same value
//    */
//   uid?: string;
//   leadingEl?: JSX.Element;
//   trailingEl?: JSX.Element;
//   value: string;
//   cmd?: string;
//   color?: BasicColor;
//   backgroundColor?: BasicColor;
//   sx?: Partial<
//     Record<
//       `:${"hover" | "active"}`,
//       Partial<Record<"backgroundColor" | "color", BasicColor>>
//     >
//   >;
//   onClick?: () => void;
// }) => {
//   const { color, onItemClick } = useContext(Context);

//   const handleOnClick = () => {
//     onItemClick?.({ uid: props.uid, value: props.value });
//     props.onClick?.();
//   };

//   return (
//     <Menu.Item
//       value={props.uid || props.value}
//       backgroundColor={resolveBasicColor(
//         props.backgroundColor || "transparent"
//       )}
//       color={resolveBasicColor(color || props.color)}
//       padding={".5rem"}
//       borderRadius={".5rem"}
//       _hover={
//         props.sx?.[":hover"]
//           ? { ...(basicHtmlElementStyle({ ...props.sx[":hover"] }) as object) }
//           : undefined
//       }
//       _active={
//         props.sx?.[":active"]
//           ? { ...(basicHtmlElementStyle({ ...props.sx[":active"] }) as object) }
//           : undefined
//       }
//       onClick={handleOnClick}
//     >
//       {props.leadingEl}
//       <Box
//         flex={"1"}
//         // asChild={!props.leadingEl && !props.cmd && !props.trailingEl}
//       >
//         {props.value}
//       </Box>
//       {props.cmd && <Menu.ItemCommand>{props.cmd}</Menu.ItemCommand>}
//       {/* {props.trailingEl} */}
//     </Menu.Item>
//   );
// };

// BasicMenu.ItemGroup = (props: {
//   groupName?: string;
//   hideSeparator?: boolean;
//   children: JSX.Element[];
// }) => {
//   return (
//     <>
//       <Menu.ItemGroup>
//         {props.groupName && (
//           <Menu.ItemGroupLabel>{props.groupName}</Menu.ItemGroupLabel>
//         )}
//         {props.children}
//       </Menu.ItemGroup>
//       {!props.hideSeparator && <Menu.Separator />}
//     </>
//   );
// };

// BasicMenu.SubMenu = (props: { value: string; children: JSX.Element[] }) => {
//   const { placement, color } = useContext(Context);
//   return (
//     <Menu.Root positioning={{ placement, gutter: 2 }}>
//       <Menu.TriggerItem color={resolveBasicColor(color)}>
//         {props.value} <LuChevronRight />
//       </Menu.TriggerItem>
//       <Portal>
//         <Menu.Positioner>
//           <Menu.Content>{props.children}</Menu.Content>
//         </Menu.Positioner>
//       </Portal>
//     </Menu.Root>
//   );
// };

export default BasicMenu;
export type { BasicMenuPlacement };
