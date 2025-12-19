import { ErrorMessage, SafeOmit } from "@wavy/util";
import BasicSpan from "../../low-level/html/span/BasicSpan";
import { Tooltip, TooltipProps } from "../../low-level/tooltip/Tooltip";
import { camelCaseToLetter } from "@wavy/fn";

function ErrorTooltip(
  props: SafeOmit<TooltipProps, "tooltip"> & {
    error: ErrorMessage | undefined;
  }
) {
  if (!props.error) return props.children;
  return (
    <Tooltip
      {...props}
      tooltip={
        <span>
          {Object.keys(props.error).map((key) => {
            const validKey = key as keyof ErrorMessage;

            return (
              <span>
                <BasicSpan
                  fontWeight='bold'
                  text={camelCaseToLetter(validKey) + ": "}
                />
                <span
                  style={{
                    textDecoration: "underline",
                    opacity: 0.75,
                    fontWeight: "normal",
                  }}
                  children={props.error![validKey]}
                />
                <br />
              </span>
            );
          })}
        </span>
      }
    />
  );
}

export default ErrorTooltip;
