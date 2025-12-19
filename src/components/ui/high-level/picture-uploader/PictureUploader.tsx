import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { IoMdImages } from "react-icons/io";
import { Avatar } from "../../low-level/avatar/Avatar";
import BasicDiv, { BasicDivProps } from "../../low-level/html/div/BasicDiv";
import { JSX } from "@emotion/react/jsx-runtime";
import { BasicSpan } from "@/main";
import { UploadButton } from "../buttons/UploadButtons";
import { FileDetails } from "@wavy/util";

interface PictureUploaderProps {
  fallback?: IconType;
  defaultPicture?: FileDetails 
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
  onChange?: (picture: FileDetails) => void;
}
function PictureUploader(props: PictureUploaderProps) {
  const [avatar, setAvatar] = useState<string>(props.defaultPicture.path);

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

  const handleOnChange = (_: File[], localFiles: FileDetails[]) => {
    const photo = localFiles[0];
    setAvatar(photo.path);
    props.onChange?.(photo);
  };

  return (
    <Wrapper>
      <BasicDiv row gap={props.columnGap || "lg"} align='center'>
        <Avatar
          size={"xl"}
          fallback={props.fallback || IoMdImages}
          src={avatar || null}
        />

        <UploadButton
          fileClass='photo'
          accepts={["img"]}
          getFilePath={props.getFilePath}
          onAccept={handleOnChange}
        />
      </BasicDiv>
    </Wrapper>
  );
}

export default PictureUploader;
