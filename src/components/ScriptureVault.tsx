"use client";

import React, { useState } from "react";
import { NKJVVerse, EmotionalCategory, SavedVerse, Language, ThemeMode } from "@/types";
import { LOCAL_NKJV_VERSES, fetchLiveNKJVVerse } from "@/data/nkjv-verses";
import { getTranslation, getLocalizedVerse } from "@/lib/i18n";
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  Globe,
  Trash2,
  PlusCircle,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

interface ScriptureVaultProps {
  savedVerses: SavedVerse[];
  onSaveVerseWithReflection: (ref: string, text: string, reflection: string) => void;
  onRemoveSavedVerse: (id: string) => void;
  lang?: Language;
  theme?: ThemeMode;
}

export const ScriptureVault: React.FC<ScriptureVaultProps> = ({
  savedVerses,
  onSaveVerseWithReflection,
  onRemoveSavedVerse,
  lang = "en",
  theme = "dark",
}) => {
  const [activeTab, setActiveTab] = useState<"catalog" | "saved">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<EmotionalCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Live API Fetcher state
  const [showLiveFetcher, setShowLiveFetcher] = useState(false);
  const [liveBook, setLiveBook] = useState("Romans");
  const [liveChapter, setLiveChapter] = useState(12);
  const [liveVerseNum, setLiveVerseNum] = useState(2);
  const [liveResult, setLiveResult] = useState<{
    reference: string;
    text: string;
    source: "live_api" | "local_fallback";
  } | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);

  // Reflection Modal state
  const [selectedVerseForSave, setSelectedVerseForSave] = useState<{
    reference: string;
    text: string;
  } | null>(null);
  const [reflectionInput, setReflectionInput] = useState("");
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const t = getTranslation(lang);
  const isLight = theme === "light";

  // Filter verses
  const displayedVerses = LOCAL_NKJV_VERSES.map((v) => getLocalizedVerse(v, lang)).filter((v) => {
    const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
    const matchesSearch =
      v.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.theme.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFetchLiveVerse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLiveLoading(true);
    try {
      const result = await fetchLiveNKJVVerse(liveBook, liveChapter, liveVerseNum);
      setLiveResult(result);
    } catch {
      // handled
    } finally {
      setLiveLoading(false);
    }
  };

  const handleSaveReflection = () => {
    if (!selectedVerseForSave) return;
    onSaveVerseWithReflection(
      selectedVerseForSave.reference,
      selectedVerseForSave.text,
      reflectionInput.trim()
    );
    setSelectedVerseForSave(null);
    setReflectionInput("");
  };

  const handleShare = (ref: string, text: string) => {
    const content = `"${text}" — ${ref}\n\n${t.brand.slogan}\n${t.brand.appName}`;
    if (navigator.share) {
      navigator.share({ title: ref, text: content }).catch(() => {});
    } else {
      navigator.clipboard.writeText(content);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  const isSaved = (ref: string) => savedVerses.some((s) => s.reference === ref);

  const categories =
    lang === "ar"
      ? [
          { id: "all", label: "جميع الآيات" },
          { id: "temptation", label: "محاربة الشهوة" },
          { id: "grace_after_relapse", label: "النعمة بعد السقوط" },
          { id: "identity", label: "الهوية في المسيح" },
          { id: "mind_renewal", label: "تجديد الذهن" },
          { id: "discipline", label: "ضبط النفس والجهاد" },
        ]
      : [
          { id: "all", label: "All Scriptures" },
          { id: "temptation", label: "Temptation" },
          { id: "grace_after_relapse", label: "Grace After Relapse" },
          { id: "identity", label: "Identity in Christ" },
          { id: "mind_renewal", label: "Mind Renewal" },
          { id: "discipline", label: "Discipline & Power" },
        ];

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Top Header */}
      <div className="px-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isLight ? "text-amber-700" : "text-amber-400"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          {t.scripture.title}
        </span>
        <h1
          className={`text-xl font-black tracking-tight mt-0.5 ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {lang === "ar" ? "سجل التأملات وكنز الآيات" : "Scripture & Reflection Log"}
        </h1>
        <p className={`text-xs mt-0.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
          {t.scripture.subtitle}
        </p>
      </div>

      {/* Main Tabs: Catalog vs Saved Reflections */}
      <div
        className={`flex rounded-2xl p-1 text-xs font-semibold border ${
          isLight ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-slate-800"
        }`}
      >
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "catalog"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              : isLight
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>
            {t.scripture.tabLibrary} ({LOCAL_NKJV_VERSES.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "saved"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              : isLight
              ? "text-slate-600 hover:text-slate-900"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>
            {t.scripture.tabSaved} ({savedVerses.length})
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SCRIPTURE CATALOG & BOLLS LIFE API FETCHER       */}
      {/* ======================================================== */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          {/* Live Fetcher Toggle Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              isLight
                ? "bg-indigo-50/70 border-indigo-200 text-slate-800"
                : "bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  isLight
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-500/20 text-indigo-400"
                }`}
              >
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-bold block ${isLight ? "text-slate-900" : "text-white"}`}>
                  {t.scripture.liveLookupTitle}
                </span>
                <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                  {t.scripture.liveLookupDesc}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLiveFetcher(!showLiveFetcher)}
              className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all"
            >
              {showLiveFetcher ? (lang === "ar" ? "إغلاق" : "Close") : (lang === "ar" ? "فتح البحث" : "Open Fetcher")}
            </button>
          </div>

          {/* Collapsible Live Fetcher Form */}
          {showLiveFetcher && (
            <div
              className={`p-4 rounded-2xl border space-y-3 animate-fade-in ${
                isLight
                  ? "bg-white border-indigo-200 shadow-sm"
                  : "bg-slate-900 border-indigo-500/40"
              }`}
            >
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider block">
                {lang === "ar" ? "البحث المباشر في الأسفار:" : "Lookup Scripture via API:"}
              </span>

              <form onSubmit={handleFetchLiveVerse} className="grid grid-cols-3 gap-2">
                <div className="col-span-3 sm:col-span-1">
                  <label className={`text-[10px] block mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {t.scripture.bookLabel}
                  </label>
                  <input
                    type="text"
                    value={liveBook}
                    onChange={(e) => setLiveBook(e.target.value)}
                    className={`w-full rounded-xl px-2.5 py-1.5 text-xs border ${
                      isLight
                        ? "bg-slate-50 border-slate-300 text-slate-900"
                        : "bg-slate-800 border-slate-700 text-white"
                    }`}
                    placeholder="e.g. Romans, Psalm"
                  />
                </div>
                <div>
                  <label className={`text-[10px] block mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {t.scripture.chapterLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={liveChapter}
                    onChange={(e) => setLiveChapter(Number(e.target.value))}
                    className={`w-full rounded-xl px-2.5 py-1.5 text-xs border ${
                      isLight
                        ? "bg-slate-50 border-slate-300 text-slate-900"
                        : "bg-slate-800 border-slate-700 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[10px] block mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                    {t.scripture.verseLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={liveVerseNum}
                    onChange={(e) => setLiveVerseNum(Number(e.target.value))}
                    className={`w-full rounded-xl px-2.5 py-1.5 text-xs border ${
                      isLight
                        ? "bg-slate-50 border-slate-300 text-slate-900"
                        : "bg-slate-800 border-slate-700 text-white"
                    }`}
                  />
                </div>

                <div className="col-span-3 pt-1">
                  <button
                    type="submit"
                    disabled={liveLoading}
                    className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    {liveLoading ? t.scripture.fetching : t.scripture.fetchBtn}
                  </button>
                </div>
              </form>

              {liveResult && (
                <div
                  className={`p-3.5 rounded-xl border space-y-2 mt-2 ${
                    isLight
                      ? "bg-slate-50 border-indigo-200"
                      : "bg-slate-950 border-indigo-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {liveResult.reference}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {liveResult.source === "live_api" ? "✓ Bolls Life API Live" : "Local Offline Array"}
                    </span>
                  </div>
                  <p
                    className={`text-xs italic font-serif leading-relaxed ${
                      isLight ? "text-slate-800" : "text-slate-200"
                    }`}
                  >
                    &ldquo;{liveResult.text}&rdquo;
                  </p>
                  <button
                    onClick={() => {
                      setSelectedVerseForSave({
                        reference: liveResult.reference,
                        text: liveResult.text,
                      });
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {t.scripture.saveReflection}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search
              className={`w-4 h-4 text-slate-400 absolute ${
                lang === "ar" ? "right-3.5" : "left-3.5"
              } top-3.5 pointer-events-none`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.scripture.searchPlaceholder}
              className={`w-full rounded-2xl py-2.5 text-xs border focus:outline-none focus:border-emerald-500 transition-colors ${
                lang === "ar" ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
              } ${
                isLight
                  ? "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm"
                  : "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
              }`}
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold border ${
                  selectedCategory === cat.id
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
                    : isLight
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Verse List */}
          <div className="space-y-3.5">
            {displayedVerses.map((v) => {
              const savedAlready = isSaved(v.reference);

              return (
                <div
                  key={v.id}
                  className={`p-4 rounded-2xl border space-y-2.5 transition-all shadow-md ${
                    isLight
                      ? "bg-white border-slate-200 hover:border-emerald-300"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                        {v.reference}
                      </span>
                      <span className={`text-[10px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                        {v.theme}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleShare(v.reference, v.text)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isLight
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                        }`}
                        title={t.home.share}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setSelectedVerseForSave({
                            reference: v.reference,
                            text: v.text,
                          })
                        }
                        className={`p-1.5 rounded-lg border transition-all ${
                          savedAlready
                            ? isLight
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : isLight
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                        }`}
                        title={t.scripture.saveReflection}
                      >
                        {savedAlready ? (
                          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-xs font-serif italic leading-relaxed ${
                      isLight ? "text-slate-800" : "text-slate-200"
                    }`}
                  >
                    &ldquo;{v.text}&rdquo;
                  </p>

                  <div
                    className={`p-2.5 rounded-xl border text-[11px] leading-relaxed ${
                      isLight
                        ? "bg-slate-50 border-slate-200 text-slate-600"
                        : "bg-slate-950/60 border-slate-800 text-slate-400"
                    }`}
                  >
                    <span className={`font-semibold ${isLight ? "text-slate-900" : "text-slate-300"}`}>
                      {lang === "ar" ? "التأمل الروحي: " : "Meditation Prompt: "}
                    </span>
                    {v.meditationPrompt}
                  </div>

                  {copiedRef === v.reference && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                      ✓ {t.home.copied}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: USER SAVED VERSES & PERSONAL REFLECTIONS          */}
      {/* ======================================================== */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedVerses.length === 0 ? (
            <div
              className={`p-8 rounded-3xl border text-center space-y-3 ${
                isLight ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className={`text-sm font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                {lang === "ar" ? "لا توجد آيات محفوظة بعد" : "No Saved Verses Yet"}
              </h3>
              <p className={`text-xs max-w-xs mx-auto ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {t.scripture.noSaved}
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                {lang === "ar" ? "تصفح الآيات الآن" : "Browse Scripture Catalog"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedVerses.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isLight
                      ? "bg-white border-slate-200 shadow-sm"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {item.reference}
                    </span>
                    <button
                      onClick={() => onRemoveSavedVerse(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title={t.scripture.removeSaved}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p
                    className={`text-xs font-serif italic leading-relaxed ${
                      isLight ? "text-slate-800" : "text-slate-200"
                    }`}
                  >
                    &ldquo;{item.verseText}&rdquo;
                  </p>

                  {item.personalReflection && (
                    <div
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isLight
                          ? "bg-emerald-50/70 border-emerald-200 text-slate-800"
                          : "bg-slate-950 border-slate-800/80 text-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                        <MessageSquare className="w-3 h-3" />
                        {t.scripture.reflectionPrompt}
                      </div>
                      <p className={`text-xs ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                        {item.personalReflection}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* REFLECTION INPUT MODAL                                   */}
      {/* ======================================================== */}
      {selectedVerseForSave && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`w-full max-w-md border-t sm:border rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative space-y-4 ${
              isLight
                ? "bg-white border-slate-200 text-slate-900"
                : "bg-[#0D1322] border-slate-800 text-slate-100"
            }`}
          >
            <h3 className="text-base font-bold">
              {lang === "ar" ? "حفظ الآية مع تأمل شخصي" : "Save Verse & Add Reflection"}
            </h3>

            <div
              className={`p-3.5 rounded-xl border text-xs italic font-serif leading-relaxed ${
                isLight ? "bg-slate-50 border-slate-200" : "bg-slate-900 border-slate-800"
              }`}
            >
              <span className="font-sans font-bold text-amber-600 dark:text-amber-400 not-italic block mb-1">
                {selectedVerseForSave.reference}
              </span>
              &ldquo;{selectedVerseForSave.text}&rdquo;
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                {t.scripture.reflectionPrompt}:
              </label>
              <textarea
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "كيف تلمس هذه الآية جهادك الحالي؟ ما الذي قررت أن تلتزم به؟"
                    : "How does this scripture speak into your current purity battle?"
                }
                rows={3}
                className={`w-full rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-500 border ${
                  isLight
                    ? "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                    : "bg-slate-900 border-slate-800 text-white placeholder-slate-500"
                }`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedVerseForSave(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold ${
                  isLight ? "bg-slate-100 text-slate-700" : "bg-slate-800 text-slate-300"
                }`}
              >
                {t.checkIn.cancelBtn}
              </button>

              <button
                type="button"
                onClick={handleSaveReflection}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                {t.scripture.saveReflection}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
