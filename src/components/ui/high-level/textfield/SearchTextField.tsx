import { TextField } from "@/main";
import { CiSearch } from "react-icons/ci";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";

interface SearchTextFieldProps {
  disabled?: boolean;
  placeholder?: string;
  width?: BasicDivProps["width"];
  defaultValue?: string;
  value?: string;
  allowCopy?: boolean;
  allowPaste?: boolean;
  onEnterKeyPressed?: () => void;
  onChange?: (text: string) => void;
}
function SearchTextField(props: SearchTextFieldProps) {
  return (
    <TextField
      disabled={props.disabled}
      allowCopyText={props.allowCopy}
      allowPasteText={props.allowPaste}
      defaultValue={props.defaultValue}
      value={props.value}
      width={props.width || "20rem"}
      backgroundColor="onSurface[0.1]"
      leadingContent={<CiSearch size={"1.15rem"} />}
      placeholder={props.placeholder || "Search..."}
      onEnterKeyPressed={props.onEnterKeyPressed}
      onChange={props.onChange}
    />
  );
}

export default SearchTextField;
