import React, { useRef, useState } from "react";
import { Sparkles, Check, X, FileText, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Home() {
  const fileInput = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fileData, setFileData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadClick = () => fileInput.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show card immediately
    setFileData({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
      type: file.type,
    });

    // Upload and validate
    const success = await uploadToAPI(file);

    // ❌ If API failed → remove preview card
    if (!success) {
      setFileData(null);
      setApiResponse(null);
    }
  };

  const uploadToAPI = async (file) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://18.234.84.154/api/parse-standard", {
        method: "POST",
        body: formData,
        mode: "cors",
      });

      // ❌ Server error (500, 400, 404, etc.)
      if (!res.ok) {
        alert("❌ Server Error: Unable to process file.");
        setLoading(false);
        return false;
      }

      const data = await res.json();
      console.log("API RESPONSE:", data);

      // ❌ API returned error
      if (data.error || data.status === "error") {
        alert("❌ " + (data.error || "File processing failed!"));
        setLoading(false);
        return false;
      }

      // SUCCESS
    // after successful API response
setApiResponse(data);
localStorage.setItem("rfp_payload", JSON.stringify(data));

      setLoading(false);
      return true;

    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Network Error: Could not reach server.");
      setLoading(false);
      return false;
    }
  };

  const removeFile = () => {
    setFileData(null);
    setApiResponse(null);
  };

  return (
    <div className="font-[Poppins] bg-gradient-to-b from-[#F7F9FF] to-[#E9F1FF]">

      {/* HEADER */}
      <div className="text-center pt-6 pb-10">
        <img
          src="/assets/images/Logo.png"
          alt="Logo"
          className="mx-auto w-16 h-16 rounded-2xl mb-4 shadow-sm"
        />

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-white rounded-full text-[#246BFD] text-sm shadow-sm">
          <Sparkles size={16} /> {t("aiPowered")}
        </div>

        <h1 className="text-5xl font-bold mt-6 text-[#0F172A]">
          {t("createWinning")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#246BFD] to-[#4F46E5]">
            <span>{t("proposals")}</span>
          </span>
        </h1>

        <p className="text-lg text-[#00000052] mt-4 max-w-2xl mx-auto">
          {t("heroDesc")}
        </p>
      </div>

      {/* UPLOAD CARD */}
      {!fileData && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#0F50D5] to-[#6408DD] shadow-xl p-10 text-center text-white">

            {/* ICON */}
            <div className="flex justify-center mb-6">
              <img
                src="/assets/icons/document-upload-icon.svg"
                alt="Upload Icon"
                className="w-14 h-14 opacity-90"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUploadClick}
              className="px-8 py-4 bg-white text-[#246BFD] rounded-full font-medium shadow-lg flex items-center gap-3 mx-auto"
            >
              {t("uploadRfp")}
              <img
                src="/assets/icons/file_upload.svg"
                alt=""
                className="w-5 h-5"
              />
            </button>

            {/* INPUT */}
            <input
              type="file"
              ref={fileInput}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />

            {/* TEXT */}
            <p className="text-white/80 mt-6 text-sm leading-relaxed">
              {t("dragDrop")}
              <br />
              <span className="text-white/60">
                {t("supportedFormats")}
              </span>
            </p>

          </div>
        </div>
      )}

      {/* FILE PREVIEW */}
      {fileData && (
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0F50D5] to-[#6408DD] p-6 text-white flex items-center justify-between shadow-lg">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                {loading ? "⏳" : <Check size={28} />}
              </div>

              <div>
                <p className="text-xl font-semibold">{fileData.name}</p>
                <p className="text-white/80 text-sm">
                  {loading ? t("processing") : `${fileData.size}MB — t("fileReady") `}
                </p>
              </div>
            </div>

            <button onClick={removeFile}>
              <X size={32} className="text-white cursor-pointer" />
            </button>
          </div>
        </div>
      )}

      {/* FEATURE CARDS */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 mt-12">

        <div
          onClick={() =>
            apiResponse &&
            navigate("/select-template", {
              state: {
                fileName: fileData?.name,
                payload: apiResponse,
              },
            })
          }
          className={`rounded-3xl shadow-lg p-8 cursor-pointer transition ${apiResponse ? "bg-white" : "bg-[#F5F5F5] opacity-50 cursor-not-allowed"
            }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${apiResponse ? "bg-[#246BFD]/10 text-[#246BFD]" : "bg-gray-200 text-gray-400"
              }`}
          >
            <FileText size={26} />
          </div>

          <h3 className="text-[22px] font-semibold text-[#246BFD]">
            {t("generateTechnical")}
          </h3>

          <p className="text-[#ACACAC] text-[17px] mt-3">
            {/* Create a comprehensive PPT with project details, methodology, execution plans, and booth designs. */}
         {t("generateTechnicalDesc")}

          </p>
          <div className="mt-6 flex items-center gap-2 text-[#246BFD] text-[17px] font-medium">
            <span>{t("getStarted")}</span>
            <svg
              className="w-4 h-4 text-[#246BFD]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>

          </div>


        </div>

        <div className="rounded-3xl shadow-lg p-8 bg-[#F5F5F5] opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-200 text-gray-400">
            <Calculator size={26} />
          </div>
          <h3 className="text-[22px] font-semibold text-[#ACACAC]">
            {t("generateFinancial")}
          </h3>
          <p className="text-[#ACACAC] text-[17px] mt-3">
            {/* Build detailed cost breakdowns with logistics, furniture, and operational expenses. */}
          {t("generateFinancialDesc")}
          </p>
        </div>
      </div>

      {/* RECENT PROPOSALS */}
      <div className="max-w-6xl mx-auto px-6 mt-16 pb-10">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-4">{t("recentProposals")}</h2>

        <div className="relative">
          <button className="absolute left-0 top-[45%] z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-700">‹</span>
          </button>

          <div className="flex gap-6 overflow-x-auto scrollbar-hide px-16 py-3">
            {[1, 2, 3].map((item, index) => (
              <div
                key={index}
                className="min-w-[330px] bg-white rounded-3xl shadow-md border overflow-hidden"
              >
                <img
                  src="/assets/images/RGA-Cover.png"
                  className="w-full h-40 object-cover"
                  alt="Proposal"
                />

                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600 flex items-center gap-1">
                      📄 {t("technical")}
                    </span>
                    <button className="text-gray-400 hover:text-yellow-500">☆</button>
                  </div>

                  <p className="mt-3 font-semibold text-[#0F172A]">
                    كراسة الشروط والمواصفات.pdf
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                    <span>📅</span>
                    <span>March 25, 2026</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="absolute right-0 top-[45%] z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-700">›</span>
          </button>
        </div>

        <div className="flex justify-center mt-10">
          <button className="px-6 py-3 bg-white shadow-md rounded-full hover:shadow-lg transition text-[#246BFD] font-medium">
            {t("viewAll")}
          </button>
        </div>
      </div>

      {/* FULL SCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">

            {/* Animated Ring */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>

            {/* Text */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[#0F172A]">
                {t("aiReading")}
              </h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                {/* Please wait while we analyze your RFP and extract requirements… */}
              {t("aiReadingDesc")}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
