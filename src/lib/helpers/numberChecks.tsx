export const isNumeric = (value: string) => value && /^\d+(\.\d+)?$/.test(value);
export const isInt = (value: string) => value && /^\d+$/.test(value);
