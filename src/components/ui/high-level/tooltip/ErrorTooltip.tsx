import { ErrorMessage, SafeOmit } from "@wavy/types";
import BasicSpan from "../../low-level/html/span/BasicSpan";
import BasicTooltip, {
  BasicTooltipProps,
} from "../../low-level/tooltip/BasicTooltip";
import { camelCaseToLetter } from "@wavy/fn";

function ErrorTooltip(
  props: SafeOmit<BasicTooltipProps, "tooltip"> & {
    error: ErrorMessage | undefined;
  }
) {
  if (!props.error) return props.children;
  return (
    <BasicTooltip
      {...props}
      tooltip={
        <span>
          {Object.keys(props.error).map((key) => {
            const validKey = key as keyof ErrorMessage;

            return (
              <span>
                <BasicSpan
                  fontWeight="bold"
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
