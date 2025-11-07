import { BasicColor } from "@/main";
import { copyToClipboard, readClipboardText } from "@wavy/fn";
import { Prettify, TaskResult } from "@wavy/types";
import { useState } from "react";
import { IconType } from "react-icons";
import { ImPaste } from "react-icons/im";
import { IoCheckmark, IoCopyOutline } from "react-icons/io5";
import BasicButton, {
  BasicButtonProps,
} from "../../low-level/html/button/BasicButton";

interface ButtonProps {
  iconOnly?: boolean;
  /**
   * @default "onSurface[0.25]"
   */
  borderColor?: BasicColor;
  /**
   * @default "onSurface[0.1]"
   */
  backgroundColor?: BasicColor;
  /**
   * @default "onSurface"
   */
  color?: BasicColor;
  /**
   * @default "xs"
   */
  size?: BasicButtonProps["size"];
  iconSize?: BasicButtonProps["iconSize"];
  padding?: BasicButtonProps["padding"];
  fontSize?: BasicButtonProps["fontSize"];
}

function createButton<P>(options: {
  actionIcon: IconType;
  label: (actionComplete: boolean) => string;
  handleOnClick: (props: P) => Promise<TaskResult>;
}) {
  return (props: Prettify<ButtonProps & P>) => {
    const [completed, setCompleted] = useState(false);

    return (
      <BasicButton
        borderColor={props.borderColor || "onSurface[0.25]"}
        backgroundColor={props.backgroundColor || "onSurface[0.1]"}
        color={props.color || "onSurface"}
        size={props.size || "xs"}
        fontSize={props.fontSize}
        iconSize={props.iconSize}
        backdropBlur=".1rem"
        leadingEl={completed ? IoCheckmark : options.actionIcon}
        text={props.iconOnly ? undefined : options.label(completed)}
        onClick={async () => {
          if (completed) return;
          const { error } = await options.handleOnClick(props);
          if (error)
            return console.error(new Error(error.message, { cause: error }));

          setCompleted(true);
          setTimeout(() => setCompleted(false), 3_000);
        }}
      />
    );
  };
}

interface PasteButtonProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onClick?: (textToPaste: string) => void;
}
const PasteButton = createButton<PasteButtonProps>({
  actionIcon: ImPaste,
  label: (complete) => (complete ? "Pasted!" : "Paste"),
  handleOnClick: async ({ inputRef, onClick }) => {
    const { error, response } = await readClipboardText();

    if (error) return { error };
    if (inputRef?.current) inputRef.current.value = response.text;
    onClick?.(response.text);

    return { response: "success" };
  },
});

type CopyButtonProps = Prettify<
  (
    | {
        textToCopy: string | (() => string);
        inputRef?: never;
      }
    | {
        textToCopy?: never;
        inputRef: React.RefObject<HTMLInputElement | null>;
      }
  ) & {
    onClick?: () => void;
  }
>;
const CopyButton = createButton<CopyButtonProps>({
  actionIcon: IoCopyOutline,
  label: (complete) => (complete ? "Copied!" : "Copy"),
  handleOnClick: async ({ textToCopy, inputRef, onClick }) => {
    onClick?.();

    const text = textToCopy
      ? typeof textToCopy === "function"
        ? textToCopy()
        : textToCopy
      : inputRef?.current?.value;

    if (!text) {
      return {
        error: {
          errorCode: "BAD_REQUEST",
          title: "Failed to copy text.",
          message: "Failed to find the text to copy.",
        },
      };
    }

    const { error } = await copyToClipboard(text);
    if (error) return { error };

    return { response: "success" };
  },
});

export { CopyButton, PasteButton };
