import { useState } from "react";
import BasicStatus, {
  BasicStatusProps,
} from "../../low-level/status/BasicStatus";
import BasicTextField, {
  BasicTextFieldProps,
} from "../../low-level/textfield/BasicTextField";
import VerifyButton from "../buttons/VerifyButton";
import ErrorTooltip from "../tooltip/ErrorTooltip";
import { useManagedRef } from "@/main";
import {
  ErrorMessage,
  SafeOmit,
  TaskResult,
  TaskResultStatus,
} from "@wavy/types";

function VerifyTextField(
  props: SafeOmit<
    BasicTextFieldProps,
    | "leadingAdornment"
    | "leadingContent"
    | "trailingAdornment"
    | "trailingContent"
  > & {
    defaultStatus?: TaskResultStatus;
    verifyError?: ErrorMessage;
    onVerifyClick: () => Promise<TaskResult>;
  }
) {
  const errorRef = useManagedRef<ErrorMessage | undefined>(props?.verifyError);
  const [status, setStatus] = useState<BasicStatusProps["status"]>(
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
    <BasicTextField
      {...props}
      leadingAdornment={
        <ErrorTooltip
          wrapChildren
          asChild={status !== "error"}
          error={errorRef.read()}
        >
          <BasicStatus indicatorSize=".4rem" status={status} />
        </ErrorTooltip>
      }
      trailingContent={<VerifyButton onClick={handleOnVerifyClick} />}
    />
  );
}

export default VerifyTextField;
