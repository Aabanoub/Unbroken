"use client";

import React, { useState } from "react";
import { ASSESSMENT_QUESTIONS } from "@/lib/constants";
import { AddictionTier, UserProfile, Language, ThemeMode } from "@/types";
import { getTranslation, getLocalizedQuestion, getLocalizedLikert } from "@/lib/i18n";
import {
  Brain,
  Shield,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  Sparkles,
  HeartHandshake,
  Activity,
  Zap,
} from "lucide-react";

interface OnboardingAssessmentProps {
  initialProfile: UserProfile;
  onComplete: (profile: Partial<UserProfile>) => void;
  lang?: Language;
  theme?: ThemeMode;
  onToggleLang?: (targetLang?: Language) => void;
}

export const OnboardingAssessment: React.FC<OnboardingAssessmentProps> = ({
  initialProfile,
  onComplete,
  lang: initialLang = "en",
  theme = "dark",
  onToggleLang,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(initialLang);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showReport, setShowReport] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [nameInput, setNameInput] = useState(initialProfile.displayName || "Disciple");

  const lang = currentLang;
  const t = getTranslation(lang);
  const isLight = theme === "light";

  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    if (onToggleLang) {
      onToggleLang(newLang);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const rawQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const currentQuestion = getLocalizedQuestion(rawQuestion, lang);
  const likertOptions = getLocalizedLikert(lang);
  const progressPercent = Math.round(((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectScore = (score: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(nextAnswers);

    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const total = Object.values(nextAnswers).reduce((a, b) => a + b, 0);
      setCalculatedScore(total);
      setShowReport(true);
    }
  };

  const getTierDetails = (score: number): {
    tier: AddictionTier;
    displayTier: string;
    goalDays: number;
    dopamineSens: number;
    color: string;
    description: string;
    verseRef: string;
    verseText: string;
  } => {
    if (score <= 10) {
      return {
        tier: "Level 1 — Mild Habitual Loop",
        displayTier: lang === "ar" ? "المستوى ١ — حلقة سلوكية خفيفة" : "Level 1 — Mild Habitual Loop",
        goalDays: 21,
        dopamineSens: 70,
        color: isLight
          ? "text-emerald-900 border-emerald-300 bg-emerald-50"
          : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        description:
          lang === "ar"
            ? "دماغك يمر بمحفزات ظرفية وحلقات ملل وتعود خفيف على الدوبامين. مع الحدود البيئية الحازمة و٢١ يوماً من الصوم المقدس عن الشهوة، سيتمكن فصك الجبهي من كسر هذه الحلقة التلقائية سريعاً."
            : "Your brain is experiencing situational cues, boredom loops, and mild dopamine habituation. With intentional environmental boundaries and 21 days of consecrated fasting from lust, your prefrontal cortex can quickly decouple this automatic loop.",
        verseRef: lang === "ar" ? "١ كورنثوس ١٠: ١٣" : "1 Corinthians 10:13",
        verseText:
          lang === "ar"
            ? "لَمْ تُصِبْكُمْ تَجْرِبَةٌ إِلاَّ بَشَرِيَّةٌ. وَلكِنَّ اللهَ أَمِينٌ، الَّذِي لاَ يَدَعُكُمْ تُجَرَّبُونَ فَوْقَ مَا تَسْتَطِيعُونَ، بَلْ سَيَجْعَلُ مَعَ التَّجْرِبَةِ أَيْضاً الْمَنْفَذَ..."
            : "No temptation has overtaken you except such as is common to man; but God is faithful, who will not allow you to be tempted beyond what you are able...",
      };
    } else if (score <= 21) {
      return {
        tier: "Level 2 — Moderate Compulsive Dependency",
        displayTier:
          lang === "ar"
            ? "المستوى ٢ — اعتماد قهري متوسط"
            : "Level 2 — Moderate Compulsive Dependency",
        goalDays: 40,
        dopamineSens: 45,
        color: isLight
          ? "text-amber-900 border-amber-300 bg-amber-50"
          : "text-amber-400 border-amber-500/30 bg-amber-500/10",
        description:
          lang === "ar"
            ? "اعتاد جهازك العصبي على استخدام الإباحية كمهرب عاطفي عند مشاعر الضعف (نموذج HALT: جوع، غضب، وحدة، إرهاق). انخفضت حساسية مستقبلات الدوبامين جزئياً. صوم الأربعين يوماً في برية الجهاد مع التجديد اليومي بالكلمة سيقلم المسارات الإجبارية."
            : "Your nervous system has conditioned pornography as an emotional escape (HALT: Hungry, Angry, Lonely, Tired). Your dopamine receptors have begun downregulating. A 40-Day Wilderness fast with daily Scripture renewal will prune compulsive pathways and restore emotional equilibrium.",
        verseRef: lang === "ar" ? "رومية ١٢: ٢" : "Romans 12:2",
        verseText:
          lang === "ar"
            ? "وَلاَ تُشَاكِلُوا هذَا الدَّهْرَ، بَلْ تَغَيَّرُوا عَنْ شَكْلِكُمْ بِتَجْدِيدِ أَذْهَانِكُمْ، لِتَخْتَبِرُوا مَا هِيَ إِرَادَةُ اللهِ..."
            : "And do not be conformed to this world, but be transformed by the renewing of your mind...",
      };
    } else {
      return {
        tier: "Level 3 — High Neurological Dependency",
        displayTier:
          lang === "ar" ? "المستوى ٣ — ارتباط عصبي شديد" : "Level 3 — High Neurological Dependency",
        goalDays: 90,
        dopamineSens: 20,
        color: isLight
          ? "text-rose-900 border-rose-300 bg-rose-50"
          : "text-rose-400 border-rose-500/30 bg-rose-500/10",
        description:
          lang === "ar"
            ? "أدى الاعتياد العصبي المكثف إلى تراكم بروتين الإدمان وتناقص حاد في حساسية مستقبلات الدوبامين. قد تشعر بأعراض انسحاب مؤقتة. برنامج إعادة التشكيل العصبي الكامل لمدة ٩٠ يوماً المدعوم بنعمة المسيح سيعيد بناء فرامل الفص الجبهي للإرادة."
            : "High neurological conditioning has created deep Delta-FosB neural groves and significant dopamine tolerance. You may experience acute withdrawal symptoms (flatline, irritability). A comprehensive 90-Day Neuroplasticity Reboot backed by Christ's grace will physically rewire your prefrontal executive brakes.",
        verseRef: lang === "ar" ? "٢ تيموثاوس ١: ٧" : "2 Timothy 1:7",
        verseText:
          lang === "ar"
            ? "لأَنَّ اللهَ لَمْ يُعْطِنَا رُوحَ الْفَشَلِ، بَلْ رُوحَ الْقُوَّةِ وَالْمَحَبَّةِ وَالنُّصْحِ (ضبط النفس)."
            : "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
      };
    }
  };

  const finishAssessment = () => {
    const details = getTierDetails(calculatedScore);
    onComplete({
      displayName: nameInput.trim() || "Disciple",
      onboardingCompleted: true,
      onboardingScore: calculatedScore,
      currentAddictionIndex: calculatedScore,
      addictionTier: details.tier,
      goalDays: details.goalDays,
      initialDopamineSensitivity: details.dopamineSens,
      streakStartTimestamp: new Date().toISOString(),
      longestStreakDays: 0,
      urgesDefeatedCount: 0,
    });
  };

  // --- REPORT SCREEN ---
  if (showReport) {
    const details = getTierDetails(calculatedScore);

    return (
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={`min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto transition-colors ${
          isLight ? "bg-slate-50 text-slate-900" : "bg-[#090D16] text-slate-100"
        }`}
      >
        <div className="space-y-6 pt-6">
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border flex items-center gap-1.5 ${
                isLight
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.onboarding.completeTitle}
            </span>
          </div>

          <div>
            <h1 className={`text-2xl font-extrabold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {lang === "ar" ? "التقرير التشخيصي والروحي" : "Clinical & Spiritual Baseline"}
            </h1>
            <p className={`text-sm mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {t.onboarding.completeSub}
            </p>
          </div>

          {/* Name Confirmation Input */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
            }`}
          >
            <label className={`text-xs font-medium uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {lang === "ar" ? "اسمك أو لقبك الروحي:" : "Your Name or Disciple Alias:"}
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className={`w-full mt-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold border focus:outline-none focus:border-emerald-500 ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-900"
                  : "bg-slate-800/90 border-slate-700 text-white"
              }`}
              placeholder="e.g. Nathaniel"
            />
          </div>

          {/* Diagnosis Card */}
          <div className={`p-5 rounded-2xl border ${details.color} space-y-3 shadow-md`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                {t.onboarding.assignedTier}
              </span>
              <span className="text-lg font-black">{calculatedScore} / 32 {lang === "ar" ? "نقطة" : "pts"}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">{details.displayTier}</h2>
            <p className="text-xs leading-relaxed opacity-90">{details.description}</p>
          </div>

          {/* Metrics Dual Gauge */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Shield className="w-4 h-4 text-emerald-500" />
                {lang === "ar" ? "هدف المرحلة" : "Target Journey"}
              </div>
              <div className="mt-2">
                <span className={`text-3xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                  {details.goalDays}
                </span>
                <span className="text-xs text-slate-400 ml-1">{lang === "ar" ? "يوم" : "Days"}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {lang === "ar" ? "نصرة مستمرة يوماً بعد يوم" : "Conceiving victory one day at a time"}
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900/80 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <Activity className="w-4 h-4 text-cyan-500" />
                {lang === "ar" ? "حساسية الدوبامين" : "Dopamine Sensitivity"}
              </div>
              <div className="mt-2">
                <span className={`text-3xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
                  {details.dopamineSens}%
                </span>
                <span className="text-xs text-slate-400 ml-1">{lang === "ar" ? "بداية" : "Baseline"}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {lang === "ar" ? "تتعافى نحو ١٠٠٪ مع الطهارة" : "Will recover toward 100% with clean days"}
              </p>
            </div>
          </div>

          {/* Scripture Anchor */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isLight
                ? "bg-amber-50/60 border-amber-200"
                : "bg-gradient-to-br from-slate-900 to-slate-800/80 border-slate-700/60"
            }`}
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              {lang === "ar" ? "آيتك الكتابية الدفاعية" : "Your Anchor Scripture"}
            </div>
            <p className={`text-xs italic leading-relaxed font-serif ${isLight ? "text-slate-800" : "text-slate-300"}`}>
              &ldquo;{details.verseText}&rdquo;
            </p>
            <div className="text-right text-xs font-bold text-amber-600 dark:text-amber-400">
              — {details.verseRef}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="py-6">
          <button
            onClick={finishAssessment}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <span>{t.onboarding.startJourneyBtn}</span>
            <ArrowRight className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen p-5 flex flex-col justify-between max-w-md mx-auto transition-colors ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-[#090D16] text-slate-100"
      }`}
    >
      {/* Top Bar */}
      <div className="pt-4 space-y-4">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between gap-2">
          {currentIndex > 0 ? (
            <button
              onClick={handlePrevQuestion}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {lang === "ar" ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              <span>{lang === "ar" ? "السؤال السابق" : "Previous"}</span>
            </button>
          ) : (
            <div className="w-20" />
          )}

          {/* Language Switch Button */}
          <button
            onClick={() => handleLanguageChange(lang === "ar" ? "en" : "ar")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isLight
                ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Brain className="w-4 h-4" />
            {t.onboarding.title}
          </span>
          <span className={isLight ? "text-slate-600" : "text-slate-400"}>
            {lang === "ar"
              ? `السؤال ${currentIndex + 1} من ${ASSESSMENT_QUESTIONS.length}`
              : `Question ${currentIndex + 1} of ${ASSESSMENT_QUESTIONS.length}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-slate-800"}`}>
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Title */}
        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {currentQuestion.category.replace("_", " ")}
          </span>
          <h2 className={`text-lg font-bold mt-1 leading-snug ${isLight ? "text-slate-900" : "text-white"}`}>
            {currentQuestion.title}
          </h2>
        </div>

        {/* Question Text */}
        <div
          className={`p-4 rounded-2xl border shadow-md ${
            isLight
              ? "bg-white border-slate-200 text-slate-800"
              : "bg-slate-900/90 border-slate-800/80 text-slate-200"
          }`}
        >
          <p className="text-sm font-medium leading-relaxed">
            &ldquo;{currentQuestion.question}&rdquo;
          </p>
        </div>

        {/* Neuro Insight Box */}
        <div
          className={`p-3.5 rounded-xl border flex gap-2.5 items-start ${
            isLight
              ? "bg-amber-50/60 border-amber-200 text-slate-700"
              : "bg-slate-800/40 border-slate-700/50 text-slate-400"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <span className={`font-semibold ${isLight ? "text-slate-900" : "text-slate-300"}`}>
              {lang === "ar" ? "الإضاءة العصبية والسريرية: " : "Neuroscience insight: "}
            </span>
            {currentQuestion.neuroInsight}
          </p>
        </div>
      </div>

      {/* Likert Scale Options */}
      <div className="py-6 space-y-2.5">
        <div className={`text-xs font-semibold px-1 mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {lang === "ar" ? "اختر التكرار الصادق لواقعك:" : "Select honest frequency:"}
        </div>
        {likertOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelectScore(opt.value)}
            className={`w-full p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
              isLight
                ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-sm"
                : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-white"
            }`}
          >
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <span className="text-sm font-semibold group-hover:text-emerald-500 transition-colors block">
                {opt.label}
              </span>
              <span className={`text-xs block ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {opt.description}
              </span>
            </div>
            <div
              className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                isLight
                  ? "bg-slate-100 border-slate-200 text-slate-700"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {opt.value}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
