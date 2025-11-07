import React from "react";

interface BasicHtmlElementCoreProps<El extends HTMLElement>
  extends Partial<Pick<HTMLElement, "className" | "id" | "popover">> {
  ref?: React.Ref<El>;
  onClick?: React.MouseEventHandler<El>;
  onDoubleClick?: React.MouseEventHandler<El>;
  onBlur?: React.FocusEventHandler<El>;
  onFocus?: React.FocusEventHandler<El>;
  popoverTarget?: string;
}

const applyCoreHTMLProps = <El extends HTMLElement>(
  props: BasicHtmlElementCoreProps<El>
) => {
  const propKeys = Object.keys({
    id: 0,
    onBlur: 0,
    onFocus: 0,
    onClick: 0,
    className: 0,
    onDoubleClick: 0,
    ref: 0,
    popoverTarget: 0,
    popover: 0,
  } satisfies Record<keyof BasicHtmlElementCoreProps<El>, 0>) as (keyof BasicHtmlElementCoreProps<El>)[];
  const definedKeys = propKeys.filter((key) => key in props);

  return Object.fromEntries(definedKeys.map((key) => [key, props[key]]));
};

export type { BasicHtmlElementCoreProps };
export { applyCoreHTMLProps };
