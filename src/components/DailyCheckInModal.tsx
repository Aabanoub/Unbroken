"use client";

import React, { useState } from "react";
import { LogStatus, TimeOfDayOption, DailyLog } from "@/types";
import { HALT_TRIGGERS, TIME_OF_DAY_OPTIONS } from "@/lib/constants";
import {
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  X,
  Flame,
  Clock,
  BookOpen,
} from "lucide-react";

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLog: (logData: {
    status: LogStatus;
    urgeIntensity: number;
    triggers: string[];
    timeOfDay: TimeOfDayOption;
    journalNote: string;
  }) => void;
  onOpenRelapseGraceModal: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmitLog,
  onOpenRelapseGraceModal,
}) => {
  const [status, setStatus] = useState<LogStatus>("clean");
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption>("Evening");
  const [journalNote, setJournalNote] = useState("");

  if (!isOpen) return null;

  const toggleTrigger = (triggerId: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(triggerId) ? prev.filter((t) => t !== triggerId) : [...prev, triggerId]
    );
  };

  const handleStatusSelect = (newStatus: LogStatus) => {
    setStatus(newStatus);
    if (newStatus === "relapse") {
      onClose();
      onOpenRelapseGraceModal();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitLog({
      status,
      urgeIntensity,
      triggers: selectedTriggers,
      timeOfDay,
      journalNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-fade-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Daily Recovery Check-In</h2>
            <p className="text-xs text-slate-400">Record your victory, intensity, and mental state</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Status Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Today's Walk
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStatusSelect("clean")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  status === "clean"
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-[11px] leading-tight">Clean & Strong</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect("urge_defeated")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  status === "urge_defeated"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] leading-tight">Survived Urge</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect("relapse")}
                className="p-3 rounded-xl border border-rose-900/50 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 text-center transition-all flex flex-col items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span className="text-[11px] leading-tight">Relapsed (Grace)</span>
              </button>
            </div>
          </div>

          {/* 2. Urge Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-slate-400">
                2. Peak Urge Intensity Today
              </label>
              <span
                className={`font-black px-2 py-0.5 rounded-md text-xs ${
                  urgeIntensity >= 8
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : urgeIntensity >= 5
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                Level {urgeIntensity} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={urgeIntensity}
              onChange={(e) => setUrgeIntensity(Number(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-1">
              <span>1 (Zero Desire)</span>
              <span>5 (Moderate Battle)</span>
              <span>10 (Overwhelming Spike)</span>
            </div>
          </div>

          {/* 3. HALT Triggers Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Active Emotional Triggers (HALT & Environment)
            </label>
            <div className="flex flex-wrap gap-2">
              {HALT_TRIGGERS.map((trig) => {
                const isSelected = selectedTriggers.includes(trig.id);
                return (
                  <button
                    key={trig.id}
                    type="button"
                    onClick={() => toggleTrigger(trig.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{trig.icon}</span>
                    <span>{trig.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Time of Day */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              4. Time of Day Urge Occurred
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OF_DAY_OPTIONS.map((timeOpt) => {
                const isSelected = timeOfDay === timeOpt.id;
                return (
                  <button
                    key={timeOpt.id}
                    type="button"
                    onClick={() => setTimeOfDay(timeOpt.id as TimeOfDayOption)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-slate-800 border-emerald-500 text-emerald-300 font-semibold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{timeOpt.icon}</span>
                    <span className="truncate">{timeOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Personal Journal Note */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              5. Quick Reflection or Prayer Note (Optional)
            </label>
            <textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="How did God strengthen you today? What scripture gave you power?"
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <span>Log Today's Victory</span>
          </button>
        </form>
      </div>
    </div>
  );
};
