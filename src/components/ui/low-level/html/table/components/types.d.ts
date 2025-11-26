type TableColumnConfig<T extends string = string> = {
  name: T;
  weight?: "auto" | `${number}${"rem" | "fr" | "px"}`;
  backgroundColor?: BasicColor;
  color?: BasicColor;
  /**@default "start" */
  textAlign?: "start" | "center" | "end";
  opacity?:number
  /**The value that should be used if a cell doesn't have any data. */
  placeholder?: string;
};

export type { TableColumnConfig };
