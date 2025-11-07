import {
  BasicButton,
  BasicColor,
  definePaymentOption,
  PaymentOptionsDialog,
} from "@/main";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";

interface PaymentOptionsButtonProps {
  disabled?: boolean;
  /**
   * @default "blue"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "white"
   */
  color?: BasicColor;
  /**
   * @default "xs"
   */
  fontSize?: BasicDivProps["fontSize"];
  /**
   * @default "sm"
   */
  iconSize?: BasicButtonProps["iconSize"];
  /**
   * @default "full"
   */
  width?: BasicButtonProps["width"];
  options?: ReturnType<typeof definePaymentOption>[];
  onClick?: () => void;
}
function PaymentOptionsButton(props: PaymentOptionsButtonProps) {
  const button = (
    <BasicButton
      disabled={props.disabled}
      width={props.width}
      backgroundColor={props.backgroundColor || "blue"}
      color={props.color || "white"}
      fontSize={props.fontSize || "xs"}
      iconSize={props.iconSize || "sm"}
      leadingEl={BsCreditCard2FrontFill}
      text="Payment options"
      onClick={props.onClick}
    />
  );

  if (props.options)
    return (
      <PaymentOptionsDialog triggerElement={button} options={props.options} />
    );
  return button;
}

export default PaymentOptionsButton;
