import React, { useState } from "react";

interface BasicTextareaProps {
  defaultValue?: string;
  /**@default Infinity */
  maxChars?: number;
  value?: string;
  /**@default "none" */
  resize?: boolean | "horizontal" | "vertical" | "none";
  onChange?: (value: string) => void;
}
function BasicTextarea(props: BasicTextareaProps) {
  const [text, setText] = useState(props.defaultValue ?? "");
  const controlled = props.value !== undefined;

  return (
    <textarea
      maxLength={props.maxChars}
      defaultValue={props.defaultValue}
      value={props.value ?? text}
      style={{
        resize:
          !props.resize || props.resize === "none"
            ? "none"
            : typeof props.resize === "boolean"
            ? "both"
            : props.resize,
      }}
      onChange={({ target: { value } }) => {
        props.onChange?.(value);
        if (!controlled) setText(value);
      }}
    />
  );
}

export default BasicTextarea;
