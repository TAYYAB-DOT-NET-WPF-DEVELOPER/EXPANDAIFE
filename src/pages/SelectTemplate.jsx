import React, { useState } from "react";
import { MoreVertical, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TEMPLATE_LIST from "../data/templates";


console.log("TEMPLATE_LIST RAW:", TEMPLATE_LIST);

export default function SelectTemplate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const fileName = location?.state?.fileName || "Document.pptx";

  const [selected, setSelected] = useState(null);

  // const templates = [
  //   {
  //     id: 1,
  //     name: "Template A",
  //     type: "Technical",
  //     default: true,
  //     updated: "March 25, 2026",
  //     image: "/assets/images/Expand.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Template A",
  //     type: "Financial",
  //     default: true,
  //     updated: "March 25, 2026",
  //     image: "/assets/images/Expand.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Template B",
  //     type: "Technical",
  //     updated: "March 25, 2026",
  //     image: "/assets/images/Sample2.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Template B",
  //     type: "Financial",
  //     updated: "March 25, 2026",
  //     image: "/assets/images/Sample2.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "Template A",
  //     type: "Technical",
  //     updated: "March 25, 2026",
  //     image: "/assets/images/Expand.jpg",
  //   },
  // ];
const templates = Array.isArray(TEMPLATE_LIST) ? TEMPLATE_LIST : [];



  const handleUseTemplate = () => {
    if (!selected) return;
    navigate("/technical-proposal", {
      state: {
        fileName,
        payload: location?.state?.payload, // pass REAL API response forward
        selectedTemplate: selected
      },
    });
  };

  return (
    <div className="px-6 lg:px-16 py-10 max-w-[1500px] mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          ←
        </button>

        <h1 className="text-2xl font-semibold text-[#0F172A]">
          {t("selectTemplate")}
        </h1>
      </div>

      {/* TEMPLATE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

        {templates.map((template) => {
          const active = selected === template.id;

          return (
            <div
              key={template.id}
              onClick={() => setSelected(template.id)}
              className={`relative cursor-pointer rounded-[28px] p-[6px] transition
        ${active ? "bg-blue-600" : "bg-transparent"}
      `}
            >
              {/* INNER CARD */}
              <div
                className={`relative rounded-[22px] overflow-hidden bg-white border transition shadow-sm
          ${active ? "border-transparent shadow-xl" : "border-gray-200"}
        `}
              >
                {/* IMAGE */}
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-52 object-cover"
                />

                {/* TAGS */}
                <div className="flex items-center gap-2 px-4 mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full flex items-center gap-1
              ${template.type === "Technical"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-green-100 text-green-600"}
            `}
                  >
                    📄 {t(template.type === "Technical" ? "technical" : "financial")}
                  </span>

                  {template.default && (
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                      ⭐ {t("default")}
                    </span>
                  )}
                </div>

                {/* TITLE */}
                <h3 className="px-4 pt-3 text-lg font-semibold text-[#0F172A]">
                  {template.name}
                </h3>

                {/* UPDATED DATE */}
                <p className="px-4 pb-5 text-xs text-gray-500">
                  {t("updatedOn")} {template.updated}
                </p>

                {/* 3 DOT MENU */}
                <div className="absolute top-4 right-4 p-2 bg-white rounded-full shadow">
                  <MoreVertical size={18} className="text-gray-600" />
                </div>

                {/* SELECTED CHECK */}
                {active && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-full p-1.5 shadow">
                    <Check size={18} />
                  </div>
                )}
              </div>
            </div>
          );
        })}


      </div>

      {/* FOOTER BUTTON */}
      <div className="flex justify-center mt-10">
        <button
          disabled={!selected}
          onClick={handleUseTemplate}
          className={`px-10 py-3 text-white rounded-xl shadow-md text-lg font-medium transition
                        ${selected
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 cursor-not-allowed"}
                    `}
        >
          {t("useTemplate")} →
        </button>
      </div>
    </div>
  );
}
