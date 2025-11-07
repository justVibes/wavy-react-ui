import { createBasicButton } from "../../low-level/html/button/BasicButton";

const DoneButton = createBasicButton({
  preset: { text: "Done" },
  optional: {backgroundColor: "onSurface", color: "surface"}
});

export default DoneButton;
