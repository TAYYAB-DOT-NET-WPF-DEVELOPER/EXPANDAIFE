import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();

    const menuItems = [
        { name: "Home", path: "/" },
        { name: "Proposals", path: "/proposals" },
        { name: "Templates", path: "/templates" },
    ];

    return (
        <div className="w-full bg-white py-4 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* LEFT: LOGO */}
                <div className="flex items-center gap-3">
                    <img
                        src="/assets/images/Logo.png"
                        alt="Expand AI Logo"
                        className="w-10 h-10 object-contain rounded-xl"
                    />

                    <span className="text-xl font-semibold text-[#0F172A]">
                        Expand AI
                    </span>
                </div>

                {/* RIGHT: MENU */}
                <div className="flex items-center gap-8">
                    {menuItems.map((item) => {
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
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
