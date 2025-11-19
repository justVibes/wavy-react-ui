import { BasicDiv, BasicSelect, BasicSpan } from "@/main";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface DropdownProps<T> {
  defaultValue?: T;
  options: T[];
  onChange?: (option: T) => void;
}

function Dropdown<T extends string>(props: DropdownProps<T>) {
  const [selectedOption, setSelectedOption] = useState(
    props.defaultValue || "-"
  );
  const handleOptionClick = ({ value }: { value: T }) => {
    setSelectedOption(value);
    props.onChange?.(value);
  };

  return (
    <BasicSelect
      wrap
      delay={0}
      maxHeight={"7rem"}
      onOpenChange={console.log}
      isSelected={({ value }) => value === selectedOption}
      options={props.options.map((o) => ({ value: o }))}
      onOptionClick={handleOptionClick}
    >
      <BasicDiv
        row
        clickable
        gap={"sm"}
        padding={"sm"}
        corners={"md"}
        align="center"
        justify="space-between"
        borderColor={"onSurface[0.1]"}
      >
        <BasicSpan text={selectedOption} />
        <IoChevronDown />
      </BasicDiv>
    </BasicSelect>
  );
}

export { Dropdown, type DropdownProps };
