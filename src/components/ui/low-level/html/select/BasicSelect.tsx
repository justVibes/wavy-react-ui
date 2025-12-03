import { Popover, usePopoverContext, useRerender } from "@/main";
import { SafeOmit } from "@wavy/types";
import { createContext, useContext, useEffect, useState } from "react";
import { PopoverProps } from "../../popover/Popover";
import BasicDiv, { BasicDivProps } from "../div/BasicDiv";
import BasicOption from "../option/BasicOption";
import { JSX } from "@emotion/react/jsx-runtime";

type OptionConfig<T = string | number> = {
  leadingEl?: React.ReactElement;
  trailingEl?: React.ReactElement;
  value: T;
  disabled?: boolean;
  onClick?: () => void;
};

const Context = createContext<
  | Pick<BasicSelectProps<unknown>, "gap" | "onOptionClick" | "isSelected"> & {
      options: OptionConfig[];
    }
>(null);

interface BasicSelectProps<T>
  extends SafeOmit<
    PopoverProps,
    "displayAction" | "content" | "placement" | "allowInteractions"
  > {
  isSelected?: (option: OptionConfig<T>) => boolean;
  options: (OptionConfig<T> | T)[];

  defaultLeadingEl?: React.ReactElement;
  defaultTrailingEl?: React.ReactElement;
  /**@default "md" */
  corners?: BasicDivProps["corners"];
  /**@default "md" */
  padding?: BasicDivProps["padding"];
  /**@default "sm" */
  gap?: BasicDivProps["gap"];
  onOptionClick?: (
    option: OptionConfig<T>,
    index: number,
    options: OptionConfig<T>[]
  ) => void;
}
function BasicSelect<T extends string | number>(props: BasicSelectProps<T>) {
  return (
    <Context.Provider
      value={{
        ...props,
        options: props.options.map(
          (opt): OptionConfig =>
            typeof opt === "string" || typeof opt === "number"
              ? {
                  value: opt.toString(),
                  leadingEl: props.defaultLeadingEl,
                  trailingEl: props.defaultTrailingEl,
                }
              : {
                  ...opt,
                  leadingEl: opt.leadingEl || props.defaultLeadingEl,
                  trailingEl: opt.trailingEl || props.defaultTrailingEl,
                }
        ),
      }}
    >
      <Popover
        {...props}
        backdropBlur={props.backdropBlur}
        padding={props.padding || "md"}
        corners={props.corners || "md"}
        displayAction="click"
        content={<PopoverContent />}
      />
    </Context.Provider>
  );
}

function PopoverContent() {
  const ctx = useContext(Context),
    popoverCtx = usePopoverContext(),
    [selectedIndex, setSelectedIndex] = useState(
      ctx.isSelected
        ? ctx.options.findIndex((o) => ctx.isSelected(o))
        : undefined
    ),
    { triggerRerender } = useRerender();

  // An attemp to trigger the selected option to scroll into view
  useEffect(() => {
    setTimeout(() => {
      triggerRerender();
    }, 10);
  }, []);

  return (
    <BasicDiv spill={"auto"} gap={ctx.gap || "sm"}>
      {ctx.options.map((option, i) => {
        const selected = i === selectedIndex;
        const handleOnClick = () => {
          option.onClick?.();
          ctx.onOptionClick?.(option, i, ctx.options);
          setSelectedIndex(i);
          popoverCtx.close();
        };
        if (!option || !option?.value)
          console.error(`Index ${i} is not defined in ${ctx.options.join()}`);

        return (
          <BasicOption
            key={i}
            leadingEl={option.leadingEl}
            trailingEl={option.trailingEl}
            value={option?.value.toString()}
            disabled={option?.disabled}
            selected={selected}
            onClick={handleOnClick}
          />
        );
      })}
    </BasicDiv>
  );
}

export default BasicSelect;
