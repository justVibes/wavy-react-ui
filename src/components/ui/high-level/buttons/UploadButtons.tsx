import { BasicButton, BasicColor } from "@/main";
import { HiUpload } from "react-icons/hi";
import BasicFileInput, {
  BasicFileInputProps,
} from "../../low-level/html/input/BasicFileInput";
import { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";
import { SafeOmit } from "@wavy/types";
import { BasicStyleProps } from "../../low-level/html/BasicStyle";

interface UploadFileButtonProps
  extends SafeOmit<
    BasicFileInputProps,
    "children" | keyof BasicStyleProps | "allowDrop"
  > {
  fileClass?: string;
  fontSize?: BasicDivProps["fontSize"];
  width?: BasicDivProps["width"];
  color?: BasicColor;
  borderColor?: BasicColor;
  backgroundColor?: BasicColor;
  hideFileClass?: boolean;
  debug?: boolean;
  iconSize?: BasicButtonProps["iconSize"];
  /**
   * @default "md"
   */
  corners?: BasicButtonProps["corners"];
  /**
   * @default "sm"
   */
  size?: BasicButtonProps["size"];
}
function createButton<Props extends UploadFileButtonProps>(
  defaults?: UploadFileButtonProps
) {
  return (props: Props) => {
    const {
      size,
      fontSize,
      iconSize,
      fileClass,
      backgroundColor,
      accepts = defaults?.accepts,
      ...rest
    } = props || {};

    return (
      <BasicFileInput
        spill={"hidden"}
        corners={props.corners || "md"}
        accepts={accepts}
        {...(rest || {})}
        allowDrop={false}
      >
        <BasicButton
          debug={props.debug}
          disabled={props.disabled}
          width={props.width}
          backgroundColor={backgroundColor}
          corners={props.corners || "md"}
          borderColor={props.borderColor}
          color={props.color}
          variant="outline"
          fontSize={fontSize}
          leadingEl={HiUpload}
          iconSize={iconSize}
          size={size || "sm"}
          text={`Upload ${
            props.hideFileClass ? "" : fileClass || defaults?.fileClass
          }`.trim()}
          style={{ flexShrink: 0 }}
        />
      </BasicFileInput>
    );
  };
}

const UploadButton = createButton({ fileClass: "file" });

const UploadReceiptButton = createButton<
  SafeOmit<UploadFileButtonProps, "accepts" | "fileClass" | "hideFileClass">
>({ fileClass: "receipt", accepts: ["img"] });

export { UploadButton, UploadReceiptButton };
