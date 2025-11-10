import { BasicColor, BasicImg } from "@/main";
import { inferFilename } from "@wavy/fn";
import { TfiReceipt } from "react-icons/tfi";
import BasicCard from "../../low-level/cards/BasicCard";
import DeleteButton from "../buttons/DeleteButton";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";

interface ReceiptCardProps
  extends Partial<
    Record<"width" | `${"max" | "min"}Width`, BasicDivProps["width"]>
  > {
  receiptPath?: string;
  receiptName?: string;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  corners?: BasicDivProps["corners"];
  hideDeleteButton?: boolean;
  indicatorBackgroundColor?: BasicColor;
  deleteButtonSize?: BasicButtonProps["iconSize"];
  /**
   * @default "outlined"
   */
  deleteIconVariant?: "filled" | "outlined";
  onDeleteClick?: () => void;
}
function ReceiptCard(props: ReceiptCardProps) {
  return (
    <BasicCard.Root
      backgroundColor={props.backgroundColor || "onSurface"}
      color={props.color || "surface"}
      width={props.width}
      maxWidth={props.maxWidth}
      minWidth={props.minWidth}
      corners={props.corners || "lg"}
      style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
    >
      <BasicCard.LeadingAddOn
        size="2rem"
        padding={"sm"}
        centerContent
        corners={"md"}
        backgroundColor={props.indicatorBackgroundColor || "surface[0.1]"}
        style={{ flexShrink: 0 }}
      >
        {props.receiptPath ? (
          <BasicImg
            corners={"md"}
            src={props.receiptPath}
            size="full"
            spill={"hidden"}
          />
        ) : (
          <TfiReceipt size={"100%"} />
        )}
      </BasicCard.LeadingAddOn>

      <BasicCard.Content width="full" gap={"xs"}>
        <BasicCard.Label
          value="Your receipt"
          fade={0.75}
          truncateStyle={"ellipsis"}
        />
        <BasicCard.Item
          value={
            props.receiptName ||
            (props.receiptPath ? inferFilename(props.receiptPath) : "unknown")
          }
          truncateStyle={"ellipsis"}
        />
      </BasicCard.Content>

      {!props.hideDeleteButton && (
        <BasicCard.TrailingAddOn>
          <DeleteButton
            iconOnly
            iconVariant={props.deleteIconVariant}
            iconSize={props.deleteButtonSize}
            backgroundColor="transparent"
            color="delete"
            onClick={props.onDeleteClick}
          />
        </BasicCard.TrailingAddOn>
      )}
    </BasicCard.Root>
  );
}

export default ReceiptCard;
