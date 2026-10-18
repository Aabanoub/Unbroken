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

interface UrgeRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVictory: (journalNote?: string) => void;
}

type Stage = 1 | 2 | 3 | 4; // 1: Box Breathing, 2: Sword of Spirit, 3: Pattern Interrupt, 4: Victory Celebration

const SWORD_VERSES = [
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

export const UrgeRescueModal: React.FC<UrgeRescueModalProps> = ({
  isOpen,
  onClose,
  onVictory,
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
          // Auto advance to Stage 2 after 60s
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
    // Confetti celebration
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
      onVictory("Defeated urgent temptation using 3-stage SOS Intervention.");
      onClose();
    }, 2200);
  };

  const currentVerse = SWORD_VERSES[verseIndex];

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

        {/* Top Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" />
            SOS Urge Rescue Protocol
          </span>
          <span className="ml-auto text-xs text-slate-500 font-semibold pr-8">
            Stage {stage} of 3
          </span>
        </div>

        {/* ======================================================== */}
        {/* STAGE 1: 60-SECOND BOX BREATHING (NERVOUS SYSTEM RESET) */}
        {/* ======================================================== */}
        {stage === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 py-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Calm Your Nervous System
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Urges hijack the amygdala. Box breathing slows your heart rate and restores oxygen to your prefrontal cortex.
              </p>
            </div>

            {/* Glowing Breathing Circle */}
            <div className="relative w-52 h-52 flex items-center justify-center my-4">
              {/* Outer Pulsing Ring */}
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

              {/* Inner Circle Content */}
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                  {breathePhase}
                </span>
                <span className="text-4xl font-extrabold text-white">
                  {breatheSeconds}s
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-mono">
                  {timeLeft}s total left
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-xs text-slate-300">
              <span className="text-emerald-400 font-semibold">Technique: </span>
              Inhale 4s • Hold 4s • Exhale 4s • Hold 4s
            </div>

            {/* Actions */}
            <div className="w-full flex gap-3 pt-2">
              <button
                onClick={() => setStage(2)}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <span>Nervous System Calmed → Next Step</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 2: THE SWORD OF THE SPIRIT (NKJV TRUTH)          */}
        {/* ======================================================== */}
        {stage === 2 && (
          <div className="flex flex-col space-y-5 py-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                The Sword of the Spirit
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Jesus defeated Satan in the wilderness with spoken Scripture. Speak God's Word out loud right now.
              </p>
            </div>

            {/* Scripture Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/90 border border-amber-500/30 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {currentVerse.ref}
                </span>
                <button
                  onClick={() => setVerseIndex((prev) => (prev + 1) % SWORD_VERSES.length)}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Switch Verse
                </button>
              </div>

              <p className="text-sm italic font-serif text-slate-100 leading-relaxed">
                "{currentVerse.text}"
              </p>
            </div>

            {/* Read Aloud Counter Prompt */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Read this Scripture aloud 3 times</span>
              </div>
              <div className="flex justify-center gap-3 pt-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setReadCount(num)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      readCount >= num
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Read #{num} {readCount >= num ? "✓" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => setStage(3)}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <span>Mind Anchored in Truth → Take Physical Action</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAGE 3: PHYSICAL PATTERN INTERRUPT                     */}
        {/* ======================================================== */}
        {stage === 3 && (
          <div className="flex flex-col space-y-5 py-2">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Physical Pattern Interrupt
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                You cannot defeat an urge while lying alone in bed with a screen. Move your muscles immediately.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {[
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
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() =>
                    setChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                  }
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    checklist[item.key]
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      checklist[item.key]
                        ? "bg-emerald-500 border-emerald-400 text-slate-950"
                        : "border-slate-600 bg-slate-800"
                    }`}
                  >
                    {checklist[item.key] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Victorious Button */}
            <div className="pt-2">
              <button
                onClick={handleDefeatedUrge}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30"
              >
                <Trophy className="w-5 h-5 text-amber-950" />
                <span>I Defeated This Urge!</span>
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
              <Trophy className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-white">VICTORY IN CHRIST!</h2>
            <p className="text-xs text-slate-300 max-w-xs">
              "Thanks be to God, who gives us the victory through our Lord Jesus Christ." — 1 Corinthians 15:57
            </p>
            <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              +1 Urge Defeated Added to Profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
