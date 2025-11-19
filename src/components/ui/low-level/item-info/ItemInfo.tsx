import { lastIndex } from "@wavy/fn";
import { IconType } from "react-icons";
import { IoAdd } from "react-icons/io5";
import BasicDiv from "../html/div/BasicDiv";
import BasicSpan from "../html/span/BasicSpan";

interface ItemInfoProps {
  item: { title: string; description?: string; icon?: IconType };
  info: string | object | (() => string | object);
}
function ItemInfo(props: ItemInfoProps) {
  const handleOnClick = () => {
    const getInfo = (info: string | object, indent = false) => {
      if (typeof info === "string") return info;

      return Object.entries(info)
        .map(([key, value], i, arr): string => {
          return (
            `${indent ? "   " : ""}${key}: ${
              ![undefined, null, ""].includes(value)
                ? typeof value === "object"
                  ? `{\n ${getInfo(value, true)} \n}`
                  : value
                : null
            }` + (i === lastIndex(arr) ? "" : ",")
          );
        })
        .join("\n");
    };

    alert(
      getInfo(typeof props.info === "function" ? props.info() : props.info)
    );
  };
  return (
    <BasicDiv
      row
      clickable
      width="full"
      align="center"
      justify="space-between"
      corners={"lg"}
      backgroundColor={"surfaceVariant[0.1]"}
      padding={"lg"}
      onClick={handleOnClick}
    >
      <BasicDiv row align="center" gap={"md"}>
        {props.item.icon && (
          <props.item.icon size={"1.5rem"} style={{ borderRadius: "1.5rem" }} />
        )}
        <BasicDiv gap={"sm"}>
          <BasicSpan fontSize=".85rem" text={props.item.title} />
          {props.item.description && (
            <BasicSpan
              fade={0.5}
              fontSize=".75rem"
              text={props.item.description}
            />
          )}
        </BasicDiv>
      </BasicDiv>
      <IoAdd size={"1.25rem"} />
    </BasicDiv>
  );
}

export { ItemInfo, type ItemInfoProps };
