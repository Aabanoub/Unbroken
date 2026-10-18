"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  AlertTriangle,
  Wind,
  Shield,
  Activity,
  CheckCircle2,
  X,
  Volume2,
  ChevronRight,
  Flame,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Language, ThemeMode } from "@/types";
import { getTranslation } from "@/lib/i18n";

interface UrgeRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory: (journalNote?: string) => void;
  lang?: Language;
  theme?: ThemeMode;
}

type Stage = 1 | 2 | 3 | 4; // 1: Box Breathing, 2: Sword of Spirit, 3: Pattern Interrupt, 4: Victory Celebration

const SWORD_VERSES_EN = [
  {
    ref: "1 Corinthians 10:13 (NKJV)",
    text: "No temptation has overtaken you except such as is common to man; but God is faithful, who will not allow you to be tempted beyond what you are able, but with the temptation will also make the way of escape, that you may be able to bear it."
  },
  {
    ref: "2 Timothy 2:22 (NKJV)",
    text: "Flee also youthful lusts; but pursue righteousness, faith, love, peace with those who call on the Lord out of a pure heart."
  },
  {
    ref: "Psalm 119:9, 11 (NKJV)",
    text: "How can a young man cleanse his way? By taking heed according to Your word... Your word I have hidden in my heart, that I might not sin against You."
  },
  {
    ref: "Galatians 5:16 (NKJV)",
    text: "I say then: Walk in the Spirit, and you shall not fulfill the lust of the flesh."
  }
];

const SWORD_VERSES_AR = [
  {
    ref: "١ كورنثوس ١٠: ١٣",
    text: "لَمْ تُصِبْكُمْ تَجْرِبَةٌ إِلاَّ بَشَرِيَّةٌ. وَلكِنَّ اللهَ أَمِينٌ، الَّذِي لاَ يَدَعُكُمْ تُجَرَّبُونَ فَوْقَ مَا تَسْتَطِيعُونَ، بَلْ سَيَجْعَلُ مَعَ التَّجْرِبَةِ أَيْضاً الْمَنْفَذَ، لِتَسْتَطِيعُوا أَنْ تَحْتَمِلُوا."
  },
  {
    ref: "٢ تيموثاوس ٢: ٢٢",
    text: "أَمَّا الشَّهَوَاتُ الشَّبَابِيَّةُ فَاهْرُبْ مِنْهَا، وَاتَّبِعِ الْبِرَّ وَالإِيمَانَ وَالْمَحَبَّةَ وَالسَّلاَمَ مَعَ الَّذِينَ يَدْعُونَ الرَّبَّ مِنْ قَلْبٍ نَقِيٍّ."
  },
  {
    ref: "مزمور ١١٩: ٩، ١١",
    text: "بِمَ يُزَكِّي الشَّابُّ طَرِيقَهُ؟ بِحِفْظِهِ إِيَّاهُ حَسَبَ كَلاَمِكَ... خَبَّأْتُ كَلاَمَكَ فِي قَلْبِي لِكَيْلاَ أُخْطِئَ إِلَيْكَ."
  },
  {
    ref: "غلاطية ٥: ١٦",
    text: "وَإِنَّمَا أَقُولُ: اسْلُكُوا بِالرُّوحِ فَلاَ تُكَمِّلُوا شَهْوَةَ الْجَسَدِ."
  }
];

export const UrgeRescueModal: React.FC<UrgeRescueModalProps> = ({
  isOpen,
  onClose,
  onVictory,
  lang = "en",
  theme = "dark",
}) => {
  const [stage, setStage] = useState<Stage>(1);

  // Stage 1: Box breathing timer (60s total, cycles of 16s: 4s inhale, 4s hold, 4s exhale, 4s hold)
  const [timeLeft, setTimeLeft] = useState(60);
  const [breathePhase, setBreathePhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold Empty">("Inhale");
  const [breatheSeconds, setBreatheSeconds] = useState(4);

  // Stage 2: Read Aloud Counter
  const [readCount, setReadCount] = useState(0);
  const [verseIndex, setVerseIndex] = useState(0);

  // Stage 3: Physical Checkboxes
  const [checklist, setChecklist] = useState({
    leaveRoom: false,
    pushups: false,
    coldWater: false,
    phoneAway: false,
  });

  const t = getTranslation(lang);
  const isLight = theme === "light";
  const verses = lang === "ar" ? SWORD_VERSES_AR : SWORD_VERSES_EN;
  const currentVerse = verses[verseIndex % verses.length];

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStage(1);
      setTimeLeft(60);
      setReadCount(0);
      setChecklist({
        leaveRoom: false,
        pushups: false,
        coldWater: false,
        phoneAway: false,
      });
    }
  }, [isOpen]);

  // Box Breathing Countdown effect
  useEffect(() => {
    if (!isOpen || stage !== 1) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStage(2);
          return 0;
        }
        return prev - 1;
      });

      // 16-second breathing cycle
      setBreatheSeconds((prev) => {
        if (prev <= 1) {
          setBreathePhase((phase) => {
            if (phase === "Inhale") return "Hold";
            if (phase === "Hold") return "Exhale";
            if (phase === "Exhale") return "Hold Empty";
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, stage]);

  if (!isOpen) return null;

  const handleDefeatedUrge = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#38BDF8", "#F59E0B"],
      });
    } catch {
      // ignore
    }

    setStage(4);
    setTimeout(() => {
      onVictory(
        lang === "ar"
          ? "تم الانتصار على الشهوة ببروتوكول SOS ثلاثي المراحل."
          : "Defeated urgent temptation using 3-stage SOS Intervention."
      );
      onClose();
    }, 2200);
  };

  const getPhaseText = () => {
    if (lang === "ar") {
      switch (breathePhase) {
        case "Inhale":
          return "شهيق عميق";
        case "Hold":
          return "حبس النفس";
        case "Exhale":
          return "زفير بطيء";
        case "Hold Empty":
          return "سكون وتفريغ";
      }
    }
    return breathePhase;
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

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            {t.sos.badge}
          </span>
          <span
            className={`text-xs font-semibold ${
              lang === "ar" ? "mr-auto pl-8" : "ml-auto pr-8"
            } ${isLight ? "text-slate-500" : "text-slate-500"}`}
          >
            {lang === "ar" ? `المرحلة ${stage} من ٣` : `Stage ${stage} of 3`}
          </span>
        </div>

        {/* ======================================================== */}
        {/* STAGE 1: 60-SECOND BOX BREATHING (NERVOUS SYSTEM RESET) */}
        {/* ======================================================== */}
        {stage === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 py-2">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                {t.sos.step1Title}
              </h2>
              <p className={`text-xs mt-1 max-w-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {t.sos.step1Sub}
              </p>
            </div>

            {/* Glowing Breathing Circle */}
            <div className="relative w-52 h-52 flex items-center justify-center my-4">
              <div
                className={`absolute inset-0 rounded-full border-2 border-emerald-500/40 transition-all duration-1000 ${
                  breathePhase === "Inhale"
                    ? "scale-110 shadow-2xl shadow-emerald-500/30 bg-emerald-500/10"
                    : breathePhase === "Hold"
                    ? "scale-110 shadow-2xl shadow-cyan-500/30 bg-cyan-500/10 border-cyan-400/50"
                    : breathePhase === "Exhale"
                    ? "scale-90 shadow-md shadow-slate-700/20 bg-slate-900/40 border-slate-600/40"
                    : "scale-85 bg-slate-950 border-slate-800"
                }`}
              />

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">
                  {getPhaseText()}
                </span>
                <span
                  className={`text-4xl font-extrabold ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                >
                  {breatheSeconds}s
                </span>
                <span
                  className={`text-[11px] mt-1 font-mono ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {lang === "ar" ? `${timeLeft} ثانية متبقية` : `${timeLeft}s total left`}
                </span>
              </div>
            </div>

            <div
              className={`w-full rounded-2xl p-3 border text-xs ${
                isLight
                  ? "bg-emerald-50/60 border-emerald-200 text-slate-800"
                  : "bg-slate-900/80 border-slate-800 text-slate-300"
              }`}
            >
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {lang === "ar" ? "التقنية المتبعة: " : "Technique: "}
              </span>
              {t.sos.boxDesc}
            </div>

            <div className="w-full flex gap-3 pt-2">
              <button
                onClick={() => setStage(2)}
                className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                  isLight
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                }`}
              >
                <span>{lang === "ar" ? "تمت تهدئة الجهاز العصبي ← الخطوة التالية" : "Nervous System Calmed → Next Step"}</span>
                <ChevronRight className={`w-4 h-4 text-emerald-500 ${lang === "ar" ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: THE SWORD OF THE SPIRIT (SCRIPTURE TRUTH)       */}
        {/* ======================================================== */}
        {stage === 2 && (
          <div className="flex flex-col space-y-5 py-2">
            <div>
              <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                <Shield className="w-5 h-5 text-amber-500" />
                {t.sos.step3Title}
              </h2>
              <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {t.sos.step3Sub}
              </p>
            </div>

            {/* Scripture Card */}
            <div
              className={`p-5 rounded-2xl border space-y-3 shadow-lg ${
                isLight
                  ? "bg-gradient-to-br from-white to-amber-50/50 border-amber-300"
                  : "bg-gradient-to-br from-slate-900 to-slate-800/90 border-amber-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {currentVerse.ref}
                </span>
                <button
                  onClick={() => setVerseIndex((prev) => (prev + 1) % verses.length)}
                  className={`text-[11px] underline ${
                    isLight ? "text-slate-600 hover:text-slate-900" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang === "ar" ? "آية أخرى" : "Switch Verse"}
                </button>
              </div>

              <p
                className={`text-sm italic font-serif leading-relaxed ${
                  isLight ? "text-slate-800" : "text-slate-100"
                }`}
              >
                &ldquo;{currentVerse.text}&rdquo;
              </p>
            </div>

            {/* Read Aloud Counter Prompt */}
            <div
              className={`p-4 rounded-xl border text-center space-y-2 ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900 border-slate-800"
              }`}
            >
              <div
                className={`flex items-center justify-center gap-2 text-xs font-semibold ${
                  isLight ? "text-slate-700" : "text-slate-300"
                }`}
              >
                <Volume2 className="w-4 h-4 text-cyan-500" />
                <span>{lang === "ar" ? "اقرأ هذه الآية بصوت مسموع ٣ مرات" : "Read this Scripture aloud 3 times"}</span>
              </div>
              <div className="flex justify-center gap-3 pt-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setReadCount(num)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      readCount >= num
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                        : isLight
                        ? "bg-white text-slate-600 border border-slate-300"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {lang === "ar" ? `قراءة ${num}` : `Read #${num}`} {readCount >= num ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStage(3)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>{lang === "ar" ? "تثبيت الذهن بالحق ← خطوة عملية" : "Mind Anchored in Truth → Take Physical Action"}</span>
              <ChevronRight className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`} />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: PHYSICAL PATTERN INTERRUPT                     */}
        {/* ======================================================== */}
        {stage === 3 && (
          <div className="flex flex-col space-y-5 py-2">
            <div>
              <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}>
                <Activity className="w-5 h-5 text-cyan-500" />
                {lang === "ar" ? "كسر النمط الفسيولوجي بالجسد" : "Physical Pattern Interrupt"}
              </h2>
              <p className={`text-xs mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {lang === "ar"
                  ? "لا يمكنك هزيمة شهوة وأنت مستلقٍ وحدك في السرير مع شاشة. تحرك الآن فوراً!"
                  : "You cannot defeat an urge while lying alone in bed with a screen. Move your muscles immediately."}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {(lang === "ar"
                ? [
                    {
                      key: "leaveRoom" as const,
                      label: "قف واخرج من هذه الغرفة فوراً",
                      sub: "غيّر البيئة المحيطة بك في هذه اللحظة بالذات.",
                    },
                    {
                      key: "pushups" as const,
                      label: "قم بعمل ٢٠ ضغطة أو تمارين قفز الآن",
                      sub: "يحرق الأدرينالين ويسحب تدفق الدم بعيداً عن منطقة الشهوة.",
                    },
                    {
                      key: "coldWater" as const,
                      label: "اغسل وجهك بماء مثلج فوراً",
                      sub: "ينشط منعكس الغطس العصبي لخفض نبضات القلب وإخماد الشهوة.",
                    },
                    {
                      key: "phoneAway" as const,
                      label: "اترك هاتفك في غرفة أخرى أو على الشاحن",
                      sub: "اقطع قناة الدوبامين السريعة المسببة للإدمان.",
                    },
                  ]
                : [
                    {
                      key: "leaveRoom" as const,
                      label: "Stand up and leave this room immediately",
                      sub: "Change your physical environment right now.",
                    },
                    {
                      key: "pushups" as const,
                      label: "Do 20 pushups or 30 jumping jacks right now",
                      sub: "Burns adrenaline and flushes excess blood away from genitals.",
                    },
                    {
                      key: "coldWater" as const,
                      label: "Splash cold water on your face",
                      sub: "Activates the mammalian dive reflex to drop heart rate instantly.",
                    },
                    {
                      key: "phoneAway" as const,
                      label: "Put your phone in another room or on charger",
                      sub: "Sever the immediate dopamine loop conduit.",
                    },
                  ]
              ).map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`w-full p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    lang === "ar" ? "text-right" : "text-left"
                  } ${
                    checklist[item.key]
                      ? isLight
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : isLight
                      ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      checklist[item.key]
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : isLight
                        ? "border-slate-300 bg-white"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {checklist[item.key] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className={`text-[11px] mt-0.5 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                      {item.sub}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleDefeatedUrge}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
              >
                <Trophy className="w-5 h-5 text-amber-950" />
                <span>{lang === "ar" ? "انتصرت على هذه الشهوة بنعمة الله!" : "I Defeated This Urge!"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 4: VICTORY CELEBRATION MODAL                      */}
        {/* ======================================================== */}
        {stage === 4 && (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-bounce">
              <Trophy className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className={`text-2xl font-black ${isLight ? "text-slate-900" : "text-white"}`}>
              {lang === "ar" ? "نصرة عظيمة في المسيح يسوع!" : "VICTORY IN CHRIST!"}
            </h2>
            <p className={`text-xs max-w-xs ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {lang === "ar"
                ? "«شُكْراً للهِ الَّذِي يُعْطِينَا الْغَلَبَةَ بِرَبِّنَا يَسُوعَ الْمَسِيحِ.» — ١ كورنثوس ١٥: ٥٧"
                : '"Thanks be to God, who gives us the victory through our Lord Jesus Christ." — 1 Corinthians 15:57'}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              {lang === "ar" ? "+١ شهوة مهزومة أضيفت إلى حسابك" : "+1 Urge Defeated Added to Profile"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
