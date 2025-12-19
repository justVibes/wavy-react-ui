import { TextField, TextFieldProps } from "@/main";
import { SafeOmit } from "@wavy/util";
import { CiSearch } from "react-icons/ci";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";

interface SearchTextFieldProps
  extends SafeOmit<TextFieldProps, "leadingContent" | "leadingAdornment"> {
  /**@default "20rem" */
  width?: BasicDivProps["width"];
  /**@default "onSurface[0.1]" */
  backgroundColor?: TextFieldProps["backgroundColor"];
  /**@default "Search..." */
  placeholder?: string;
  /**@default "1.15rem" */
  searchIconSize?: string;
}
function SearchTextField(props: SearchTextFieldProps) {
  return (
    <TextField
      {...props}
      leadingAdornment={null}
      width={props.width || "20rem"}
      backgroundColor={props.backgroundColor || "onSurface[0.1]"}
      leadingContent={<CiSearch size={props.searchIconSize || "1.15rem"} />}
      placeholder={props.placeholder || "Search..."}
    />
  );
}

export default SearchTextField;
