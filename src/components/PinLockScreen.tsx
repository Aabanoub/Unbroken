"use client";

import React, { useState, useEffect } from "react";
import { Lock, Delete, Fingerprint, ScanFace, Sparkles } from "lucide-react";
import { Language, ThemeMode } from "@/types";
import { getTranslation } from "@/lib/i18n";
import { isBiometricsAvailable, authenticateWithBiometrics, isBiometricEnrolled } from "@/lib/biometrics";

interface PinLockScreenProps {
  correctPin: string;
  disguiseTitle: boolean;
  onUnlock: () => void;
  onResetPin?: () => void;
  lang?: Language;
  theme?: ThemeMode;
  userId?: string;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  correctPin,
  disguiseTitle,
  onUnlock,
  onResetPin,
  lang = "en",
  theme = "dark",
  userId = "default",
}) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [bioSupported, setBioSupported] = useState(false);
  const [bioAuthenticating, setBioAuthenticating] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);

  const t = getTranslation(lang);
  const isLight = theme === "light";

  useEffect(() => {
    let timer: NodeJS.Timeout;
    isBiometricsAvailable().then((supported) => {
      setBioSupported(supported);
      if (supported && isBiometricEnrolled(userId)) {
        timer = setTimeout(() => {
          handleBiometricUnlock();
        }, 350);
      }
    });
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [userId]);

  const handleBiometricUnlock = async () => {
    setBioAuthenticating(true);
    setBioError(null);
    try {
      const res = await authenticateWithBiometrics(userId);
      if (res.success) {
        onUnlock();
      } else if (res.error && !res.error.toLowerCase().includes("cancel")) {
        setBioError(
          lang === "ar"
            ? "تعذر التحقق عبر Face ID أو البصمة. يمكنك إدخال الرمز السري."
            : "Face ID / Biometric check failed. You can use your PIN code."
        );
      }
    } catch {
      // ignore cancellation
    } finally {
      setBioAuthenticating(false);
    }
  };

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);

    if (newPin.length === 4) {
      if (newPin === correctPin) {
        onUnlock();
      } else {
        setError(true);
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 700);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 max-w-md mx-auto transition-colors ${
        isLight ? "bg-slate-50 text-slate-900" : "bg-[#090D16] text-slate-100"
      }`}
    >
      {/* Header */}
      <div className="w-full pt-12 flex flex-col items-center text-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl border ${
            isLight
              ? "bg-white border-slate-200 text-emerald-600 shadow-slate-200"
              : "bg-slate-800/80 border-slate-700/60 text-emerald-400"
          }`}
        >
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {disguiseTitle ? t.brand.disguiseTitle : (lang === "ar" ? "أنبروكن اليومي" : "Unbroken Daily")}
        </h1>
        <p
          className={`text-xs mt-1 max-w-xs leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {disguiseTitle
            ? lang === "ar"
              ? "أدخل رمز المرور المكون من ٤ أرقام للمتابعة"
              : "Enter 4-digit habit passkey to continue"
            : t.brand.slogan}
        </p>

        {/* PIN Dots */}
        <div
          className={`flex gap-4 mt-8 transition-transform duration-200 ${
            error ? "animate-bounce" : ""
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? "bg-rose-500 scale-110 shadow-lg shadow-rose-500/50"
                    : filled
                    ? "bg-emerald-500 scale-110 shadow-md shadow-emerald-500/40"
                    : isLight
                    ? "bg-slate-200 border border-slate-300"
                    : "bg-slate-700/80 border border-slate-600"
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium mt-3 animate-fade-in">
            {lang === "ar" ? "الرمز غير صحيح. يرجى المحاولة مرة أخرى." : "Incorrect PIN. Try again."}
          </p>
        )}

        {bioError && (
          <p className="text-xs text-amber-500 font-medium mt-3 animate-fade-in px-4">
            {bioError}
          </p>
        )}

        {bioSupported && !error && !bioError && (
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-3 flex items-center justify-center gap-1.5 animate-fade-in">
            <ScanFace className="w-3.5 h-3.5" />
            <span>
              {bioAuthenticating
                ? lang === "ar"
                  ? "جاري التحقق عبر Face ID أو البصمة..."
                  : "Scanning Face ID / Fingerprint..."
                : lang === "ar"
                ? "يمكنك استخدام Face ID، البصمة، أو رمز PIN"
                : "Use Face ID, Fingerprint, or PIN"}
            </span>
          </p>
        )}
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs pb-10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className={`h-16 rounded-2xl active:scale-95 text-2xl font-semibold transition-all flex items-center justify-center shadow-md border ${
                isLight
                  ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-slate-100"
                  : "bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/50 text-slate-100"
              }`}
            >
              {num}
            </button>
          ))}
          <div className="flex items-center justify-center">
            {bioSupported ? (
              <button
                type="button"
                onClick={handleBiometricUnlock}
                disabled={bioAuthenticating}
                title={lang === "ar" ? "فتح القفل بـ Face ID أو البصمة" : "Unlock with Face ID or Fingerprint"}
                className={`w-16 h-16 rounded-2xl active:scale-95 transition-all flex flex-col items-center justify-center border shadow-md relative ${
                  bioAuthenticating ? "animate-pulse" : ""
                } ${
                  isLight
                    ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 shadow-emerald-50"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <ScanFace className="w-7 h-7" />
                  <Fingerprint className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-emerald-500 bg-[#090D16] dark:bg-[#090D16] rounded-full" />
                </div>
              </button>
            ) : null}
          </div>
          <button
            onClick={() => handleDigit("0")}
            className={`h-16 rounded-2xl active:scale-95 text-2xl font-semibold transition-all flex items-center justify-center shadow-md border ${
              isLight
                ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-slate-100"
                : "bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/50 text-slate-100"
            }`}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className={`h-16 rounded-2xl active:scale-95 transition-all flex items-center justify-center border ${
              isLight
                ? "bg-white hover:bg-slate-100 border-slate-200 text-slate-600 shadow-sm"
                : "bg-slate-800/40 hover:bg-slate-700/50 border-slate-700/40 text-slate-400"
            }`}
            aria-label="Delete"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        {attempts >= 3 && onResetPin && (
          <div className="text-center mt-3">
            <button
              onClick={onResetPin}
              className={`text-xs underline underline-offset-2 ${
                isLight ? "text-slate-500 hover:text-slate-800" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {lang === "ar" ? "نسيت الرمز؟ إعادة تعيين القفل" : "Forgot PIN? Reset Lock"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
