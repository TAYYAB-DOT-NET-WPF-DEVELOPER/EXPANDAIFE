import { detectDirection } from "../utils/textDirection";

export default function FormattedText({ text, className = "" }) {
  const dir = detectDirection(text);

  return (
    <div
      dir={dir}
      className={`
        whitespace-pre-line leading-relaxed
        ${dir === "rtl" ? "text-right font-arabic" : "text-left font-english"}
        ${className}
      `}
    >
      {text || "—"}
    </div>
  );
}
