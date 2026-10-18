"use client";

import React, { useState } from "react";
import { NKJVVerse, EmotionalCategory, SavedVerse } from "@/types";
import { LOCAL_NKJV_VERSES, getVersesByCategory, fetchLiveNKJVVerse } from "@/data/nkjv-verses";
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  Heart,
  Globe,
  Trash2,
  PlusCircle,
  MessageSquare,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface ScriptureVaultProps {
  savedVerses: SavedVerse[];
  onSaveVerseWithReflection: (ref: string, text: string, reflection: string) => void;
  onRemoveSavedVerse: (id: string) => void;
}

export const ScriptureVault: React.FC<ScriptureVaultProps> = ({
  savedVerses,
  onSaveVerseWithReflection,
  onRemoveSavedVerse,
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

  // Filter verses
  const displayedVerses = LOCAL_NKJV_VERSES.filter((v) => {
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
    const content = `"${text}" — ${ref} (NKJV)\n\nClear Eyes, Clean Mind.\nWalking in freedom with Unbroken.`;
    if (navigator.share) {
      navigator.share({ title: ref, text: content }).catch(() => {});
    } else {
      navigator.clipboard.writeText(content);
      setCopiedRef(ref);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  const isSaved = (ref: string) => savedVerses.some((s) => s.reference === ref);

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Top Header */}
      <div className="px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          NKJV Word of God Vault
        </span>
        <h1 className="text-xl font-black text-white tracking-tight mt-0.5">
          Scripture & Reflection Log
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pre-loaded New King James Scriptures & live Bolls Life Bible API search.
        </p>
      </div>

      {/* Main Tabs: Catalog vs Saved Reflections */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "catalog"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>NKJV Vault ({LOCAL_NKJV_VERSES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === "saved"
              ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>My Reflections ({savedVerses.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SCRIPTURE CATALOG & BOLLS LIFE API FETCHER       */}
      {/* ======================================================== */}
      {activeTab === "catalog" && (
        <div className="space-y-4">
          {/* Live Fetcher Toggle Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Bolls Life Bible API (Free, Keyless)
                </span>
                <span className="text-[10px] text-slate-400">Fetch any live NKJV chapter & verse</span>
              </div>
            </div>

            <button
              onClick={() => setShowLiveFetcher(!showLiveFetcher)}
              className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-xs font-bold transition-all"
            >
              {showLiveFetcher ? "Close" : "Open Fetcher"}
            </button>
          </div>

          {/* Collapsible Live Fetcher Form */}
          {showLiveFetcher && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-fade-in">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                Lookup NKJV Verse via API:
              </span>

              <form onSubmit={handleFetchLiveVerse} className="grid grid-cols-3 gap-2">
                <div className="col-span-3 sm:col-span-1">
                  <label className="text-[10px] text-slate-400 block mb-1">Book Name</label>
                  <input
                    type="text"
                    value={liveBook}
                    onChange={(e) => setLiveBook(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                    placeholder="e.g. Romans, Psalm"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Chapter</label>
                  <input
                    type="number"
                    min="1"
                    value={liveChapter}
                    onChange={(e) => setLiveChapter(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Verse</label>
                  <input
                    type="number"
                    min="1"
                    value={liveVerseNum}
                    onChange={(e) => setLiveVerseNum(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="col-span-3 pt-1">
                  <button
                    type="submit"
                    disabled={liveLoading}
                    className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    {liveLoading ? "Fetching NKJV Text..." : "Fetch Live NKJV Verse"}
                  </button>
                </div>
              </form>

              {liveResult && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{liveResult.reference}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {liveResult.source === "live_api" ? "✓ Bolls Life API Live" : "Local Offline Array"}
                    </span>
                  </div>
                  <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
                    "{liveResult.text}"
                  </p>
                  <button
                    onClick={() => {
                      setSelectedVerseForSave({
                        reference: liveResult.reference,
                        text: liveResult.text,
                      });
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Save with Reflection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or book (e.g. lust, peace, 1 Cor)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Emotional State Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: "all", label: "All Scriptures" },
              { id: "temptation", label: "Temptation" },
              { id: "grace_after_relapse", label: "Grace After Relapse" },
              { id: "identity", label: "Identity in Christ" },
              { id: "mind_renewal", label: "Mind Renewal" },
              { id: "discipline", label: "Discipline & Power" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold border ${
                  selectedCategory === cat.id
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm"
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
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-400 block">{v.reference}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {v.theme}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          setSelectedVerseForSave({ reference: v.reference, text: v.text })
                        }
                        className={`p-1.5 rounded-lg transition-all ${
                          savedAlready
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                        title="Save with Personal Reflection"
                      >
                        {savedAlready ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleShare(v.reference, v.text)}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
                        title="Share Scripture"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
                    "{v.text}"
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Action: </span>
                    {v.meditationPrompt}
                  </div>
                </div>
              );
            })}

            {displayedVerses.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No verses found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MY SAVED VERSES & PERSONAL REFLECTIONS           */}
      {/* ======================================================== */}
      {activeTab === "saved" && (
        <div className="space-y-4">
          {savedVerses.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Saved Verses Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore the NKJV catalog and tap the bookmark icon to save Scriptures with personal meditation notes.
              </p>
              <button
                onClick={() => setActiveTab("catalog")}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Browse Scripture Vault
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedVerses.map((sv) => (
                <div
                  key={sv.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">{sv.reference} (NKJV)</span>
                    <button
                      onClick={() => onRemoveSavedVerse(sv.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
                    "{sv.verseText}"
                  </p>

                  {sv.personalReflection && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <MessageSquare className="w-3 h-3" />
                        My Reflection Note
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {sv.personalReflection}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>Saved {new Date(sv.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleShare(sv.reference, sv.verseText)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
                    >
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD PERSONAL REFLECTION TO VERSE                 */}
      {/* ======================================================== */}
      {selectedVerseForSave && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#0D1322] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {selectedVerseForSave.reference} (NKJV)
              </span>
              <button
                onClick={() => setSelectedVerseForSave(null)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs italic font-serif text-slate-200 leading-relaxed">
              "{selectedVerseForSave.text}"
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                Add a Personal Reflection / Prayer Note:
              </label>
              <textarea
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="Why does this verse help you? How will you apply it during late-night temptation?"
                rows={3}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSaveReflection}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
            >
              Save to My Scripture Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
