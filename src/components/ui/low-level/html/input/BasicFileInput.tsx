import { JSX } from "@emotion/react/jsx-runtime";
import {
  distinct,
  getMimeTypes,
  isEmpty,
  strictArray,
  toObject,
} from "@wavy/fn";
import {
  KnownFileTypeAlias,
  LOCAL_FILE_TYPE_ALIAS,
  LocalFile,
} from "@wavy/types";
import React, { useRef } from "react";
import applyBasicStyle, { BasicHtmlElementStyleProps } from "../BasicStyle";

interface BasicFileInputProps
  extends BasicHtmlElementStyleProps {
  allowDrop?: boolean;
  fileClass?: string;
  /**
   * @default 1
   */
  maxFiles?: number;
  /**
   * Sets the 'maxFiles' property to Infinity
   */
  multiple?: boolean;
  accepts?: KnownFileTypeAlias[] | KnownFileTypeAlias;
  children?: JSX.Element;
  disabled?: boolean;
  getFilePath?: (file: File) => string;
  onAccept?: (files: File[], localFiles: LocalFile[]) => void;
  onReject?: (files: File[], localFiles: LocalFile[]) => void;
}
function BasicFileInput(props: BasicFileInputProps) {
  const acceptedMimeTypes = getMimeTypes(
    distinct(
      strictArray(
        !props.accepts
          ? [...LOCAL_FILE_TYPE_ALIAS].filter((alias) => alias !== "unknown")
          : Array.isArray(props.accepts)
          ? props.accepts
          : [props.accepts]
      )
    )
  );
  const maxFiles = props.multiple ? Infinity : props.maxFiles ?? 1;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (
    ...args:
      | [files: FileList | File[]]
      | [event: React.ChangeEvent<HTMLInputElement>]
  ) => {
    if (props.disabled) return;

    const files = "target" in args[0] ? args[0].target.files : args[0];
    const acceptedFiles: File[] = [];
    const rejectedFiles: File[] = [];
    const toLocal = (files: File[]) =>
      strictArray(files).map((file) =>
        toObject(file, {
          uploadDate: "now",
          filepath: props.getFilePath?.(file),
        })
      );

    for (const file of files) {
      if (acceptedFiles.length + rejectedFiles.length >= maxFiles) break;

      if (acceptedMimeTypes.includes(file.type)) acceptedFiles.push(file);
      else rejectedFiles.push(file);
    }

    if (!isEmpty(acceptedFiles))
      props.onAccept?.(acceptedFiles, toLocal(acceptedFiles));
    if (!isEmpty(rejectedFiles))
      props.onReject?.(rejectedFiles, toLocal(rejectedFiles));
  };
  const handleOnDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    if (!props.allowDrop || props.disabled) return;
    let files: File[] = [];

    if (e.dataTransfer.items) {
      files = [...e.dataTransfer.items]
        .filter((item) => item.kind === "file")
        .map((file) => file.getAsFile());
    } else {
      files = [...e.dataTransfer.files];
    }

    if (!isEmpty(files)) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));

      handleOnChange(files);
    }
  };
  const triggerInputClick = () => {
    if (props.disabled) return;

    inputRef.current.click();
  };

  return (
    <label
      className={props.className}
      style={{
        ...applyBasicStyle(props),
        userSelect: props.disableSelection ? "none" : undefined,
        cursor: "pointer",
      }}
      onDrop={handleOnDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={triggerInputClick}
    >
      {props.children}
      <input
        id="file"
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleOnChange}
        accept={acceptedMimeTypes.join(", ")}
        multiple={props.multiple}
      />
    </label>
  );
}

export default BasicFileInput;
export type { BasicFileInputProps };
