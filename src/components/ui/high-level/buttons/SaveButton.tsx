import { createBasicButton } from "../../low-level/html/button/BasicButton";

const SaveButton = createBasicButton({
  preset: { text: "Save", async: true },
});

export default SaveButton;
