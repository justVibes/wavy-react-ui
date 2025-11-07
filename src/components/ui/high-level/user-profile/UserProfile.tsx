import { IconButton } from "@chakra-ui/react";
import { IoRemove } from "react-icons/io5";
import BasicAvatar from "../../low-level/avatar/BasicAvatar";
import BasicDiv from "../../low-level/html/div/BasicDiv";
import BasicSpan from "../../low-level/html/span/BasicSpan";

interface UserProfileProps {
  user: { picture?: string; name: string; email: string };
}
function UserProfile(props: UserProfileProps) {
  return (
    <BasicDiv width="full" row align="center" gap={"md"} spill={"hidden"}>
      <BasicAvatar fallback={props.user.name} src={props.user.picture} />
      <BasicDiv
        width="full"
        spill={"hidden"}
        fontSize={".85rem"}
        style={{ lineHeight: "1.1rem" }}
      >
        <BasicSpan ellipsis text={props.user.name} />
        <BasicSpan ellipsis fade={"0.5"} text={props.user.email} />
      </BasicDiv>

      <IconButton variant={"outline"} rounded={"full"} size={"2xs"}>
        <IoRemove />
      </IconButton>
    </BasicDiv>
  );
}

export default UserProfile;
