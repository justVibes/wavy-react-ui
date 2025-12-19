import { BasicButton } from "@/main";
import { BasicButtonProps } from "../../low-level/html/button/BasicButton";
import { SafeOmit } from "@wavy/util";

interface ButtonProps {
  onClick?: () => void;
}
function createButton(options: {
  label: "Yes" | "No";
  defaults?: SafeOmit<BasicButtonProps, "children">;
}) {
  return (props: ButtonProps) => (
    <BasicButton
      {...options.defaults}
      text={options.label}
      onClick={props.onClick}
    />
  );
}

const YesButton = createButton({ label: "Yes" });
const NoButton = createButton({
  label: "No",
  defaults: { variant: "outline" },
});

export { YesButton, NoButton };
