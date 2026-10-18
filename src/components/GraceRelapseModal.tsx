"use client";

import React, { useState } from "react";
import { HeartHandshake, ShieldAlert, Sparkles, RefreshCw, X, ArrowRight } from "lucide-react";

interface GraceRelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (environmentalAdjustment: string) => void;
}

export const GraceRelapseModal: React.FC<GraceRelapseModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [environmentalAdjustment, setEnvironmentalAdjustment] = useState("");
  const [selectedQuickFix, setSelectedQuickFix] = useState<string>("");

  if (!isOpen) return null;

  const quickFixes = [
    "Charge phone in hallway outside bedroom before 10:30 PM",
    "Uninstall trigger social media app for 7 days",
    "Sleep earlier with bedroom door unlocked / open",
    "Tell my accountability partner / trusted parent immediately",
  ];

  const handleSelectQuick = (fix: string) => {
    setSelectedQuickFix(fix);
    setEnvironmentalAdjustment(fix);
  };

  const handleSubmit = () => {
    onConfirmReset(environmentalAdjustment || selectedQuickFix || "Renewed environmental vigilance");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-fade-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Grace Covers You Right Now
            </h2>
            <span className="text-xs text-amber-400/90 font-medium">
              Shame is the enemy's trap; Christ offers forgiveness.
            </span>
          </div>
        </div>

        {/* Biblical Truth: Micah 7:8 & 1 John 1:9 */}
        <div className="space-y-3 my-3">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Micah 7:8 (NKJV)
            </span>
            <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
              "Do not rejoice over me, my enemy; when I fall, I will arise; when I sit in darkness, the LORD will be a light to me."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              1 John 1:9 (NKJV)
            </span>
            <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
              "If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness."
            </p>
          </div>
        </div>

        {/* Environmental Change Question */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-200 block">
            What can we change about your environment tomorrow?
          </label>

          <div className="space-y-2">
            {quickFixes.map((fix) => (
              <button
                key={fix}
                type="button"
                onClick={() => handleSelectQuick(fix)}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all ${
                  selectedQuickFix === fix
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {selectedQuickFix === fix ? "✓ " : "+ "}
                {fix}
              </button>
            ))}
          </div>

          <textarea
            value={environmentalAdjustment}
            onChange={(e) => setEnvironmentalAdjustment(e.target.value)}
            placeholder="Or write your own environmental boundary..."
            rows={2}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Anti-Despair Reassurance */}
        <div className="p-3 my-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <span className="text-emerald-400 font-semibold">Brain Fact: </span>
          A stumble does not erase the neural pathways you've built over previous clean days. Your 30-Day Victory Rate protects your momentum. Stand up and arise!
        </div>

        {/* Reset Counter Action */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Receive Grace & Arise Clean</span>
          </button>
        </div>
      </div>
    </div>
  );
};
