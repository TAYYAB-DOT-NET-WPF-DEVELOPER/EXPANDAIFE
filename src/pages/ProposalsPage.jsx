import React, { useState, useMemo } from "react";
import { ChevronDown, Search, Star, ArrowLeft, Calendar } from "lucide-react";

export default function ProposalsPage() {
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedType, setSelectedType] = useState("All Types");
    const [searchTerm, setSearchTerm] = useState("");

    const proposalTypes = ["All Types", "Technical", "Financial"];

    const proposals = [
        {
            id: 1,
            type: "Technical",
            fileName: "كراسة الشروط والمواصفات.pdf",
            date: "March 25, 2026",
            image: "/assets/images/Tourism-Cover.png",
        },
        {
            id: 2,
            type: "Financial",
            fileName: "كراسة الشروط والمواصفات.pdf",
            date: "March 25, 2026",
            image: "/assets/images/RGA-Cover.png",
        },
        {
            id: 3,
            type: "Technical",
            fileName: "كراسة الشروط والمواصفات.pdf",
            date: "March 25, 2026",
            image: "/assets/images/DGA-Cover.png",
        },
    ];

    /* -----------------------------------------------------
       FILTER + SEARCH LOGIC
    ----------------------------------------------------- */
    const filteredProposals = useMemo(() => {
        return proposals.filter((p) => {
            const matchesType =
                selectedType === "All Types" || p.type === selectedType;

            const matchesSearch =
                p.fileName.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesType && matchesSearch;
        });
    }, [proposals, selectedType, searchTerm]);

    return (
        <div className="px-6 lg:px-10 max-w-[1400px] mx-auto mt-10">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-700" />
                </button>

                <h1 className="text-2xl font-semibold text-[#0F172A]">
                    All Proposals
                </h1>
            </div>

            {/* Search + Filter Row */}
            <div className="flex items-center gap-4 mt-6">

                {/* SEARCH BAR */}
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-2xl flex-1">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search Projects"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent w-full outline-none text-gray-700"
                    />
                </div>

                {/* FILTER DROPDOWN */}
                <div
                    className="relative bg-gray-100 px-4 py-3 rounded-2xl w-48 flex items-center justify-between cursor-pointer"
                    onClick={() => setFilterOpen(!filterOpen)}
                >
                    <span className="text-gray-700">{selectedType}</span>
                    <ChevronDown className="w-5 h-5 text-gray-500" />

                    {filterOpen && (
                        <div className="absolute left-0 top-14 w-full bg-white border shadow-md rounded-xl overflow-hidden z-50">
                            {proposalTypes.map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setSelectedType(type);
                                        setFilterOpen(false);
                                    }}
                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Proposals Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-10">

                {filteredProposals.length === 0 && (
                    <p className="text-center text-gray-500 col-span-3">
                        No proposals found.
                    </p>
                )}

                {filteredProposals.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white border rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >
                        {/* Image */}
                        <img
                            src={p.image}
                            alt=""
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-5">

                            {/* TAG */}
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    p.type === "Technical"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {p.type}
                            </span>

                            {/* FILE NAME */}
                            <h3 className="mt-3 font-medium text-[#0F172A]">
                                {p.fileName}
                            </h3>

                            {/* DATE */}
                            <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
                                <Calendar className="w-4 h-4" />
                                {p.date}
                            </div>

                            {/* FAVORITE */}
                            <button className="mt-3">
                                <Star className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition" />
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            <div className="mb-10" />
        </div>
    );
}
