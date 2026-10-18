"use client";

import React, { useState } from "react";
import { HeartHandshake, RefreshCw, X } from "lucide-react";
import { Language, ThemeMode } from "@/types";
import { getTranslation } from "@/lib/i18n";

interface GraceRelapseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: (environmentalAdjustment: string) => void;
  lang?: Language;
  theme?: ThemeMode;
}

export const GraceRelapseModal: React.FC<GraceRelapseModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  lang = "en",
  theme = "dark",
}) => {
  const [environmentalAdjustment, setEnvironmentalAdjustment] = useState("");
  const [selectedQuickFix, setSelectedQuickFix] = useState<string>("");

  if (!isOpen) return null;

  const t = getTranslation(lang);
  const isLight = theme === "light";

  const quickFixes =
    lang === "ar"
      ? [
          "شحن الهاتف خارج غرفة النوم تماماً قبل الساعة ١٠:٣٠ مساءً",
          "إلغاء تثبيت تطبيق السقوط لمدة ٧ أيام",
          "النوم مبكراً مع ترك باب الغرفة مفتوحاً",
          "الصلاة والاعتراف فوراً مع أب الاعتراف أو خادم روحي أمين",
        ]
      : [
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
    onConfirmReset(
      environmentalAdjustment ||
        selectedQuickFix ||
        (lang === "ar" ? "تجديد الحراسة والالتزام البيئي بنعمة الله" : "Renewed environmental vigilance")
    );
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
          } w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isLight
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-400"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {lang === "ar" ? "نعمة المسيح تغمرك وتقيمك الآن" : "Grace Covers You Right Now"}
            </h2>
            <span
              className={`text-xs font-medium ${
                isLight ? "text-amber-800" : "text-amber-400/90"
              }`}
            >
              {lang === "ar"
                ? "الخزي فخ من العدو؛ المسيح يمنحك المغفرة والقيام."
                : "Shame is the enemy's trap; Christ offers forgiveness."}
            </span>
          </div>
        </div>

        {/* Biblical Truth: Micah 7:8 & 1 John 1:9 */}
        <div className="space-y-3 my-3">
          <div
            className={`p-4 rounded-2xl border space-y-1.5 ${
              isLight
                ? "bg-amber-50/60 border-amber-200/80"
                : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {lang === "ar" ? "ميخا ٧: ٨" : "Micah 7:8 (NKJV)"}
            </span>
            <p
              className={`text-xs italic font-serif leading-relaxed ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              {lang === "ar"
                ? "«لاَ تَشْمَتِي بِي يَا عَدُوَّتِي، إِذَا سَقَطْتُ أَقُومُ. إِذَا جَلَسْتُ فِي الظُّلْمَةِ فَالرَّبُّ نُورٌ لِي.»"
                : '"Do not rejoice over me, my enemy; when I fall, I will arise; when I sit in darkness, the LORD will be a light to me."'}
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-1.5 ${
              isLight
                ? "bg-emerald-50/60 border-emerald-200/80"
                : "bg-slate-900/90 border-slate-800"
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {lang === "ar" ? "١ يوحنا ١: ٩" : "1 John 1:9 (NKJV)"}
            </span>
            <p
              className={`text-xs italic font-serif leading-relaxed ${
                isLight ? "text-slate-800" : "text-slate-200"
              }`}
            >
              {lang === "ar"
                ? "«إِنِ اعْتَرَفْنَا بِخَطَايَانَا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا خَطَايَانَا وَيُطَهِّرَنَا مِنْ كُلِّ إِثْمٍ.»"
                : '"If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness."'}
            </p>
          </div>
        </div>

        {/* Environmental Change Question */}
        <div className="space-y-3 pt-2">
          <label
            className={`text-xs font-semibold block ${
              isLight ? "text-slate-900" : "text-slate-200"
            }`}
          >
            {t.grace.actionPrompt}
          </label>

          <div className="space-y-2">
            {quickFixes.map((fix) => (
              <button
                key={fix}
                type="button"
                onClick={() => handleSelectQuick(fix)}
                className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                  lang === "ar" ? "text-right" : "text-left"
                } ${
                  selectedQuickFix === fix
                    ? isLight
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium"
                      : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300 font-medium"
                    : isLight
                    ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
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
            placeholder={t.grace.customPlaceholder}
            rows={2}
            className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500/50 border ${
              isLight
                ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                : "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
            }`}
          />
        </div>

        {/* Anti-Despair Reassurance */}
        <div
          className={`p-3 my-3 rounded-xl border text-[11px] leading-relaxed ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-600"
              : "bg-slate-950 border-slate-800/80 text-slate-400"
          }`}
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
            {lang === "ar" ? "حقيقة عصبية: " : "Brain Fact: "}
          </span>
          {lang === "ar"
            ? "السقطة الواحدة لا تمسح المسارات العصبية التي قمت ببنائها في الأيام السابقة. معدل نصرتك الشهري يحمي مسيرتك. قف وانهض بنعمة المسيح!"
            : "A stumble does not erase the neural pathways you've built over previous clean days. Your 30-Day Victory Rate protects your momentum. Stand up and arise!"}
        </div>

        {/* Reset Counter Action */}
        <div className="pt-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t.grace.confirmBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
