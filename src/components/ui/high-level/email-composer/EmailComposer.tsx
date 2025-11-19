import {
  BasicColor,
  CopyButton,
  FontSize,
  resolveBasicColor,
  TaskResultDialog,
  TextField,
  useDialogController,
  useManagedRef,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { strictArray } from "@wavy/fn";
import { Email, SafeOmit, SuccessMessage, TaskResult } from "@wavy/types";
import { useState } from "react";
import { Avatar } from "../../low-level/avatar/Avatar";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import BasicSpan from "../../low-level/html/span/BasicSpan";
import AttachmentsButton from "../buttons/AttachmentsButton";
import SendButton from "../buttons/SendButton";
import { type AttachmentDialogContextType } from "../dialogs/AttachmentsDialog";

const FIELD_SEP_COLOR: BasicColor = "onPaper[0.1]";
const RECIPIENTS_SEP = ", ";

type SendReturnType =
  | void
  | Promise<void>
  | Promise<TaskResult>
  | Promise<TaskResult<SuccessMessage>>;

interface EmailComposerProps<Return extends SendReturnType> {
  /**
   * @default "15rem"
   */
  height?: BasicDivProps["height"];
  /**
   * @default "22rem"
   */
  width?: BasicDivProps["width"];
  readOnly?: boolean;
  recipients?: string[];
  subject?: string;
  body?: string;
  attachments?: Email["attachments"];
  bodyToHtml?: (body: string) => string;
  disableSend?: Return extends
    | Promise<TaskResult>
    | Promise<TaskResult<SuccessMessage>>
    ? boolean | ((result: Awaited<Return>) => boolean)
    : boolean;
  onSendClick?: (email: Email) => Return;
  slotProps?: Partial<{
    taskResultDialog: Partial<{
      disableColorIndicator: boolean;
    }>;
    attachmentsDialog: SafeOmit<AttachmentDialogContextType, "attachments">;
  }>;
}
function EmailComposer<Return extends SendReturnType>(
  props: EmailComposerProps<Return>
) {
  const sendDisabled = useManagedRef(
    typeof props.disableSend === "boolean"
      ? props.disableSend
      : !!props.onSendClick
  );
  const dialogController = useDialogController<TaskResult<SuccessMessage>>();
  const emailRef = useManagedRef({
    subject: props.subject ?? "",
    body: props.body || "",
    recipients: props.recipients?.join?.(RECIPIENTS_SEP) ?? "",
    attachments: props.attachments || [],
  });

  const handleEmailChange = <Key extends keyof Email>(
    key: Key,
    value: ReturnType<(typeof emailRef)["read"]>[Key]
  ) => {
    emailRef.upsert((email) => ({ ...email, [key]: value }));
  };
  const getRecipients = () =>
    strictArray(emailRef.read().recipients.split(RECIPIENTS_SEP));

  const handleOnSendClick = async () => {
    const { subject, body, attachments } = emailRef.read();
    const result = await props.onSendClick({
      subject,
      body: { text: body, html: props.bodyToHtml?.(body) },
      recipients: getRecipients(),
      attachments,
    });

    if (typeof result !== "object") return;

    const { error, response } = result;

    if (typeof props.disableSend === "function")
      sendDisabled.upsert(props.disableSend(result as any));
    if (error) return dialogController.show({ error });
    else if (response !== "success") dialogController.show({ response });
    else {
      dialogController.show({
        response: {
          title: "Successfully sent email!",
          message:
            "Your email was successfully sent to the intended recipients.",
        },
      });
    }
  };
  return (
    <BasicDiv
      height={props.height || "15rem"}
      width={props.width || "22rem"}
      backgroundColor="paper"
      color="onPaper"
      corners={"md"}
      padding={"md"}
      spill={"hidden"}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      }}
    >
      <TaskResultDialog
        unmountOnExit
        disableColorIndicator={
          props.slotProps?.taskResultDialog?.disableColorIndicator
        }
        controller={dialogController}
        indicator={"mail"}
        actionButton={(status) =>
          status === "succes"
            ? undefined
            : TaskResultDialog.tryAgainButton({
                disabled: sendDisabled.read(),
                onClick: handleOnSendClick,
              })
        }
      />
      {props.readOnly && emailRef.read().recipients ? (
        <ReadOnlyRecipients recipients={getRecipients()} />
      ) : (
        <Recipients
          readOnly={props.readOnly}
          recipients={getRecipients()}
          onChange={(value) => handleEmailChange("recipients", value)}
        />
      )}

      <Subject
        subject={emailRef.read().subject}
        readOnly={props.readOnly}
        onChange={(value) => handleEmailChange("subject", value)}
      />

      <BasicDiv size="full" gap={"sm"} spill={"hidden"}>
        <Body
          defaultValue={emailRef.read().body}
          readOnly={props.readOnly}
          onChange={(value) => handleEmailChange("body", value)}
        />
        <BasicDiv
          width="full"
          row
          align="center"
          justify="space-between"
          gap={"md"}
        >
          <AttachmentsButton
            attachments={emailRef.read().attachments}
            corners={"lg"}
            slotProps={{
              attachmentsDialog: {
                ...props.slotProps?.attachmentsDialog,
                unmountOnExit: true,
                uploadDisabled:
                  props.readOnly ||
                  props.slotProps?.attachmentsDialog?.uploadDisabled,
                deleteDisabled:
                  props.readOnly ||
                  props.slotProps?.attachmentsDialog?.deleteDisabled,
              },
            }}
          />
          <SendButton
            size="2xs"
            disabled={sendDisabled.read()}
            onClick={handleOnSendClick}
          />
        </BasicDiv>
      </BasicDiv>
    </BasicDiv>
  );
}

function Recipients(props: {
  recipients: string[];
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const CopyIndicator = (props: { value: string }) => {
    return (
      <BasicSpan
        text={props.value}
        cursor="not-allowed"
        sx={{ ":hover": { textDecoration: "underline" } }}
      />
    );
  };
  return (
    <CustomTextField
      readOnly={props.readOnly}
      placeholder="Recipients"
      defaultValue={props.recipients.join(RECIPIENTS_SEP)}
      onFocus={props.readOnly ? undefined : () => setFocused(true)}
      onBlur={props.readOnly ? undefined : () => setFocused(false)}
      autoFocus={focused}
      leadingContent={
        focused ? <BasicSpan fontSize="xs" text="To:" /> : undefined
      }
      trailingContent={
        <BasicDiv row gap={"sm"} fontSize="xs">
          <CopyIndicator value="Cc" />
          <CopyIndicator value="Bcc" />
        </BasicDiv>
      }
      indent={{ right: "3rem" }}
      onChange={props.onChange}
    />
  );
}

function ReadOnlyRecipients(props: { recipients: string[] }) {
  return (
    <BasicDiv
      width={"full"}
      grid
      gridCols="1fr auto"
      gap={"md"}
      justify="space-between"
      borderColor={[FIELD_SEP_COLOR, "bottom"]}
    >
      <BasicDiv
        row
        width={"full"}
        gap={"md"}
        spill={"hidden"}
        padding={["sm", "bottom"]}
      >
        {props.recipients.map((recipient) => (
          <BasicDiv
            row
            align="center"
            gap={"sm"}
            fontSize="xs"
            color="onPaper"
            borderColor={"onPaper[0.1]"}
            padding={"xs"}
            corners={"xl"}
            spill={"hidden"}
          >
            <Avatar
              size={"2xs"}
              backgroundColor="sendBlue[0.25]"
              color="sendBlue"
            />
            <BasicSpan ellipsis text={recipient} />
          </BasicDiv>
        ))}
      </BasicDiv>
      <Copy textToCopy={props.recipients.join(RECIPIENTS_SEP)} />
    </BasicDiv>
  );
}

function Subject(props: {
  subject: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  const copyVisible = !!(props.readOnly && props.subject);
  return (
    <BasicDiv
      row
      width={"full"}
      gap={"md"}
      justify="space-between"
      align="center"
      padding={["xs", ["top", "bottom"]]}
      asChildren={!copyVisible}
      borderColor={[FIELD_SEP_COLOR, "bottom"]}
    >
      <CustomTextField
        disableSepColor={copyVisible}
        placeholder="Subject"
        defaultValue={props.subject}
        readOnly={props.readOnly}
        onChange={props.onChange}
      />
      {copyVisible && <Copy textToCopy={props.subject} />}
    </BasicDiv>
  );
}

function Body(props: {
  defaultValue: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
}) {
  const copyVisible = !!(props.defaultValue && props.readOnly);
  return (
    <BasicDiv pos="relative" size={"full"} asChildren={!copyVisible}>
      <textarea
        defaultValue={props.defaultValue}
        readOnly={props.readOnly}
        style={{
          position: copyVisible ? "relative" : undefined,
          scrollbarColor: `${resolveBasicColor("onPaper")} transparent`,
          padding: ".6rem",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          outline: "none",
          resize: "none",
          fontSize: FontSize.xs,
          zIndex: 1,
          flexShrink: copyVisible ? 0 : 1,
        }}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {copyVisible && (
        <BasicDiv
          pos="absolute"
          top={"72.5%"}
          left={"85%"}
          style={{ zIndex: 2 }}
        >
          <Copy textToCopy={props.defaultValue} />
        </BasicDiv>
      )}
    </BasicDiv>
  );
}

function CustomTextField(props: {
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  disableSepColor?: boolean;
  leadingContent?: JSX.Element;
  autoFocus?: boolean;
  trailingContent?: JSX.Element;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  indent?: `${number}rem` | Partial<Record<"left" | "right", `${number}rem`>>;
}) {
  return (
    <TextField
      size={"xs"}
      readOnly={props.readOnly}
      corners={0}
      defaultValue={props.defaultValue}
      autoFocus={props.autoFocus}
      focusColor="transparent"
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      indent={props.indent}
      placeholder={props.placeholder}
      leadingContent={props.leadingContent}
      trailingContent={props.trailingContent}
      borderColor={
        props.disableSepColor ? "transparent" : [FIELD_SEP_COLOR, "bottom"]
      }
      onChange={props.onChange}
    />
  );
}

function Copy(props: { textToCopy: string }) {
  return (
    <CopyButton
      iconOnly
      iconSize="xs"
      textToCopy={props.textToCopy}
      backgroundColor="onPaper[0.1]"
      color="onPaper"
      borderColor="onPaper[0.25]"
    />
  );
}

export default EmailComposer;
