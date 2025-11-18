type AllowedCharacters =
  | "number"
  | "space"
  | "symbol"
  | "letter"
  | `${"upper" | "lower"}caseLetter`
  | "all"
  | RegExp;

export type { AllowedCharacters };
