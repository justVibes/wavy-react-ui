import { BasicColor, BasicDiv, BasicSpan, tiledBackground } from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { format } from "@wavy/fn";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { NoUndefinedField } from "@wavy/types";

interface MoneyDisplayCardProps {
  label?: string;
  truncateFee?: boolean | ((fee: number) => boolean);
  amount: number;
  /**
   * @default "JMD"
   */
  currency?: "JMD" | "USD" | "EUR";
  width?: BasicDivProps["width"];
  /**
   * @default "onSurface"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "surface"
   */
  color?: BasicColor;
  /**
   * @default "surface[0.25]"
   */
  wireColor?: BasicColor;
  /**
   * @default "lg"
   */
  corners?: BasicDivProps["corners"];
  /**
   * @default "md"
   */
  gap?: BasicDivProps["gap"];
  slotProps?: Partial<
    Record<
      "label" | "fee" | "currency",
      Partial<{ fontSize: BasicDivProps["fontSize"] }>
    >
  >;
  children?: JSX.Element | JSX.Element[];
}
function MoneyDisplayCard(props: MoneyDisplayCardProps) {
  const boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";

  const currency: NoUndefinedField<MoneyDisplayCardProps["currency"]> =
    props.currency || "JMD";

  return (
    <BasicDiv
      width={props.width}
      gap={props.gap || "md"}
      padding={"1.5rem"}
      color={props.color || "surface"}
      corners={props.corners || "lg"}
      style={{
        boxShadow,
        background: tiledBackground({
          backgroundColor: props.backgroundColor || "onSurface",
          borderColor: props.wireColor || "surface[0.25]",
          tileSize: "1.5rem",
        }),
      }}
    >
      <BasicDiv gap={"sm"} color="inherit">
        {props.label && (
          <BasicSpan
            fade={0.75}
            fontSize={props.slotProps?.label?.fontSize || "sm"}
            text={props.label}
            color="inherit"
          />
        )}
        <BasicDiv row align="end" gap={"sm"}>
          <BasicSpan
            fontWeight="bold"
            fontSize={props.slotProps?.fee?.fontSize || "xl"}
            text={format("money", props.amount, {
              truncate:
                typeof props.truncateFee === "boolean"
                  ? props.truncateFee
                  : props.truncateFee?.(props.amount),
            })}
          />
          <BasicSpan
            fontWeight="bold"
            fade={0.5}
            fontSize={props.slotProps?.currency?.fontSize || "sm"}
            text={currency}
          />
        </BasicDiv>
      </BasicDiv>

      {props.children}
    </BasicDiv>
  );
}

export default MoneyDisplayCard;
