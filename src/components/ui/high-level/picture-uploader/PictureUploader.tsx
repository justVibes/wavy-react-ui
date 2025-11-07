import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoMdImages } from "react-icons/io";
import BasicAvatar from "../../low-level/avatar/BasicAvatar";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicSpan } from "@/main";
import { UploadButton } from "../buttons/UploadButtons";
import { LocalFile, SanitizeFile } from "@wavy/types";

interface PictureUploaderProps {
  fallback?: IconType;
  defaultPicture?: LocalFile | SanitizeFile<LocalFile>;
  label?: string;
  columnGap?: BasicDivProps["gap"];
  rowGap?: BasicDivProps["gap"];
  slotProps?: Partial<{
    label: Partial<{
      fontSize: BasicDivProps["fontSize"];
      fontWeight: BasicDivProps["fontWeight"];
      fade: BasicDivProps["fade"];
    }>;
  }>;
  getFilePath?: (file: File) => string;
  onChange?: (picture: LocalFile) => void;
}
function PictureUploader(props: PictureUploaderProps) {
  const [avatar, setAvatar] = useState<string>(props.defaultPicture?.path);

  useEffect(() => {
    console.log(avatar);
  }, [avatar]);

  const Wrapper = ({ children }: { children: JSX.Element }) => {
    if (!props.label) return children;
    return (
      <BasicDiv gap={props.rowGap || "md"}>
        <BasicSpan
          fontSize={props.slotProps?.label?.fontSize || "sm"}
          fontWeight={props.slotProps?.label?.fontWeight || "bold"}
          fade={props.slotProps?.label?.fade || 0.75}
          text={props.label}
        />
        {children}
      </BasicDiv>
    );
  };

  const handleOnChange = (_: File[], localFiles: LocalFile[]) => {
    const photo = localFiles[0];
    setAvatar(photo.path);
    props.onChange?.(photo);
  };

  return (
    <Wrapper>
      <BasicDiv row gap={props.columnGap || "lg"} align="center">
        <BasicAvatar
          size={"xl"}
          fallback={props.fallback || IoMdImages}
          src={avatar || null}
        />

        <UploadButton
          fileClass="photo"
          accepts={["img"]}
          getFilePath={props.getFilePath}
          onAccept={handleOnChange}
        />
      </BasicDiv>
    </Wrapper>
  );
}

export default PictureUploader;
