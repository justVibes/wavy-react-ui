import { CopyButton, useManagedRef, VerifyTextField } from "@/main";
import { useRef, useState } from "react";
import JsonViewer from "../../high-level/json-viewer/JsonViewer";
import BasicDiv from "../../low-level/html/div/BasicDiv";
import { ErrorMessage, TaskResult } from "@wavy/types";

type JwtVerificationStatus = {
  verified: boolean;
  payload: string;
  error?: ErrorMessage;
};
interface JwtVerifierProps {
  hint?: string;
  defaulValue?: { token: string; status: JwtVerificationStatus };
  onTokenChange?: (token: string) => void;
  onVerifyClick?: (
    token: string
  ) => JwtVerificationStatus | Promise<JwtVerificationStatus>;
}
function JwtVerifier(props: JwtVerifierProps) {
  const tokenRef = useManagedRef(props.defaulValue?.token || "");
  const textfieldRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<JwtVerificationStatus>(
    props.defaulValue?.status
  );

  const handleOnVerifyClick = async (): Promise<TaskResult> => {
    // const verifiedStatus = await window.jwt.verify({
    //   type: props.tokenType,
    //   token: tokenRef.read(),
    // });
    const verifiedStatus = await props.onVerifyClick?.(tokenRef.read());

    setStatus(verifiedStatus);

    if (verifiedStatus.verified) return { response: "success" };
    return { error: verifiedStatus.error! };
  };

  const handleOnTokenChange = (value: string) => {
    tokenRef.upsert(value);
    props.onTokenChange?.(value);
  };
  return (
    <BasicDiv size="full" spill={"hidden"} maxHeight={"full"} gap={"lg"}>
      <VerifyTextField
        allowCopyText
        allowPasteText
        required
        defaultStatus={
          !status ? "pending" : status.verified ? "success" : "error"
        }
        ref={textfieldRef}
        placeholder={props.hint}
        defaultValue={tokenRef.read()}
        onPasteClick={handleOnTokenChange}
        onChange={handleOnTokenChange}
        onVerifyClick={handleOnVerifyClick}
      />
      <BasicDiv size="full" spill={"hidden"} gap={"sm"}>
        {status && <CopyButton textToCopy={status.payload} />}

        <JsonViewer fullSize json={status ? status.payload : undefined} />
      </BasicDiv>
    </BasicDiv>
  );
}

export default JwtVerifier;
export type { JwtVerifierProps, JwtVerificationStatus };
