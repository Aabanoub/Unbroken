"use client";

import React from "react";
import { Home, BarChart2, Flame, BookOpen, Shield } from "lucide-react";

export type NavTab = "home" | "analytics" | "scripture" | "shield";

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSOS: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOS,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none">
      <div className="pointer-events-auto bg-[#090D16]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 flex items-center justify-between shadow-2xl safe-area-bottom">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition-all ${
            currentTab === "home" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Analytics */}
        <button
          onClick={() => onSelectTab("analytics")}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition-all ${
            currentTab === "analytics" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Analytics</span>
        </button>

        {/* 3. Center Floating SOS Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenSOS}
            aria-label="SOS Urge Rescue"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 hover:from-rose-500 hover:to-red-400 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-600/50 border-4 border-[#090D16] transition-all animate-pulse-glow"
          >
            <Flame className="w-6 h-6 fill-white" />
            <span className="text-[8px] font-black uppercase tracking-widest -mt-0.5">SOS</span>
          </button>
        </div>

        {/* 4. Scripture & Journal */}
        <button
          onClick={() => onSelectTab("scripture")}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition-all ${
            currentTab === "scripture" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Scripture</span>
        </button>

        {/* 5. Shield / Settings */}
        <button
          onClick={() => onSelectTab("shield")}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition-all ${
            currentTab === "shield" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">Shield</span>
        </button>
      </div>
    </div>
  );
};
