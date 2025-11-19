import { createBasicButton } from "../../low-level/html/button/BasicButton";

const CancelButton = createBasicButton({
  preset: { text: "Cancel", leadingEl: null, trailingEl: null },
  optional: {
    backgroundColor: "transparent",
    color: "onSurface",
    fade: 0.75,
  },
});

export default CancelButton;
