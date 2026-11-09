export const EXAMPLE_PAYLOAD = "' OR 1=1; --";

export function isPayload(value: string): boolean {
  const v = value.toLowerCase();
  return (
    v.includes("' or") ||
    v.includes("or 1=1") ||
    v.includes("union select") ||
    v.includes("$(") ||
    v.includes(";--") ||
    v.includes("; --")
  );
}
