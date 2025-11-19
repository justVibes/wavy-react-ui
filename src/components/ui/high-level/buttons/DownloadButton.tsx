import { IoMdDownload } from "react-icons/io";
import { createBasicButton } from "../../low-level/html/button/BasicButton";

const DownloadButton = createBasicButton({
  preset: {
    leadingEl: IoMdDownload,
    text: "Download",
    trailingEl: null,
  },
  optional: { backgroundColor: "sendBlue", color: "onSendBlue" },
});

export { DownloadButton };
