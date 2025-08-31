type ArrayType = "string" | "number" | "object" | "boolean" | "function";

export const isArrayOfType = (array: unknown, type: ArrayType) => {
  return Array.isArray(array) && array.some((item) => typeof item === type);
};
