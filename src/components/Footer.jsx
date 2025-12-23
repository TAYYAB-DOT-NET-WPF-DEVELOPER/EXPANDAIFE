import React from "react";
import { useTranslation } from "react-i18next";
export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="w-full bg-white py-6 rounded-t-3xl shadow-sm">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* LEFT — LOGO */}
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/images/Logo.png"
                        alt="Expand AI Logo"
                        className="w-10 h-10 object-contain rounded-xl"
                    />

                    <span className="text-lg font-medium text-[#0F172A]">
                        Expand AI
                    </span>
                </div>

                {/* RIGHT — COPYRIGHT */}
                <p className="text-sm text-[#00000080]">
                    © 2025 {t("footerText")}
                </p>
            </div>
        </footer>
    );
}
