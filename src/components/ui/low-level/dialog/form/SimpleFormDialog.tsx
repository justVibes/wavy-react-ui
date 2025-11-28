import {
  Dialog,
  TextField,
  CancelButton,
  UseModalControlsReturn,
  useManagedRef,
  useRerender,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { useState } from "react";
import { type DialogProps } from "../Dialog";
import { BasicButtonProps } from "../../html/button/BasicButton";
import { BasicDivProps } from "../../html/div/BasicDiv";
import BasicSelect from "../../html/select/BasicSelect";
import { TextFieldProps } from "../../textfield/TextField";
import SaveButton from "../../../high-level/buttons/SaveButton";

interface SimpleFormDialogProps<T extends string> {
  controller?: UseModalControlsReturn;
  title?: string;
  triggerElement?: JSX.Element;
  /**@default "md" */
  closeButtonSize?: DialogProps.RootProps["closeButtonSize"];
  /**@default "2rem"*/
  titleFontSize?: BasicDivProps["fontSize"];
  /**@default "md" */
  textfieldSize?: TextFieldProps["size"];
  /**@default "lg" */
  actionButtionSize?: BasicButtonProps["size"];
  width?: BasicDivProps["width"];
  /**A shortcut for defining the default value for fields where: `<"field">.defaultValue === undefined`.*/
  defaultValue?: Partial<Record<T, string>>;
  fields: Record<
    T,
    {
      /**
       * @default "prop-name" */
      label?: (string & {}) | "prop-name" | ((propName: string) => string);
      placeholder: string;
      disabled?: boolean;
      defaultValue?: string;
      allowedChars?: RegExp;
      options?: string[];
    }
  >;
  /**A shortcut to format the property name for all fields where: `typeof <"field">.label !== "function" && [undefined, "prop-name"].includes(<"field">.label)`
   * - Useful for field's that use `prop-name` as the label.
   */
  formatFieldPropName?: (propName: string) => string;
  /**A shortcut to set the allowed characters for all fields where: `<"field">.allowedChars === undefined`
   */
  allowedChars?: RegExp;
  onSave?: (form: Record<T, string>) => void;
  onCancel?: () => void;
}
function SimpleFormDialog<T extends string>(props: SimpleFormDialogProps<T>) {
  const { triggerRerender } = useRerender();
  const formRef = useManagedRef<Record<T, string>>(
    Object.fromEntries(
      Object.entries(props.fields).map(([key, value]) => {
        return [
          key,
          typeof value === "object" && "defaultValue" in value
            ? value.defaultValue
            : props.defaultValue?.[key as T] ?? "",
        ];
      })
    ) as any
  );
  const actionButtonSize = props.actionButtionSize || "lg";
  const handleOnSaveClick = () => {
    props.onSave?.(formRef.read());
  };
  const handleOnCancelClick = () => {
    props.onCancel?.();
  };

  return (
    <Dialog.Root
      rerenderOnClose
      width={props.width}
      closeButtonSize={props.closeButtonSize || "md"}
      controller={props.controller}
      triggerElement={props.triggerElement}
      onClose={() => triggerRerender()}
    >
      <Dialog.Header fontSize={"2rem"}>
        {props.title || "Edit Form"}
      </Dialog.Header>
      <Dialog.Body padding={"xs"}>
        {Object.keys(props.fields).map((key) => {
          const validKey = key as T;
          const field = props.fields[validKey];
          const defaultValue = formRef.read()?.[validKey] ?? "";
          const label = (() => {
            if (typeof field.label === "function") return field.label(key);
            if (!field.label || field.label === "prop-name")
              return props?.formatFieldPropName?.(key) ?? key;
            return field.label;
          })();

          const handleChange = (value: string) =>
            formRef.upsert((form) => ({
              ...(form || ({} as Record<T, string>)),
              [validKey]: value,
            }));

          if (field.options) {
            return (
              <OptionsField
                key={key}
                label={label}
                size={props.textfieldSize}
                defaultValue={defaultValue}
                disabled={field.disabled}
                placeholder={field.placeholder}
                options={field.options}
                onChange={handleChange}
              />
            );
          }
          return (
            <TextField
              key={validKey}
              width={"full"}
              placeholder={field.placeholder}
              label={label}
              size={props.textfieldSize}
              defaultValue={defaultValue}
              disabled={field.disabled}
              allowedChars={field.allowedChars || props.allowedChars}
              onChange={handleChange}
            />
          );
        })}
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger>
          <CancelButton
            fade={0.5}
            size={actionButtonSize}
            onClick={handleOnCancelClick}
          />
        </Dialog.ActionTrigger>

        <Dialog.ActionTrigger>
          <SaveButton size={actionButtonSize} onClick={handleOnSaveClick} />
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </Dialog.Root>
  );
}

function OptionsField(props: {
  disabled?: boolean;
  defaultValue: string;
  label: string;
  placeholder: string;
  size?: TextFieldProps["size"];
  options: string[];
  onChange: (value: string) => void;
}) {
  const [selectedValue, setSelectedValue] = useState(props.defaultValue);
  const handleOnChange = ({ value }: { value: string }) => {
    props.onChange(value);
    setSelectedValue(value);
  };

  return (
    <BasicSelect
      wrap
      asChild={props.disabled}
      width={"match-anchor"}
      maxHeight={"10rem"}
      isSelected={({ value }) => selectedValue === value}
      options={props.options.map((option) => ({ value: option.trim() }))}
      onOptionClick={handleOnChange}
      slotProps={{ divWrapper: { style: { width: "100%" } } }}
    >
      <TextField
        readOnly
        size={props.size}
        disabled={props.disabled}
        label={props.label}
        width={"full"}
        value={selectedValue}
        placeholder={props.placeholder}
      />
    </BasicSelect>
  );
}

export { SimpleFormDialog, type SimpleFormDialogProps };
