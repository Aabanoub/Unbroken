"use client";

import React, { useState } from "react";
import { AuthUser, Language, ThemeMode } from "@/types";
import { useStorage } from "@/context/StorageContext";
import { authenticateUser, registerNewUser, loginAsDemoGuest, getLocalAccountsRegistry } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getTranslation, getLocalizedErrorMessage } from "@/lib/i18n";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Globe,
  Sun,
  Moon,
  Loader2,
  UserPlus,
  LogIn,
} from "lucide-react";

interface AuthGateProps {
  children?: React.ReactNode;
  lang?: Language;
  theme?: ThemeMode;
  onToggleLang?: (l?: Language) => void;
  onToggleTheme?: (t?: ThemeMode) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  children,
  lang: propLang,
  theme: propTheme,
  onToggleLang,
  onToggleTheme,
}) => {
  const { user, profile, setUserSession } = useStorage();

  // Default to 'signup' (Create Account) for new visitors; only default to 'login' if an account already exists on device
  const [mode, setMode] = useState<"signup" | "login">(() => {
    if (typeof window !== "undefined") {
      const accounts = getLocalAccountsRegistry();
      if (accounts && accounts.length > 0) return "login";
    }
    return "signup";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fallback to profile language/theme or prop
  const currentLang: Language = propLang || profile?.language || "en";
  const currentTheme: ThemeMode = propTheme || profile?.theme || "dark";
  const isLight = currentTheme === "light";
  const t = getTranslation(currentLang);

  // If user is already authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage(t.auth?.errEmpty || "Please enter both email and password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t.auth?.errPassShort || "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await authenticateUser(email, password);
        if (res.success && res.user) {
          setUserSession(res.user);
        } else {
          setErrorMessage(
            getLocalizedErrorMessage(res.error, currentLang) ||
              t.auth?.errNoAccount ||
              "Invalid login credentials."
          );
        }
      } else {
        const res = await registerNewUser(email, password, displayName);
        if (res.success && res.user) {
          setUserSession(res.user);
        } else {
          setErrorMessage(
            getLocalizedErrorMessage(res.error, currentLang) ||
              t.auth?.errGeneral ||
              "Registration failed. Please try again."
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(
        getLocalizedErrorMessage(err.message, currentLang) ||
          t.auth?.errGeneral ||
          "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    const demoUser = loginAsDemoGuest();
    setUserSession(demoUser);
  };

  return (
    <div
      dir={currentLang === "ar" ? "rtl" : "ltr"}
      className={`min-h-screen ${
        isLight ? "light bg-slate-50 text-slate-900" : "dark bg-[#090D16] text-slate-100"
      } flex flex-col justify-between p-5 max-w-md mx-auto transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-200`}
    >
      {/* Top Bar: Subtitle & Language / Theme Toggles */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentLang === "ar" ? "محرك الاسترداد اليومي" : "Unbroken Daily Engine"}</span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleLang && (
            <button
              onClick={() => onToggleLang()}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                isLight
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
              title={currentLang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{currentLang === "ar" ? "English" : "العربية"}</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={() => onToggleTheme()}
              className={`p-1.5 rounded-xl text-xs border transition-all ${
                isLight
                  ? "bg-white border-slate-200 text-amber-600 hover:bg-slate-100 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800"
              }`}
              title={isLight ? "Dark Mode" : "Light Mode"}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Top Branding */}
      <div className="pt-4 flex flex-col items-center text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/20 border-2 border-emerald-400/40">
          <Shield className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h1
            className={`text-3xl font-black tracking-tight ${
              isLight ? "text-slate-900" : "text-white"
            }`}
          >
            {t.brand?.appName || "Unbroken"}
          </h1>
          <p
            className={`text-xs font-semibold tracking-wider mt-0.5 ${
              isLight ? "text-emerald-700 font-bold" : "text-emerald-400 uppercase"
            }`}
          >
            {t.brand?.slogan || "Clear Eyes, Clean Mind."}
          </p>
        </div>

        <p
          className={`text-xs max-w-xs leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          &ldquo;{t.brand?.proverbsText || "For a righteous man may fall seven times and rise again."}&rdquo; —{" "}
          <span className="font-semibold">{t.brand?.proverbsRef || "Proverbs 24:16"}</span>
        </p>
      </div>

      {/* Main Auth Card */}
      <div
        className={`my-6 p-6 rounded-3xl border shadow-2xl space-y-5 transition-colors ${
          isLight
            ? "bg-white border-slate-200/90 shadow-slate-200/50"
            : "bg-slate-900/90 border-slate-800"
        }`}
      >
        {/* Tab Switcher: Create Account is primary for new users */}
        <div
          className={`flex rounded-2xl p-1 text-xs font-semibold border ${
            isLight ? "bg-slate-100 border-slate-200" : "bg-slate-950 border-slate-800"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === "signup"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.auth?.createAccount || "Create Account"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : isLight
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.auth?.signIn || "Sign In"}</span>
          </button>
        </div>

        {/* Error Alert with Quick Switch to Sign Up if account not found */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs space-y-2 animate-fade-in">
            <div className="flex items-start gap-2">
              <span className="shrink-0 text-base">⚠️</span>
              <span className="font-medium leading-relaxed">{errorMessage}</span>
            </div>
            {mode === "login" && (
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-500/30"
              >
                <span>
                  {currentLang === "ar"
                    ? "ليس لديك حساب بعد؟ انقر هنا لإنشاء حسابك الآن"
                    : "No account yet? Click here to Create Account now"}
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${currentLang === "ar" ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? "text-slate-600" : "text-slate-400"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {t.auth?.nameLabel || "Name / Alias"}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t.auth?.namePlaceholder || "e.g., Nathaniel"}
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 border ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    : "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                }`}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              {t.auth?.emailLabel || "Email"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth?.emailPlaceholder || "you@example.com"}
              className={`w-full rounded-xl px-3.5 py-2.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 border ${
                isLight
                  ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  : "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? "text-slate-600" : "text-slate-400"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              {t.auth?.passwordLabel || "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-xl px-3.5 py-2.5 text-xs transition-colors focus:outline-none focus:border-emerald-500 border ${
                  currentLang === "ar" ? "pl-10 pr-3.5" : "pr-10 pl-3.5"
                } ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    : "bg-slate-950 border-slate-800 text-white placeholder-slate-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${
                  currentLang === "ar" ? "left-3" : "right-3"
                } top-2.5 text-slate-400 hover:text-slate-600`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:opacity-50 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.auth?.connecting || "Authenticating..."}</span>
              </span>
            ) : mode === "signup" ? (
              <>
                <span>{t.auth?.submitSignUp || "Create Unbroken Account"}</span>
                <ArrowRight className={`w-4 h-4 ${currentLang === "ar" ? "rotate-180" : ""}`} />
              </>
            ) : (
              <>
                <span>{t.auth?.submitSignIn || "Sign In to Unbroken"}</span>
                <ArrowRight className={`w-4 h-4 ${currentLang === "ar" ? "rotate-180" : ""}`} />
              </>
            )}
          </button>

          {/* Quick Helper Toggle Link */}
          <div className="text-center pt-1">
            {mode === "signup" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className={`text-[11px] font-semibold underline underline-offset-4 transition-colors ${
                  isLight ? "text-slate-600 hover:text-emerald-600" : "text-slate-400 hover:text-emerald-400"
                }`}
              >
                {currentLang === "ar"
                  ? "لديك حساب بالفعل؟ تسجيل الدخول"
                  : "Already have an account? Sign In"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className={`text-[11px] font-semibold underline underline-offset-4 transition-colors ${
                  isLight ? "text-slate-600 hover:text-emerald-600" : "text-slate-400 hover:text-emerald-400"
                }`}
              >
                {currentLang === "ar"
                  ? "مستخدم جديد؟ إنشاء حساب للبدء"
                  : "New to Unbroken? Create Account to begin"}
              </button>
            )}
          </div>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className={`border-t w-full ${isLight ? "border-slate-200" : "border-slate-800"}`} />
          <span
            className={`px-3 text-[10px] uppercase tracking-widest font-semibold shrink-0 ${
              isLight ? "bg-white text-slate-500" : "bg-slate-900 text-slate-500"
            }`}
          >
            {t.auth?.orQuick || "Or Continue With"}
          </span>
          <div className={`border-t w-full ${isLight ? "border-slate-200" : "border-slate-800"}`} />
        </div>

        {/* Quick Demo Account Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between group ${
            isLight
              ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              : "bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300"
          }`}
        >
          <div className="flex items-center gap-2.5 text-left">
            <span className="text-base">👤</span>
            <div className={currentLang === "ar" ? "text-right" : "text-left"}>
              <span className={`font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>
                {t.auth?.demoBtnTitle || "Quick Demo Account"}
              </span>
              <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                {t.auth?.demoBtnSub || "Preview full features with seed streak data"}
              </span>
            </div>
          </div>
          <ArrowRight
            className={`w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors ${
              currentLang === "ar" ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Data Isolation & Privacy Guarantee */}
        <div
          className={`p-3 rounded-xl border text-[10px] leading-relaxed space-y-1 ${
            isLight
              ? "bg-emerald-50/60 border-emerald-200/80 text-slate-700"
              : "bg-slate-950/60 border-slate-800/80 text-slate-400"
          }`}
        >
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
            <CheckCircle2 className="w-3 h-3" />
            {t.auth?.privacyBadge || "Strict Zero-Knowledge Cloud Isolation"}
          </div>
          <p>
            {t.auth?.privacyDesc ||
              "Your logs and profile are protected by PostgreSQL Row-Level Security. Only you can access your recovery history."}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`pb-4 text-center text-[10px] flex items-center justify-center gap-2 ${
          isLight ? "text-slate-500" : "text-slate-500"
        }`}
      >
        {isSupabaseConfigured ? (
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Database className="w-3 h-3" /> {t.auth?.cloudActive || "Multi-Device Supabase Active"}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" /> {t.auth?.offlineActive || "Local Offline Mode Active"}
          </span>
        )}
      </div>
    </div>
  );
};
