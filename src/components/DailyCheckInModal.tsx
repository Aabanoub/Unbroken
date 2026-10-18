"use client";

import React, { useState } from "react";
import { LogStatus, TimeOfDayOption, DailyLog, Language, ThemeMode } from "@/types";
import { HALT_TRIGGERS, TIME_OF_DAY_OPTIONS } from "@/lib/constants";
import { getTranslation, getLocalizedTrigger, getLocalizedTimeOfDay } from "@/lib/i18n";
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
  lang?: Language;
  theme?: ThemeMode;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSubmitLog,
  onOpenRelapseGraceModal,
  lang = "en",
  theme = "dark",
}) => {
  const [status, setStatus] = useState<LogStatus>("clean");
  const [urgeIntensity, setUrgeIntensity] = useState<number>(3);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayOption>("Evening");
  const [journalNote, setJournalNote] = useState("");

  if (!isOpen) return null;

  const t = getTranslation(lang);
  const isLight = theme === "light";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col p-6 shadow-2xl animate-fade-in relative transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-900"
            : "bg-[#0D1322] border-slate-800 text-slate-100"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${
            lang === "ar" ? "left-5" : "right-5"
          } w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isLight
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-400"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {t.checkIn.title}
            </h2>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t.checkIn.subtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Status Selection */}
          <div className="space-y-2">
            <label
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {lang === "ar" ? "١. حالة اليوم والمسيرة" : "1. Today's Walk"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStatusSelect("clean")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  status === "clean"
                    ? isLight
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm"
                      : "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10"
                    : isLight
                    ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] leading-tight font-semibold">
                  {lang === "ar" ? "طاهر ومنتصر" : "Clean & Strong"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect("urge_defeated")}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  status === "urge_defeated"
                    ? isLight
                      ? "bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-sm"
                      : "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-500/10"
                    : isLight
                    ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] leading-tight font-semibold">
                  {lang === "ar" ? "واجهت شهوة وتغلبت" : "Survived Urge"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect("relapse")}
                className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-center transition-all flex flex-col items-center justify-center gap-1.5 font-semibold"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span className="text-[11px] leading-tight">
                  {lang === "ar" ? "تعثرت (نعمة)" : "Relapsed (Grace)"}
                </span>
              </button>
            </div>
          </div>

          {/* 2. Urge Intensity Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label
                className={`font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {lang === "ar" ? "٢. ذروة شدة الشهوة اليوم" : "2. Peak Urge Intensity Today"}
              </label>
              <span
                className={`font-black px-2 py-0.5 rounded-md text-xs ${
                  urgeIntensity >= 8
                    ? "bg-rose-500/20 text-rose-500 border border-rose-500/30"
                    : urgeIntensity >= 5
                    ? "bg-amber-500/20 text-amber-600 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                }`}
              >
                {lang === "ar" ? `المستوى ${urgeIntensity} / ١٠` : `Level ${urgeIntensity} / 10`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={urgeIntensity}
              onChange={(e) => setUrgeIntensity(Number(e.target.value))}
              className={`w-full accent-emerald-500 h-2 rounded-lg cursor-pointer ${
                isLight ? "bg-slate-200" : "bg-slate-800"
              }`}
            />
            <div className={`flex justify-between text-[10px] px-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
              <span>{lang === "ar" ? "١ (لا يوجد اشتهاء)" : "1 (Zero Desire)"}</span>
              <span>{lang === "ar" ? "٥ (جهاد متوسط)" : "5 (Moderate Battle)"}</span>
              <span>{lang === "ar" ? "١٠ (هجمة حادة)" : "10 (Overwhelming Spike)"}</span>
            </div>
          </div>

          {/* 3. HALT Triggers Multi-Select */}
          <div className="space-y-2">
            <label
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {lang === "ar"
                ? "٣. المحفزات العاطفية والبيئية (نموذج HALT)"
                : "3. Active Emotional Triggers (HALT & Environment)"}
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
                        ? isLight
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-sm"
                          : "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm"
                        : isLight
                        ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{trig.icon}</span>
                    <span>{getLocalizedTrigger(trig.id, lang)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Time of Day */}
          <div className="space-y-2">
            <label
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {lang === "ar" ? "٤. وقت حدوث التجربة والضعف" : "4. Time of Day Urge Occurred"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TIME_OF_DAY_OPTIONS.map((timeOpt) => {
                const isSelected = timeOfDay === timeOpt.id;
                return (
                  <button
                    key={timeOpt.id}
                    type="button"
                    onClick={() => setTimeOfDay(timeOpt.id as TimeOfDayOption)}
                    className={`p-2.5 rounded-xl border text-xs transition-all flex items-center gap-2 ${
                      isSelected
                        ? isLight
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                          : "bg-slate-800 border-emerald-500 text-emerald-300 font-semibold"
                        : isLight
                        ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span>{timeOpt.icon}</span>
                    <span className="truncate">{getLocalizedTimeOfDay(timeOpt.id, lang)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Personal Journal Note */}
          <div className="space-y-2">
            <label
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {lang === "ar"
                ? "٥. ملاحظة أو صلاة روحية للمجاهد (اختياري)"
                : "5. Quick Reflection or Prayer Note (Optional)"}
            </label>
            <textarea
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder={t.checkIn.journalPlaceholder}
              rows={2}
              className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500/60 border ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  : "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <span>{t.checkIn.submitBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
