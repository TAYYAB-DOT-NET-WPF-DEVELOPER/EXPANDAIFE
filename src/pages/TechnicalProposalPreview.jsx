import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TechnicalProposalPreview() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const pptUrl = state?.pptUrl;

    return (
        <div className="px-6 lg:px-20 py-10 max-w-7xl mx-auto">

            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    ←
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">
                        Technical Proposal Preview
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Review your generated presentation
                    </p>
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => {
                        const a = document.createElement("a");
                        a.href = pptUrl;
                        a.download = "Technical_Proposal.pptx";
                        a.click();
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow flex items-center gap-2"
                >
                    ⬇ Download
                </button>
            </div>

            <div className="bg-white shadow-xl p-2 rounded-3xl">
                <div className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl flex items-center gap-3">
                    <span>📄</span>
                    <span className="text-sm">Technical_Proposal.pptx</span>
                </div>

                <img
                    src="/assets/images/RGA-Cover.png"
                    className="w-full rounded-b-2xl mt-2"
                    alt="ppt-preview"
                />
            </div>

            <div className="flex justify-center gap-4 mt-8">

                <button
                    onClick={() => {
                        const a = document.createElement("a");
                        a.href = pptUrl;
                        a.download = "Technical_Proposal.pptx";
                        a.click();
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow flex items-center gap-2"
                >
                    ⬇ Download
                </button>

                <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow">
                    Regenerate
                </button>

                <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl shadow">
                    Edit inputs
                </button>

                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow">
                    Generate Financial Sheet
                </button>

            </div>

        </div>
    );
}
