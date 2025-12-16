import { IconButton } from "@chakra-ui/react";
import { IoRemove } from "react-icons/io5";
import { Avatar, AvatarProps } from "../../low-level/avatar/Avatar";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import BasicSpan, { BasicSpanProps } from "../../low-level/html/span/BasicSpan";
import { Name } from "@wavy/types";
import { format } from "@wavy/fn";
import { BasicColor, FontSize } from "@/main";

interface UserProfileProps {
  fullWidth?: boolean;
  picture?: string;
  name: Name;
  email: string;
  gap?: BasicDivProps["gap"];
  rowGap?: BasicDivProps["gap"];
  /**@default "md" */
  columnGap?: BasicDivProps["gap"];
  trailingEl?: React.ReactElement;
  style?: BasicDivProps["style"];
  slotProps?: Partial<
    {
      avatar: Partial<{
        backgroundColor?: BasicColor;
        color?: BasicColor;
        size: AvatarProps["size"] | (string & {});
      }>;
    } & Record<
      "name" | "email",
      Partial<{
        /**@default ".85rem" */
        fontSize?: BasicSpanProps["fontSize"];
        fontWeight?: BasicSpanProps["fontWeight"];
        fade?: BasicSpanProps["fade"];
        lineHeight?: keyof typeof FontSize | (string & {});
      }>
    >
  >;
}
function UserProfile(props: UserProfileProps) {
  const name = format("name", props.name);
  const Text = ({
    value,
    default: def = {},
  }: {
    value: "name" | "email";
    default?: Partial<UserProfileProps["slotProps"]["name"]>;
  }) => {
    const {
      fade = def.fade,
      fontSize = def.fontSize || ".85rem",
      fontWeight = def.fontWeight,
      lineHeight = (def.lineHeight = fontSize),
    } = props.slotProps?.[value] || {};

    return (
      <BasicSpan
        ellipsis
        fade={fade}
        fontSize={fontSize}
        fontWeight={fontWeight}
        text={value === "name" ? name : props.email}
        style={{
          lineHeight:
            lineHeight in FontSize
              ? FontSize[lineHeight as keyof typeof FontSize]
              : lineHeight,
        }}
      />
    );
  };

  return (
    <BasicDiv
      row
      align='center'
      spill={"hidden"}
      gap={props.columnGap ?? props.gap ?? "md"}
      width={props.fullWidth ? "full" : undefined}
      style={props.style}>
      <Avatar
        //@ts-expect-error
        size={props.slotProps?.avatar?.size}
        fallback={name}
        src={props.picture}
        backgroundColor={props.slotProps?.avatar?.backgroundColor}
        color={props.slotProps?.avatar?.color}
      />
      <BasicDiv gap={props.rowGap ?? props.gap} width='full' spill={"hidden"}>
        <Text value={"name"} />
        <Text value={"email"} default={{ fade: 0.5 }} />
      </BasicDiv>

      {props.trailingEl}
    </BasicDiv>
  );
}

UserProfile.RemoveButton = (props: { onClick?: () => void }) => (
  <IconButton
    variant={"outline"}
    rounded={"full"}
    size={"2xs"}
    onClick={props.onClick}>
    <IoRemove />
  </IconButton>
);

export default UserProfile;
