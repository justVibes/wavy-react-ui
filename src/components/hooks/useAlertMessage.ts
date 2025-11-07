// import { useEffect, useState } from "react";

// export function useAlertMessage() {
//   const [alertMessage, setAlertMessage] = useState<AlertMessageProps>();

//   useEffect(() => {
//     if (alertMessage) {
//       setTimeout(alertMessage.onCompleteCallback, alertMessage.durationMillis);
//     }
//   }, [alertMessage]);

//   return {
//     alertMessage,
//     setAlertMessage: (
//       alert: { duration?: number } & (
//         | {
//             severity: AlertMessageProps["severity"];
//             title?: string;
//             message: string;
//           }
//         | ErrorMessage
//       )
//     ) => {
//       setAlertMessage({
//         title: alert?.title,
//         message: alert.message,
//         severity: "severity" in alert ? alert.severity : "error",
//         durationMillis: alert.duration || 5_000,
//         onCompleteCallback: () => {
//           setAlertMessage(undefined);
//           //   alert.onComplete?.();
//         },
//       });
//     },
//   };
// }
