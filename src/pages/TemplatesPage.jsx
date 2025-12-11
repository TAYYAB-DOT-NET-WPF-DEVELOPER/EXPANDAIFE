import React, { useState } from "react";
import { MoreVertical, Edit, Copy, Trash2, ArrowLeft, Plus } from "lucide-react";

export default function TemplatesPage() {
    const [openMenu, setOpenMenu] = useState(null);

    const templates = [
        {
            id: 1,
            name: "Template A",
            type: "Technical",
            default: true,
            updated: "March 25, 2026",
            image: "/assets/images/Tourism-Cover.png",
        },
        {
            id: 2,
            name: "Template A",
            type: "Financial",
            default: true,
            updated: "March 25, 2026",
            image: "/assets/images/RGA-Cover.png",
        },
        {
            id: 3,
            name: "Template A",
            type: "Technical",
            default: false,
            updated: "March 25, 2026",
            image: "/assets/images/DGA-Cover.png",
        },
        {
            id: 4,
            name: "Template A",
            type: "Financial",
            default: false,
            updated: "March 25, 2026",
            image: "/assets/images/Tourism-Cover.png",
        },
        {
            id: 5,
            name: "Template A",
            type: "Technical",
            default: false,
            updated: "March 25, 2026",
            image: "/assets/images/RGA-Cover.png",
        },
    ];

    return (
        <div className="px-6 lg:px-10 max-w-[1400px] mx-auto mt-10">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-700" />
                    </button>

                    <h1 className="text-3xl font-bold text-[#0F172A]">
                        Proposal Templates
                    </h1>
                </div>

                {/* NEW TEMPLATE BUTTON */}
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-medium shadow">
                    <Plus size={20} />
                    New Template
                </button>
            </div>

            {/* GRID – 3 PER ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {templates.slice(0, 5).map((t) => (
                   <div key={t.id} className="bg-white border rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition">

    {/* Image */}
    <img
        src={t.image}
        alt=""
        className="w-full h-48 object-cover"
    />

    <div className="p-5 relative">

        {/* TAGS + 3 DOTS ROW */}
        <div className="flex items-center justify-between">

            {/* TAGS LEFT */}
            <div className="flex items-center gap-2 mt-1">

                {/* Type */}
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${
                            t.type === "Technical"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }
                    `}
                >
                    {t.type}
                </span>

                {/* Default */}
                {t.default && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        ⭐ Default
                    </span>
                )}
            </div>

            {/* 3 DOTS BUTTON */}
            <button
                onClick={() =>
                    setOpenMenu(openMenu === t.id ? null : t.id)
                }
                className="p-2 rounded-full hover:bg-gray-100"
            >
                <MoreVertical size={20} className="text-gray-600" />
            </button>

            {/* 3 DOTS MENU */}
            {openMenu === t.id && (
                <div className="absolute right-5 top-16 bg-white border shadow-md rounded-xl w-40 z-50">
                    <div className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                        <Edit size={16} className="text-gray-600" />
                        Edit
                    </div>
                    <div className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                        <Copy size={16} className="text-gray-600" />
                        Duplicate
                    </div>
                    <div className="p-3 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-red-600">
                        <Trash2 size={16} />
                        Delete
                    </div>
                </div>
            )}
        </div>

        {/* Template Name */}
        <h3 className="mt-4 font-semibold text-[#0F172A] text-[18px]">
            {t.name}
        </h3>

        {/* Date */}
        <p className="text-sm text-gray-500 mt-1">
            Updated on {t.updated}
        </p>

    </div>
</div>

                ))}

            </div>

            <div className="mb-10"></div>
        </div>
    );
}
