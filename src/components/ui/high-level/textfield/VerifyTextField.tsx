import { useState } from "react";
import { Status, StatusProps } from "../../low-level/status/Status";
import { TextField, TextFieldProps } from "../../low-level/textfield/TextField";
import VerifyButton from "../buttons/VerifyButton";
import ErrorTooltip from "../tooltip/ErrorTooltip";
import { useManagedRef } from "@/main";
import { ErrorMessage, SafeOmit, TaskResult, TaskStatus } from "@wavy/util";

function VerifyTextField(
  props: SafeOmit<
    TextFieldProps,
    | "leadingAdornment"
    | "leadingContent"
    | "trailingAdornment"
    | "trailingContent"
  > & {
    defaultStatus?: TaskStatus;
    verifyError?: ErrorMessage;
    onVerifyClick: () => Promise<TaskResult>;
  }
) {
  const errorRef = useManagedRef<ErrorMessage | undefined>(props?.verifyError);
  const [status, setStatus] = useState<StatusProps["status"]>(
    props?.defaultStatus || "pending"
  );
  const handleOnVerifyClick = async () => {
    const verifyReq = await props.onVerifyClick();

    console.log({ verifyReq });

    if (verifyReq.response) return setStatus("success");

    errorRef.upsert(verifyReq.error);
    setStatus("error");
  };

  return (
    <TextField
      {...props}
      leadingAdornment={
        <ErrorTooltip
          wrapChildren
          asChild={status !== "error"}
          error={errorRef.read()}>
          <Status indicatorSize='.4rem' status={status} />
        </ErrorTooltip>
      }
      trailingContent={<VerifyButton onClick={handleOnVerifyClick} />}
    />
  );
}

export default VerifyTextField;
