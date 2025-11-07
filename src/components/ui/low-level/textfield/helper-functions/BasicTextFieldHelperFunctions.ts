import { AllowedCharacters } from "../types/BasicTextFieldTypes";

const isCharAllowed = (
  char: string,
  allowedChars: AllowedCharacters
): boolean => {
  const evaluate = (exp: RegExp) => !!exp.exec(char);

  if (typeof allowedChars !== "string") return evaluate(allowedChars);

  switch (allowedChars) {
    case "number":
      return evaluate(/[0-9]/g);
    case "symbol":
    case "space":
      return evaluate(/\s/g);
    case "letter":
      return evaluate(/[a-zA-Z]/);
    case "uppercaseLetter":
      return evaluate(/[A-Z]/);
    case "lowercaseLetter":
      return evaluate(/[a-z]/);
    case "all":
      return true;
    default:
      return allowedChars satisfies never;
  }
};

export { isCharAllowed };
