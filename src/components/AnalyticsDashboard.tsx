"use client";

import React, { useState, useEffect, useMemo } from "react";
import { UserProfile, DailyLog } from "@/types";
import { NEUROPLASTICITY_STAGES, HALT_TRIGGERS } from "@/lib/constants";
import { calculateAddictionSeverityIndex } from "@/lib/storage";
import {
  Brain,
  Activity,
  Flame,
  Clock,
  TrendingDown,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  ArrowDownRight,
  ShieldCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AnalyticsDashboardProps {
  profile: UserProfile;
  dailyLogs: DailyLog[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  profile,
  dailyLogs,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<14 | 30>(14);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Compute clean streak days from profile
  const streakDays = useMemo(() => {
    const start = new Date(profile.streakStartTimestamp).getTime();
    const now = Date.now();
    return Math.max(Math.floor((now - start) / (1000 * 60 * 60 * 24)), 0);
  }, [profile.streakStartTimestamp]);

  // 1. Current Addiction Severity Index (dynamic drop from baseline)
  const currentSeverityIndex = useMemo(() => {
    return calculateAddictionSeverityIndex(
      profile.onboardingScore || 18,
      streakDays,
      profile.urgesDefeatedCount
    );
  }, [profile.onboardingScore, streakDays, profile.urgesDefeatedCount]);

  const severityReductionPercent = useMemo(() => {
    const base = Math.max(profile.onboardingScore || 18, 1);
    const drop = base - currentSeverityIndex;
    return Math.min(Math.max(Math.round((drop / base) * 100), 0), 95);
  }, [profile.onboardingScore, currentSeverityIndex]);

  // 2. Neuroplasticity & Brain Reboot Progress (0% to 100% toward 90 days)
  const rebootPercent = Math.min(Math.max(Math.round((streakDays / 90) * 100), 4), 100);

  // 3. Urge Intensity vs Self-Control Chart Data
  const areaChartData = useMemo(() => {
    const slice = dailyLogs.slice(-timeRange);
    let runningStreak = Math.max(streakDays - slice.length + 1, 0);

    return slice.map((log) => {
      if (log.status === "clean" || log.status === "urge_defeated") {
        runningStreak += 1;
      } else {
        runningStreak = 0;
      }

      // Format date MM/DD
      const parts = log.logDate.split("-");
      const shortDate = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : log.logDate;

      return {
        date: shortDate,
        fullDate: log.logDate,
        urgeIntensity: log.urgeIntensity,
        selfControlStreak: runningStreak,
        status: log.status,
      };
    });
  }, [dailyLogs, timeRange, streakDays]);

  // 4. HALT Trigger Breakdown ranking
  const triggerStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    dailyLogs.forEach((log) => {
      if (log.triggers && log.triggers.length > 0) {
        log.triggers.forEach((t) => {
          counts[t] = (counts[t] || 0) + 1;
          total += 1;
        });
      }
    });

    const list = Object.entries(counts).map(([name, count]) => {
      const haltDef = HALT_TRIGGERS.find((h) => h.id === name || h.label.includes(name));
      return {
        name: haltDef ? haltDef.label.split("/")[0].trim() : name,
        id: name,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    list.sort((a, b) => b.count - a.count);
    return { list, topTrigger: list[0] || null };
  }, [dailyLogs]);

  // 5. High-Risk Time-of-Day Heatmap
  const timeOfDayStats = useMemo(() => {
    const stats: Record<string, { count: number; highUrges: number }> = {
      Morning: { count: 0, highUrges: 0 },
      Afternoon: { count: 0, highUrges: 0 },
      Evening: { count: 0, highUrges: 0 },
      "Late Night 11PM-3AM": { count: 0, highUrges: 0 },
    };

    dailyLogs.forEach((log) => {
      const key = log.timeOfDay || "Evening";
      if (!stats[key]) {
        stats[key] = { count: 0, highUrges: 0 };
      }
      stats[key].count += 1;
      if (log.urgeIntensity >= 6 || log.status === "relapse") {
        stats[key].highUrges += 1;
      }
    });

    return stats;
  }, [dailyLogs]);

  // AI-Style Actionable Insight
  const aiInsight = useMemo(() => {
    const top = triggerStats.topTrigger;
    if (!top) {
      return "Log your daily check-in to generate tailored neuroscience recovery recommendations.";
    }

    if (top.id.includes("Late Night") || top.name.includes("Late Night")) {
      return "Your #1 trigger is Late Night Phone in Bed. Action step: Leave your phone charging outside your bedroom at 10:30 PM. Use a traditional alarm clock to protect prefrontal fatigue.";
    } else if (top.id.includes("Bored") || top.name.includes("Boredom")) {
      return "Your #1 trigger is Boredom (Dopamine Seeking). Action step: Create a physical 'Dopamine Menu' (guitar, gym, prayer walk, reading Proverbs) to replace passive screen grazing.";
    } else if (top.id.includes("Tired")) {
      return "Your #1 trigger is Physical Exhaustion. Action step: When exhausted, your prefrontal inhibition drops by 60%. Prioritize 8 hours of sleep and never negotiate with urges after 10 PM.";
    } else if (top.id.includes("Stressed")) {
      return "Your #1 trigger is Stress & Pressure. Action step: When academic or personal stress rises, immediately practice 60s Box Breathing before opening your phone.";
    } else {
      return `Your #1 trigger is ${top.name}. Implement a concrete environmental barrier before this emotion arises tomorrow.`;
    }
  }, [triggerStats]);

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Header */}
      <div className="px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5" />
          Neuroscience Recovery Analytics
        </span>
        <h1 className="text-xl font-black text-white tracking-tight mt-0.5">
          Brain Reboot & Habit Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tracking neurological rewiring, urge patterns, and emotional triggers.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 1. CURRENT ADDICTION SEVERITY INDEX                     */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Addiction Severity Index
              </span>
              <p className="text-[11px] text-slate-400">Dynamic CPUI-9 psychometric score</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">
              {currentSeverityIndex}
            </span>
            <span className="text-xs text-slate-500 font-semibold"> / 32</span>
          </div>
        </div>

        {/* Reduction Indicator */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-300">
              Initial Baseline: <strong className="text-white">{profile.onboardingScore || 18} pts</strong>
            </span>
          </div>

          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            -{severityReductionPercent}% Severity
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          As your clean streak grows and urges are defeated, automated habit cues in the basal ganglia lose their synaptic grip.
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2. NEUROPLASTICITY & BRAIN REBOOT PROGRESS BAR (0-100%) */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Brain Reboot Progress
              </span>
              <p className="text-[11px] text-slate-400">90-Day Full Neuroplasticity Timeline</p>
            </div>
          </div>

          <span className="text-xl font-black text-purple-300">{rebootPercent}%</span>
        </div>

        {/* Full Timeline Progress Bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${rebootPercent}%` }}
          />
        </div>

        {/* 4 Biological Healing Stages */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Biological Healing Stages (Current Streak: {streakDays} Days)
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {NEUROPLASTICITY_STAGES.map((stg) => {
              const isPassed = streakDays > stg.maxDay;
              const isCurrent = streakDays >= stg.minDay && streakDays <= stg.maxDay;

              return (
                <div
                  key={stg.range}
                  className={`p-3 rounded-2xl border transition-all text-left ${
                    isCurrent
                      ? "bg-purple-950/30 border-purple-500/50 shadow-md shadow-purple-500/10"
                      : isPassed
                      ? "bg-slate-950/70 border-emerald-500/30 text-slate-400"
                      : "bg-slate-950/40 border-slate-800/80 opacity-60 text-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{stg.icon}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {stg.range}: {stg.title}
                        </span>
                        <span className="text-[10px] text-purple-300 font-medium">
                          {stg.subtitle}
                        </span>
                      </div>
                    </div>

                    {isPassed ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Rebuilt
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full animate-pulse">
                        Active Stage
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Upcoming</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                    {stg.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. URGE INTENSITY VS. SELF-CONTROL AREA CHART            */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              Urge Intensity vs. Self-Control
            </span>
            <p className="text-[11px] text-slate-400">Comparing cravings against streak resilience</p>
          </div>

          {/* Time range toggle */}
          <div className="flex bg-slate-800 rounded-xl p-0.5 text-xs font-semibold">
            <button
              onClick={() => setTimeRange(14)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeRange === 14 ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              14D
            </button>
            <button
              onClick={() => setTimeRange(30)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                timeRange === 30 ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400"
              }`}
            >
              30D
            </button>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-56 w-full pt-2">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="urgeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  domain={[0, 10]}
                  axisLine={{ stroke: "#334155" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    fontSize: "11px",
                    color: "#F1F5F9",
                  }}
                  formatter={(val: any, name: string) => [
                    val,
                    name === "urgeIntensity" ? "Urge Intensity (1-10)" : "Consecutive Clean Days",
                  ]}
                  labelFormatter={(lbl, items) => {
                    const item = items && items[0]?.payload;
                    return item ? `${item.fullDate} (${item.status.toUpperCase()})` : lbl;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="urgeIntensity"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#urgeGrad)"
                  name="urgeIntensity"
                />
                <Area
                  type="monotone"
                  dataKey="selfControlStreak"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#streakGrad)"
                  name="selfControlStreak"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-slate-300">Urge Intensity (1-10)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Clean Momentum</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. HALT TRIGGER BREAKDOWN (HORIZONTAL BAR CHART)        */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            HALT Emotional Trigger Ranking
          </span>
          <p className="text-[11px] text-slate-400">What feelings precede your temptations?</p>
        </div>

        {/* Bar chart */}
        <div className="h-44 w-full">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={triggerStats.list.slice(0, 5)}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
              >
                <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#CBD5E1"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#334155",
                    borderRadius: "10px",
                    fontSize: "11px",
                  }}
                  formatter={(val: any) => [`${val} occurrences`, "Triggers"]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {triggerStats.list.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#F43F5E"
                          : index === 1
                          ? "#F59E0B"
                          : index === 2
                          ? "#38BDF8"
                          : "#10B981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* AI Actionable Insight Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            Targeted Neuroscience Insight
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {aiInsight}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. HIGH-RISK TIME-OF-DAY HEATMAP                         */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              High-Risk Time-of-Day Heatmap
            </span>
            <p className="text-[11px] text-slate-400">When does willpower experience depletion?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "Morning", label: "Morning (6AM-12PM)", icon: "🌅" },
            { key: "Afternoon", label: "Afternoon (12PM-6PM)", icon: "☀️" },
            { key: "Evening", label: "Evening (6PM-11PM)", icon: "🌆" },
            { key: "Late Night 11PM-3AM", label: "Late Night (11PM-3AM)", icon: "🌙" },
          ].map((slot) => {
            const data = timeOfDayStats[slot.key] || { count: 0, highUrges: 0 };
            const isLateNight = slot.key.includes("Late Night");
            const isHighVulnerability = data.highUrges >= 2 || isLateNight;

            return (
              <div
                key={slot.key}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isHighVulnerability
                    ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                    : "bg-slate-950/70 border-slate-800 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{slot.icon}</span>
                  {isHighVulnerability && (
                    <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                      High Alert
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white mt-1.5 truncate">
                  {slot.label}
                </div>
                <div className="flex items-baseline justify-between mt-2 text-[11px]">
                  <span className="text-slate-400">{data.count} logs</span>
                  <span className={isHighVulnerability ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {data.highUrges} urges
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <span className="text-indigo-400 font-semibold">Circadian Rule: </span>
          The majority of teenage relapses occur between 11:00 PM and 2:30 AM due to melatonin onset and frontal lobe exhaustion. Enforce a hard phone curfew.
        </div>
      </div>
    </div>
  );
};
