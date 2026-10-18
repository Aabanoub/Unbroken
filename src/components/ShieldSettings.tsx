"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, AuthUser, Language, ThemeMode } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getTranslation } from "@/lib/i18n";
import {
  isBiometricsAvailable,
  isBiometricEnrolled,
  enrollBiometrics,
  disableBiometrics,
} from "@/lib/biometrics";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  RotateCcw,
  Database,
  CheckCircle2,
  Brain,
  BookOpen,
  Layers,
  ArrowRight,
  LogOut,
  User,
  Globe,
  Sun,
  Moon,
  Fingerprint,
} from "lucide-react";

interface ShieldSettingsProps {
  profile: UserProfile;
  currentUser: AuthUser | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onRetakeAssessment: () => void;
  onResetData: (type: "fresh" | "demo") => void;
  onLockApp: () => void;
  onSignOut: () => void;
  lang?: Language;
  theme?: ThemeMode;
  onToggleLang?: (lang: Language) => void;
  onToggleTheme?: (theme: ThemeMode) => void;
}

export const ShieldSettings: React.FC<ShieldSettingsProps> = ({
  profile,
  currentUser,
  onUpdateProfile,
  onRetakeAssessment,
  onResetData,
  onLockApp,
  onSignOut,
  lang = "en",
  theme = "dark",
  onToggleLang,
  onToggleTheme,
}) => {
  const [pinInput, setPinInput] = useState(profile.pinCode || "");
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [pinSavedMsg, setPinSavedMsg] = useState(false);
  const [showScienceModal, setShowScienceModal] = useState(false);
  const [confirmFreshModal, setConfirmFreshModal] = useState(false);
  const [bioSupported, setBioSupported] = useState(false);
  const [bioEnrolled, setBioEnrolled] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioMsg, setBioMsg] = useState<string | null>(null);

  const t = getTranslation(lang);
  const isLight = theme === "light";

  useEffect(() => {
    const activeId = currentUser?.id || profile.id;
    isBiometricsAvailable().then((supported) => {
      setBioSupported(supported);
      if (supported) {
        setBioEnrolled(isBiometricEnrolled(activeId));
      }
    });
  }, [currentUser?.id, profile.id]);

  const handleToggleBiometrics = async () => {
    const activeId = currentUser?.id || profile.id;
    if (bioEnrolled) {
      disableBiometrics(activeId);
      setBioEnrolled(false);
      setBioMsg(null);
    } else {
      setBioLoading(true);
      setBioMsg(null);
      const res = await enrollBiometrics(
        activeId,
        profile.displayName || currentUser?.displayName || "Disciple"
      );
      setBioLoading(false);
      if (res.success) {
        setBioEnrolled(true);
        setBioMsg(t.shield.bioSuccess);
        setTimeout(() => setBioMsg(null), 3000);
      } else if (res.error) {
        setBioMsg(res.error);
      }
    }
  };

  const handleSavePin = () => {
    if (pinInput.length === 4 && /^\d+$/.test(pinInput)) {
      onUpdateProfile({ pinCode: pinInput });
      setIsEditingPin(false);
      setPinSavedMsg(true);
      setTimeout(() => setPinSavedMsg(false), 2500);
    }
  };

  const handleRemovePin = () => {
    onUpdateProfile({ pinCode: null });
    setPinInput("");
    setIsEditingPin(false);
  };

  const handleToggleDisguise = () => {
    onUpdateProfile({ disguiseTitle: !profile.disguiseTitle });
  };

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Top Header */}
      <div className="px-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? "text-emerald-700" : "text-emerald-400"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          {t.shield.title}
        </span>
        <h1
          className={`text-xl font-black tracking-tight mt-0.5 ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {t.shield.subtitle}
        </h1>
        <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {t.shield.desc}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 0. ACTIVE USER ACCOUNT & SESSION                         */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.shield.activeAccount}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {currentUser?.email || (lang === "ar" ? "حساب محلي للمجاهد" : "Local Disciple Account")}
              </p>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.shield.signOut}</span>
          </button>
        </div>

        <div
          className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
            isLight
              ? "bg-slate-50 border-slate-200"
              : "bg-slate-950 border-slate-800/80"
          }`}
        >
          <div>
            <span
              className={`block text-[10px] uppercase font-bold ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {t.shield.discipleName}
            </span>
            <span
              className={`font-bold text-sm ${isLight ? "text-slate-900" : "text-white"}`}
            >
              {profile.displayName || currentUser?.displayName}
            </span>
          </div>

          <div className="text-right">
            <span
              className={`block text-[10px] uppercase font-bold ${
                isLight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              {t.shield.dataPrivacy}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" /> {t.shield.isolatedBadge}
            </span>
          </div>
        </div>

        <p className={`text-[10px] leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {t.shield.isolatedDesc} ({profile.id}).
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. LANGUAGE & THEME PREFERENCES (NEW OPTIONS)           */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
            }`}
          >
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {t.shield.langTitle}
            </span>
            <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t.shield.langDesc}
            </p>
          </div>
        </div>

        {/* Language Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggleLang && onToggleLang("ar")}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              lang === "ar"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                : isLight
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span>🇸🇦</span>
            <span>العربية (Arabic RTL)</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleLang && onToggleLang("en")}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              lang === "en"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                : isLight
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span>🇺🇸</span>
            <span>English (LTR)</span>
          </button>
        </div>

        <div className="border-t my-2 border-slate-200 dark:border-slate-800" />

        {/* Theme Toggles */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
            }`}
          >
            {isLight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {t.shield.themeTitle}
            </span>
            <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {t.shield.themeDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme("light")}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              theme === "light"
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                : isLight
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>{t.shield.themeLight}</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme("dark")}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              theme === "dark"
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                : isLight
                ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>{t.shield.themeDark}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DISCREET PRIVACY PIN LOCK                             */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.shield.pinTitle}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {profile.pinCode ? t.shield.pinActive : t.shield.pinInactive}
              </p>
            </div>
          </div>

          {profile.pinCode && (
            <button
              onClick={onLockApp}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-emerald-700"
                  : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-emerald-400"
              }`}
            >
              {t.shield.lockNow}
            </button>
          )}
        </div>

        {profile.pinCode && !isEditingPin ? (
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
              isLight
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-950 border-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className={isLight ? "text-slate-700" : "text-slate-300"}>
                PIN enabled: ****
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingPin(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                {t.shield.change}
              </button>
              <span className="text-slate-400">|</span>
              <button
                onClick={handleRemovePin}
                className="text-xs text-rose-500 font-semibold hover:underline"
              >
                {t.shield.disable}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                placeholder={t.shield.enterPin}
                className={`flex-1 rounded-xl px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:border-emerald-500 border ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900"
                    : "bg-slate-950 border-slate-800 text-white"
                }`}
              />
              <button
                onClick={handleSavePin}
                disabled={pinInput.length !== 4}
                className="px-4 py-2 rounded-xl bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all"
              >
                {t.shield.savePin}
              </button>
              {isEditingPin && (
                <button
                  onClick={() => setIsEditingPin(false)}
                  className={`px-3 py-2 rounded-xl text-xs ${
                    isLight
                      ? "bg-slate-200 text-slate-700"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {t.shield.cancel}
                </button>
              )}
            </div>
          </div>
        )}

        {pinSavedMsg && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {t.shield.pinSuccess}
          </p>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2.1 BIOMETRIC & FINGERPRINT UNLOCK                       */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-4 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.shield.bioTitle}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {bioSupported
                  ? bioEnrolled
                    ? t.shield.bioEnrolledStatus
                    : t.shield.bioNotEnrolledStatus
                  : t.shield.bioNotSupported}
              </p>
            </div>
          </div>

          {bioSupported && (
            <button
              onClick={handleToggleBiometrics}
              disabled={bioLoading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                bioEnrolled
                  ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border-rose-500/30"
                  : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
              }`}
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>
                {bioLoading
                  ? lang === "ar"
                    ? "جاري المعالجة..."
                    : "Processing..."
                  : bioEnrolled
                  ? t.shield.bioDisable
                  : t.shield.bioEnable}
              </span>
            </button>
          )}
        </div>

        <p className={`text-[11px] leading-relaxed ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {t.shield.bioDesc}
        </p>

        {bioEnrolled && (
          <div
            className={`p-3 rounded-2xl border flex items-center gap-2 text-xs ${
              isLight
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {lang === "ar"
                ? "تم تفعيل القفل ببصمة الإصبع أو الوجه لهذا الجهاز. يمكنك النقر على أيقونة البصمة في شاشة القفل لفتح التطبيق فوراً."
                : "Biometric unlock is ready on this device. Tap the fingerprint icon on the lock screen to unlock instantly."}
            </span>
          </div>
        )}

        {bioMsg && (
          <p
            className={`text-[11px] font-semibold animate-fade-in ${
              bioMsg.startsWith("✓")
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-amber-500"
            }`}
          >
            {bioMsg}
          </p>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. APP DISGUISE TOGGLE                                  */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-3 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                  : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              }`}
            >
              {profile.disguiseTitle ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.shield.disguiseTitle}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {t.shield.disguiseDesc}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggleDisguise}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              profile.disguiseTitle ? "bg-emerald-500" : isLight ? "bg-slate-300" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                profile.disguiseTitle
                  ? lang === "ar"
                    ? "-translate-x-6"
                    : "translate-x-6"
                  : lang === "ar"
                  ? "-translate-x-1"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div
          className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
            isLight
              ? "bg-slate-50 border-slate-200 text-slate-600"
              : "bg-slate-950 border-slate-800/80 text-slate-400"
          }`}
        >
          {t.shield.disguiseInfo}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. DUAL-MODE SUPABASE & LOCALSTORAGE STATUS             */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-3 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isLight
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
              }`}
            >
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {t.shield.zeroCostTitle}
              </span>
              <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {t.shield.zeroCostSub}
              </p>
            </div>
          </div>

          {isSupabaseConfigured ? (
            <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {t.shield.supabaseSynced}
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Layers className="w-3 h-3" /> {t.shield.localStorageActive}
            </span>
          )}
        </div>

        <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
          {isSupabaseConfigured ? t.shield.supabaseDesc : t.shield.localStorageDesc}
        </p>
      </div>

      {/* ======================================================== */}
      {/* 5. SCIENTIFIC ASSESSMENT RETAKE                         */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-3 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isLight
                ? "bg-purple-50 border-purple-200 text-purple-700"
                : "bg-purple-500/10 border-purple-500/30 text-purple-400"
            }`}
          >
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              {t.shield.diagnosticTitle}
            </span>
            <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              {profile.addictionTier} ({profile.onboardingScore}/32 pts)
            </p>
          </div>
        </div>

        <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
          {t.shield.diagnosticDesc}
        </p>

        <button
          onClick={onRetakeAssessment}
          className={`w-full py-3 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            isLight
              ? "bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200"
              : "bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border-purple-500/40"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.shield.retakeBtn}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 6. DATA RESET & DEMO CONTROLS                           */}
      {/* ======================================================== */}
      <div
        className={`p-5 rounded-3xl border space-y-3 shadow-xl transition-colors ${
          isLight
            ? "bg-white border-slate-200 text-slate-800 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        <span
          className={`text-xs font-bold uppercase tracking-wider block ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {t.shield.dataControlsTitle}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onResetData("demo")}
            className={`p-3 rounded-xl font-semibold text-xs border transition-all text-center ${
              isLight
                ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
            }`}
          >
            {t.shield.loadDemo}
          </button>

          <button
            onClick={() => setConfirmFreshModal(true)}
            className="p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs border border-rose-500/30 transition-all text-center"
          >
            {t.shield.startFresh}
          </button>
        </div>
      </div>

      {/* Science & Methodology Link */}
      <button
        onClick={() => setShowScienceModal(true)}
        className={`w-full p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
          isLight
            ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
            : "bg-slate-900 hover:border-emerald-500/40 border-slate-800 text-slate-300"
        }`}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold">{t.shield.methodologyBtn}</span>
        </div>
        <ArrowRight className={`w-4 h-4 text-slate-400 ${lang === "ar" ? "rotate-180" : ""}`} />
      </button>

      {/* CONFIRM FRESH SLATE MODAL */}
      {confirmFreshModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-full max-w-sm border rounded-3xl p-6 shadow-2xl space-y-4 ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0D1322] border-slate-800 text-white"
            }`}
          >
            <h3 className="text-base font-bold">{t.shield.freshConfirmTitle}</h3>
            <p className={`text-xs leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {t.shield.freshConfirmDesc}
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setConfirmFreshModal(false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold ${
                  isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-300"
                }`}
              >
                {t.shield.cancel}
              </button>
              <button
                onClick={() => {
                  setConfirmFreshModal(false);
                  onResetData("fresh");
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider"
              >
                {t.shield.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCIENCE & METHODOLOGY MODAL */}
      {showScienceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-4 ${
              isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0D1322] border-slate-800 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                {lang === "ar" ? "منهجية التعافي" : "Unbroken Methodology"}
              </span>
              <button
                onClick={() => setShowScienceModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  isLight ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                ✕
              </button>
            </div>

            <h2 className="text-lg font-bold">{t.shield.methodologyTitle}</h2>

            <div className={`space-y-3 text-xs leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
              <p>
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {t.shield.methodologyPoint1Title}:
                </strong>{" "}
                {t.shield.methodologyPoint1Desc}
              </p>
              <p>
                <strong className="text-amber-600 dark:text-amber-400">
                  {t.shield.methodologyPoint2Title}:
                </strong>{" "}
                {t.shield.methodologyPoint2Desc}
              </p>
              <p>
                <strong className="text-cyan-600 dark:text-cyan-400">
                  {t.shield.methodologyPoint3Title}:
                </strong>{" "}
                {t.shield.methodologyPoint3Desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
