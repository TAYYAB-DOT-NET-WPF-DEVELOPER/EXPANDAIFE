export function detectDirection(text = "") {
  if (!text) return "ltr";

  // Arabic Unicode range
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text) ? "rtl" : "ltr";
}
