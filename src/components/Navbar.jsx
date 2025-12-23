import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const menuItems = [
    { path: "/", key: "home" },
    { path: "/proposals", key: "proposals" },
    { path: "/templates", key: "templates" }
  ];

  return (
    <div className="w-full bg-white py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/images/Logo.png"
            className="w-10 h-10 rounded-xl"
            alt="Logo"
          />
          <span className="text-xl font-semibold text-[#0F172A]">
            Expand AI
          </span>
        </div>

        {/* MENU + LANG */}
        <div className="flex items-center gap-8">
          {menuItems.map(item => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition ${
                  active
                    ? "text-[#246BFD] bg-white px-4 py-2 rounded-full shadow-sm"
                    : "text-[#00000090] hover:text-[#246BFD]"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}

          {/* LANGUAGE SWITCH */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium"
          >
            🌐 {i18n.language === "en" ? "العربية" : "EN"}
          </button>
        </div>
      </div>
    </div>
  );
}
