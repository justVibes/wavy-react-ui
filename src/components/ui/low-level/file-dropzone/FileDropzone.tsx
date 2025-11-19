import { Box, FileUpload, Icon } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { BasicColor } from "../html/BasicStyle";
import {
  FileUploadRoot,
  type FileUploadRootProps,
} from "../file-upload-root/FileUploadRoot";
import { JSX } from "@emotion/react/jsx-runtime";
import { resolveBasicColor } from "@/main";
import { SafeOmit } from "@wavy/types";

interface FileDropzoneProps extends SafeOmit<FileUploadRootProps, "children"> {
  backgroundColor?: BasicColor;
  borderColor?: BasicColor;
  color?: BasicColor;
  content?: JSX.Element;
}
function FileDropzone(props: FileDropzoneProps) {
  return (
    <FileUploadRoot {...props}>
      <FileUpload.Dropzone
        borderRadius={"xl"}
        height={"full"}
        width={"full"}
        overflow={"hidden"}
        backgroundColor={resolveBasicColor(
          props.backgroundColor || "transparent"
        )}
        borderColor={resolveBasicColor(props.borderColor || "outlineVariant")}
        color={resolveBasicColor(props.color || "onSurface")}
        cursor={"pointer"}
      >
        <Icon size="md" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUpload.DropzoneContent maxHeight={"100%"} overflow={"hidden"}>
          {props.content || (
            <>
              <Box>Drag and drop files here</Box>
              <Box color="fg.muted">.png, .jpg up to 5MB</Box>
            </>
          )}
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
    </FileUploadRoot>
  );
}

export { FileDropzone, type FileDropzoneProps };
