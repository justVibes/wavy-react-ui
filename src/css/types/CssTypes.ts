type CssBorderOptions = { thickness?: string; color: string };

type CssDisabledCurve = "both" | "left" | "right";
type BorderRadius = `${"top" | "bottom"}-${"left" | "right"}`;
type CssMeasurement = "px" | "rem" | "em";

export type {
  CssMeasurement,
  CssBorderOptions,
  CssDisabledCurve,
  BorderRadius,
};
