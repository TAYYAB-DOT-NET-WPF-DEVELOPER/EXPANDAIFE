import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TEMPLATE_LIST from "../data/templates";


export default function TechnicalProposalPreview() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { t } = useTranslation();

    const pptUrl = state?.pptUrl;
    const selectedTemplateId = state?.selectedTemplate;
    const clientName = state?.clientName || "Technical_Proposal";
    const downloadFileName = `${clientName}`.replace(/[^\w\u0600-\u06FF]+/g, "_") + ".pptx";



    // ✅ SAFETY GUARD (NO LOGIC CHANGE)
    const templates = Array.isArray(TEMPLATE_LIST) ? TEMPLATE_LIST : [];

    console.log("TEMPLATES:", templates);

    const selectedTemplate = templates.find(
        (tpl) => tpl.id === selectedTemplateId
    );
    console.log("SELECTED TEMPLATE:", selectedTemplate);

    // ✅ FALLBACK IMAGE
    const previewImage =
        selectedTemplate?.image || "/assets/images/RGA-Cover.png";

    return (
        <div className="px-6 lg:px-20 py-10 max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        ←
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-[#0F172A]">
                            {t("technicalProposalPreview")}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {t("reviewPresentation")}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (!pptUrl) return;
                        const a = document.createElement("a");
                        a.href = pptUrl;
                        a.download = downloadFileName;
                        a.click();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2 hover:bg-blue-700 transition"
                >
                    <img
                        src="/assets/icons/download.svg"
                        alt="download"
                        className="w-5 h-5"
                    />
                    <span>{t("download")}</span>
                </button>
            </div>

            {/* PREVIEW */}
            <div className="bg-white shadow-xl p-2 rounded-3xl">
                <div className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl flex items-center gap-3">
                    <span>📄</span>
                    <span className="text-sm">{downloadFileName}</span>

                </div>

                <img
                    src={previewImage}
                    className="w-full rounded-b-2xl mt-2 object-cover"
                    alt="ppt-preview"
                />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">

                <button
                    onClick={() => {
                        if (!pptUrl) return;
                        const a = document.createElement("a");
                        a.href = pptUrl;
                        a.download = downloadFileName;
                        a.click();
                    }}

                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2"
                >
                    <img
                        src="/assets/icons/download.svg"
                        alt="download"
                        className="w-5 h-5"
                    />
                    <span>{t("download")}</span>
                </button>

                <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow flex items-center gap-2">
                    <img
                        src="/assets/icons/regenrate.svg"
                        alt="regenrate"
                        className="w-5 h-5"
                    />
                    <span>{t("regenerate")}</span>
                </button>

                <button
                    onClick={() => navigate("/select-template")}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow flex items-center gap-2"
                >
                    <img
                        src="/assets/icons/template.svg"
                        alt="template"
                        className="w-5 h-5"
                    />
                    <span>{t("changeTemplate")}</span>
                </button>

                <button
                    onClick={() => navigate("/financial-proposal")}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2"
                >
                    <img
                        src="/assets/icons/ai-icon.svg"
                        alt="ai-icon"
                        className="w-5 h-5"
                    />
                    <span>{t("generateFinancialSheet")}</span>
                </button>

            </div>
        </div>
    );
}
