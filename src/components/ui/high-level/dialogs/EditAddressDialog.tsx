import {
  BasicDialog,
  BasicTextField,
  CancelButton,
  UseDialogControllerReturn,
  useManagedRef,
  useRerender,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { Address } from "@wavy/types";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";
import { BasicTextFieldProps } from "../../low-level/textfield/BasicTextField";
import SaveButton from "../buttons/SaveButton";
import { camelCaseToLetter } from "@wavy/fn";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { BasicDialogProps } from "../../low-level/dialog/BasicDialog";

interface EditAddressDialogProps {
  controller?: UseDialogControllerReturn;
  triggerElement?: JSX.Element;
  defaultAddress?: Address;
  /**@default "md" */
  closeButtonSize?: BasicDialogProps["closeButtonSize"];
  /**@default "2rem"*/
  titleFontSize?: BasicDivProps["fontSize"];
  /**@default "md" */
  textfieldSize?: BasicTextFieldProps["size"];
  /**@default "lg" */
  actionButtionSize?: BasicButtonProps["size"];
  fieldHidden?: (field: keyof Address) => boolean;
  onSave?: (address: Address) => void;
  onCancel?: () => void;
}
function EditAddressDialog(props: EditAddressDialogProps) {
  const { triggerRerender } = useRerender();
  const {
    streetAddress = "",
    city = "",
    parish = "",
    country = "Jamaica",
  } = props.defaultAddress || {};
  const addressRef = useManagedRef<Address>({
    streetAddress,
    city,
    parish,
    country,
  });
  const actionButtonSize = props.actionButtionSize || "lg";

  const handleOnSaveClick = () => {
    props.onSave?.(addressRef.read());
  };
  const handleOnCancelClick = () => {
    props.onCancel?.();
  };
  const addressPlaceholerMapper: Record<keyof Address, string> = {
    streetAddress: "45b waltham park ave.",
    city: "Constant Spring",
    parish: "Kingston",
    country: "Jamaica",
  };
  return (
    <BasicDialog
      rerenderOnClose
      closeButtonSize={props.closeButtonSize || "md"}
      controller={props.controller}
      triggerElement={props.triggerElement}
      onClose={() => triggerRerender()}
    >
      <BasicDialog.Header fontSize={"2rem"}>Edit Address</BasicDialog.Header>
      <BasicDialog.Body padding={"xs"}>
        {Object.keys(addressRef.read()).map((key) => {
          const validKey = key as keyof Address;
          const handleChange = (value: string) =>
            addressRef.upsert((address) => ({ ...address, [validKey]: value }));
          if (props.fieldHidden && props.fieldHidden(validKey)) return;
          return (
            <BasicTextField
              key={validKey}
              width={"full"}
              placeholder={addressPlaceholerMapper[validKey]}
              label={camelCaseToLetter(validKey)}
              size={props.textfieldSize}
              defaultValue={addressRef.read()[validKey]}
              disabled={validKey === "country"}
              allowedChars={/[(a-zA-Z)(0-9)(\-#:.)( )]/}
              onChange={handleChange}
            />
          );
        })}
      </BasicDialog.Body>
      <BasicDialog.Footer>
        <BasicDialog.ActionTrigger>
          <CancelButton
            fade={0.5}
            size={actionButtonSize}
            onClick={handleOnCancelClick}
          />
        </BasicDialog.ActionTrigger>

        <BasicDialog.ActionTrigger>
          <SaveButton size={actionButtonSize} onClick={handleOnSaveClick} />
        </BasicDialog.ActionTrigger>
      </BasicDialog.Footer>
    </BasicDialog>
  );
}

export default EditAddressDialog;
