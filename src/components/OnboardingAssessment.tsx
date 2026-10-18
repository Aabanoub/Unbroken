"use client";

import React, { useState } from "react";
import { ASSESSMENT_QUESTIONS, LIKERT_OPTIONS } from "@/lib/constants";
import { AddictionTier, UserProfile } from "@/types";
import {
  Brain,
  Shield,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Activity,
  Zap,
} from "lucide-react";

interface OnboardingAssessmentProps {
  initialProfile: UserProfile;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingAssessment: React.FC<OnboardingAssessmentProps> = ({
  initialProfile,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showReport, setShowReport] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [nameInput, setNameInput] = useState(initialProfile.displayName || "Disciple");

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100);

  const handleSelectScore = (score: number) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: score };
    setAnswers(nextAnswers);

    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate total score 0 to 32
      const total = Object.values(nextAnswers).reduce((a, b) => a + b, 0);
      setCalculatedScore(total);
      setShowReport(true);
    }
  };

  const getTierDetails = (score: number): {
    tier: AddictionTier;
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
        goalDays: 21,
        dopamineSens: 70,
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        description:
          "Your brain is experiencing situational cues, boredom loops, and mild dopamine habituation. With intentional environmental boundaries and 21 days of consecrated fasting from lust, your prefrontal cortex can quickly decouple this automatic loop.",
        verseRef: "1 Corinthians 10:13",
        verseText:
          "No temptation has overtaken you except such as is common to man; but God is faithful, who will not allow you to be tempted beyond what you are able..."
      };
    } else if (score <= 21) {
      return {
        tier: "Level 2 — Moderate Compulsive Dependency",
        goalDays: 40,
        dopamineSens: 45,
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        description:
          "Your nervous system has conditioned pornography as an emotional escape (HALT: Hungry, Angry, Lonely, Tired). Your dopamine receptors have begun downregulating. A 40-Day Wilderness fast with daily Scripture renewal will prune compulsive pathways and restore emotional equilibrium.",
        verseRef: "Romans 12:2",
        verseText:
          "And do not be conformed to this world, but be transformed by the renewing of your mind..."
      };
    } else {
      return {
        tier: "Level 3 — High Neurological Dependency",
        goalDays: 90,
        dopamineSens: 20,
        color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
        description:
          "High neurological conditioning has created deep Delta-FosB neural groves and significant dopamine tolerance. You may experience acute withdrawal symptoms (flatline, irritability). A comprehensive 90-Day Neuroplasticity Reboot backed by Christ's grace will physically rewire your prefrontal executive brakes.",
        verseRef: "2 Timothy 1:7",
        verseText:
          "For God has not given us a spirit of fear, but of power and of love and of a sound mind."
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
      <div className="min-h-screen bg-[#090D16] text-slate-100 p-5 flex flex-col justify-between max-w-md mx-auto">
        <div className="space-y-6 pt-6">
          {/* Header Badge */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnostic Baseline Complete
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Clinical & Spiritual Baseline
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Your customized recovery roadmap based on CPUI-9 & BPS psychometrics.
            </p>
          </div>

          {/* Name Confirmation Input */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Your Name or Disciple Alias:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full mt-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Nathaniel"
            />
          </div>

          {/* Diagnosis Card */}
          <div className={`p-5 rounded-2xl border ${details.color} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Neurological Severity Tier
              </span>
              <span className="text-lg font-black">{calculatedScore} / 32 pts</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{details.tier}</h2>
            <p className="text-xs leading-relaxed text-slate-300">{details.description}</p>
          </div>

          {/* Metrics Dual Gauge */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                <Shield className="w-4 h-4 text-emerald-400" />
                Target Journey
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-white">{details.goalDays}</span>
                <span className="text-xs text-slate-400 ml-1">Days</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Conceiving victory one day at a time</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                <Activity className="w-4 h-4 text-cyan-400" />
                Dopamine Sensitivity
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-white">{details.dopamineSens}%</span>
                <span className="text-xs text-slate-400 ml-1">Baseline</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Will recover toward 100% with clean days</p>
            </div>
          </div>

          {/* Scripture Anchor */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              Your Anchor NKJV Scripture
            </div>
            <p className="text-xs italic text-slate-300 leading-relaxed font-serif">
              "{details.verseText}"
            </p>
            <div className="text-right text-xs font-bold text-amber-400">
              — {details.verseRef} (NKJV)
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="py-6">
          <button
            onClick={finishAssessment}
            className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <span>Begin My Unbroken Journey</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // --- QUESTION SCREEN ---
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 p-5 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Bar */}
      <div className="pt-4 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Brain className="w-4 h-4" />
            Scientific Baseline Assessment
          </span>
          <span>Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Category & Title */}
        <div className="pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {currentQuestion.category.replace("_", " ")}
          </span>
          <h2 className="text-lg font-bold text-white mt-1 leading-snug">
            {currentQuestion.title}
          </h2>
        </div>

        {/* Question Text */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md">
          <p className="text-sm font-medium text-slate-200 leading-relaxed">
            "{currentQuestion.question}"
          </p>
        </div>

        {/* Neuro Insight Box */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex gap-2.5 items-start">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Neuroscience insight: </span>
            {currentQuestion.neuroInsight}
          </p>
        </div>
      </div>

      {/* Likert Scale Options */}
      <div className="py-6 space-y-2.5">
        <div className="text-xs font-semibold text-slate-400 px-1 mb-1">
          Select honest frequency:
        </div>
        {LIKERT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelectScore(opt.value)}
            className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
          >
            <div className="text-left">
              <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                {opt.label}
              </span>
              <span className="text-xs text-slate-500 block">
                {opt.description}
              </span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 transition-all">
              {opt.value}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
