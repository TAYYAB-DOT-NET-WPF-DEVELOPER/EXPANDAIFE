import { detectDirection } from "../utils/textDirection";

export default function SmartTextarea({ value, onChange, ...props }) {
    const dir = detectDirection(value);

    return (
        <textarea
            {...props}
            dir={dir}
            className={`
        w-full mt-3 p-4 rounded-2xl border shadow-sm min-h-[150px] 
        ${dir === "rtl" ? "text-right font-arabic" : "text-left font-english"}
      `}
            value={value}
            onChange={onChange}
        />
    );
}
