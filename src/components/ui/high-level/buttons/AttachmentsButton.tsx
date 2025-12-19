import {
  Badge,
  BasicDiv,
  Indicator,
  Tooltip,
  useManagedRef,
  useRerender,
} from "@/main";
import { JSX } from "@emotion/react/jsx-runtime";
import { Email, SafeOmit } from "@wavy/util";
import { BsPaperclip } from "react-icons/bs";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import AttachmentsDialog, {
  AttachmentDialogContextType,
} from "../dialogs/AttachmentsDialog";
import { useEffect } from "react";

interface AttachmentsButtonProps {
  iconOnly?: boolean;
  corners?: BasicDivProps["corners"];
  attachments?: number | Email["attachments"];
  slotProps?: Partial<{
    attachmentsDialog: SafeOmit<AttachmentDialogContextType, "attachments"> & {
      unmountOnExit?: boolean;
    };
  }>;
  onClick?: () => void;
}
function AttachmentsButton(props: AttachmentsButtonProps) {
  const attachmentsRef = useManagedRef(
    Array.isArray(props.attachments) ? props.attachments : []
  );
  const { triggerRerender } = useRerender();
  const handleOnAttachmentsChange = (attachments: Email["attachments"]) => {
    attachmentsRef.upsert(attachments);
  };

  return (
    <Tooltip tooltip='Attachments' placement='right'>
      <Badge
        circleChild
        asChild={!props.attachments}
        badge={
          <Indicator
            content={
              typeof props.attachments === "number"
                ? props.attachments
                : attachmentsRef.read().length
            }
          />
        }>
        <Dialog
          asChild={!Array.isArray(props.attachments)}
          attachments={attachmentsRef.read()}
          onAttachmentsChange={handleOnAttachmentsChange}
          onClose={triggerRerender}
          {...props.slotProps?.attachmentsDialog}>
          <BasicDiv
            row
            gap={"xs"}
            fontSize='xs'
            color='onPaper'
            align='center'
            corners={props.corners || "md"}
            padding={"md"}
            clickable
            backgroundColor='onPaper[0.1]'
            onClick={props.onClick}>
            <BsPaperclip size={"1rem"} />
            {!props.iconOnly && "Attachments"}
          </BasicDiv>
        </Dialog>
      </Badge>
    </Tooltip>
  );
}

function Dialog(
  props: {
    asChild?: boolean;
    children: JSX.Element;
    onAttachmentsChange: (attachments: Email["attachments"]) => void;
    onClose: () => void;
    unmountOnExit?: boolean;
  } & AttachmentDialogContextType
) {
  const {
    asChild,
    children,
    unmountOnExit,
    onAttachmentsChange,
    onClose,
    ...rest
  } = props;

  if (asChild) return children;
  return (
    <AttachmentsDialog
      {...rest}
      unmountOnExit={unmountOnExit}
      triggerElement={children}
      onAttachmentsChange={onAttachmentsChange}
      onClose={onClose}
    />
  );
}

export default AttachmentsButton;
