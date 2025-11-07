import { FileUpload } from "@chakra-ui/react";
import { JSX } from "@emotion/react/jsx-runtime";
import { LOCAL_FILE_MIME_TYPES, LocalFile } from "@wavy/types";
import React from "react";

interface BasicFileUploadRootProps {
  maxFiles?: number;
  multiple?: boolean;
  showList?: boolean;
  maxWidth?: FileUpload.RootProps["maxW"];
  height?: FileUpload.RootProps["height"];
  width?: FileUpload.RootProps["width"];
  accepts: LocalFile["typeAlias"][];
  children: JSX.Element;
  slotProps?: Partial<{
    fileList: FileUpload.ListProps;
  }>;
  onChange?: (files: FileList) => void;
}
function BasicFileUploadRoot(props: BasicFileUploadRootProps) {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.currentTarget.files);
  };
  return (
    <FileUpload.Root
      alignItems="stretch"
      width={props.width}
      maxWidth={props.maxWidth || "xl"}
      maxFiles={props.maxFiles || (props.multiple ? Infinity : 1)}
      overflow={"hidden"}
      height={props.height}
      accept={getAcceptedMimeTypes(props.accepts)}
    >
      <FileUpload.HiddenInput onChange={handleOnChange} />
      {props.children}

      {props.showList && <FileUpload.List {...props.slotProps?.fileList} />}
    </FileUpload.Root>
  );
}

const getAcceptedMimeTypes = (
  categories: BasicFileUploadRootProps["accepts"]
) => {
  return categories.flatMap((category) => LOCAL_FILE_MIME_TYPES[category]);
};


export default BasicFileUploadRoot;
export type { BasicFileUploadRootProps };
