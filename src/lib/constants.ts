import { AssessmentQuestion, Milestone } from "@/types";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    title: "Frequency & Salience",
    category: "frequency_salience",
    question: "How often do urges, pornography, or compulsive sexual thoughts dominate your daily attention, studies, or free time?",
    neuroInsight: "Measures cognitive preoccupation and automated cue-reactivity within the ventral striatum and salience network."
  },
  {
    id: 2,
    title: "Tolerance & Escalation",
    category: "tolerance_escalation",
    question: "Have you noticed needing longer sessions, more frequent viewing, or more extreme/novel content to achieve the same thrill or emotional relief?",
    neuroInsight: "Dopamine D2 receptor downregulation requires increasingly novel and intensified stimuli for the same neurological reward response."
  },
  {
    id: 3,
    title: "Mood Modification (Emotional Triggers)",
    category: "mood_modification",
    question: "How often do you turn to this habit as an emotional coping mechanism to escape stress, loneliness, sadness, boredom, or physical exhaustion (HALT)?",
    neuroInsight: "Pornography functions as an artificial chemical tranquilizer, conditioning a reflexive emotional escape loop in the limbic system."
  },
  {
    id: 4,
    title: "Loss of Control",
    category: "loss_of_control",
    question: "When an urge strikes, how difficult is it for you to stop or walk away, even after promising yourself and God that you would quit?",
    neuroInsight: "Signals prefrontal cortex hypoactivation—the executive impulse brakes fail under acute dopamine craving."
  },
  {
    id: 5,
    title: "Functional Conflict (Brain Fog)",
    category: "functional_conflict",
    question: "How often does this habit cause mental fatigue, brain fog, decreased motivation, or conflict with your academic, spiritual, and personal goals?",
    neuroInsight: "Frequent dopamine surges and neuroinflammation exhaust executive reserves, resulting in frontal lobe fatigue, poor memory, and apathy."
  },
  {
    id: 6,
    title: "Withdrawal Symptoms",
    category: "withdrawal_symptoms",
    question: "When you attempt to stay clean for several days, how frequently do you experience restlessness, irritability, mood swings, or acute cravings?",
    neuroInsight: "The flatline and neurochemical detox phase where downregulated dopamine receptors crave their artificial baseline."
  },
  {
    id: 7,
    title: "Secrecy & Isolation",
    category: "secrecy_isolation",
    question: "How often do you hide your digital behavior (incognito tabs, clearing history) or isolate yourself from family, friends, and Christian fellowship to engage in the habit?",
    neuroInsight: "Compulsive addiction relies on secrecy, activating guilt-fear circuits that alienate the user from authentic community and support."
  },
  {
    id: 8,
    title: "Relapse History",
    category: "relapse_history",
    question: "How frequently have you attempted to quit permanently, only to find yourself relapsing into the same compulsive loop within days or weeks?",
    neuroInsight: "Indicates deep Delta-FosB neuro-markers and ingrained synaptic pathways in the nucleus accumbens requiring intentional neuroplastic rewiring."
  }
];

export const LIKERT_OPTIONS = [
  { value: 0, label: "Never", description: "Not experienced" },
  { value: 1, label: "Rarely", description: "Once a month or less" },
  { value: 2, label: "Sometimes", description: "1-2 times a week" },
  { value: 3, label: "Often", description: "3-5 times a week" },
  { value: 4, label: "Almost Always", description: "Daily occurrence" }
];

export const BIBLICAL_MILESTONES: Milestone[] = [
  {
    days: 1,
    title: "Step of Faith",
    verse: "Hebrews 11:1",
    verseText: "Now faith is the substance of things hoped for, the evidence of things not seen.",
    badge: "🌱",
    description: "The very first 24 hours of breaking the automated pattern and stepping into divine grace."
  },
  {
    days: 3,
    title: "Resurrection Dawn",
    verse: "Hosea 6:2",
    verseText: "After two days He will revive us; on the third day He will raise us up, that we may live in His sight.",
    badge: "🌅",
    description: "Surviving the acute 72-hour physical withdrawal spike. Life begins to return."
  },
  {
    days: 7,
    title: "Sabbath Overcomer",
    verse: "Exodus 20:8",
    verseText: "Remember the Sabbath day, to keep it holy.",
    badge: "🛡️",
    description: "One full week clean. Prefrontal cortex impulse awareness begins reawakening."
  },
  {
    days: 14,
    title: "Watchman on the Wall",
    verse: "Isaiah 62:6",
    verseText: "I have set watchmen on your walls, O Jerusalem; they shall never hold their peace day or night.",
    badge: "⚔️",
    description: "Two weeks of vigilance. You are learning to detect triggers before they become urges."
  },
  {
    days: 21,
    title: "Daniel's Fast Victor",
    verse: "Daniel 10:2-3",
    verseText: "In those days I, Daniel, was mourning three full weeks. I ate no pleasant food...",
    badge: "🔥",
    description: "21 days of consecrated fasting from lust. Habit loops are weakening significantly."
  },
  {
    days: 40,
    title: "Wilderness Conqueror",
    verse: "Matthew 4:1-4",
    verseText: "Man shall not live by bread alone, but by every word that proceeds from the mouth of God.",
    badge: "🦅",
    description: "40 days in the spiritual wilderness overcoming temptation like Christ with Scripture."
  },
  {
    days: 60,
    title: "Vessel of Honor",
    verse: "2 Timothy 2:21",
    verseText: "Therefore if anyone cleanses himself from the latter, he will be a vessel for honor, sanctified and useful for the Master, prepared for every good work.",
    badge: "🏺",
    description: "60 days of purity. Neural pathways of lust are dormant, replaced by self-control and holy honor."
  },
  {
    days: 90,
    title: "Renewed Mind",
    verse: "Romans 12:2",
    verseText: "Be transformed by the renewing of your mind...",
    badge: "👑",
    description: "Full neurological reboot. Deep neuroplasticity rewiring and restored dopamine sensitivity."
  }
];

export const HALT_TRIGGERS = [
  { id: "Bored", label: "Boredom", icon: "🥱", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  { id: "Tired", label: "Tiredness / Exhaustion", icon: "😴", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { id: "Stressed", label: "Stress / Pressure", icon: "⚡", color: "bg-red-500/20 text-red-300 border-red-500/30" },
  { id: "Lonely", label: "Loneliness / Isolation", icon: "🌧️", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { id: "Angry", label: "Anger / Frustration", icon: "🔥", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  { id: "Late Night Phone", label: "Late Night Phone in Bed", icon: "📱", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { id: "Social Media Trigger", label: "Social Media / Scrolling", icon: "📸", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  { id: "Hungry", label: "Hunger", icon: "🥪", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" }
];

export const TIME_OF_DAY_OPTIONS = [
  { id: "Morning", label: "Morning (6AM - 12PM)", icon: "🌅" },
  { id: "Afternoon", label: "Afternoon (12PM - 6PM)", icon: "☀️" },
  { id: "Evening", label: "Evening (6PM - 11PM)", icon: "🌆" },
  { id: "Late Night 11PM-3AM", label: "Late Night (11PM - 3AM)", icon: "🌙" }
];

export const NEUROPLASTICITY_STAGES = [
  {
    range: "Days 1–7",
    minDay: 1,
    maxDay: 7,
    title: "Executive Awakening",
    subtitle: "Prefrontal Cortex Impulse Awareness",
    description: "The brain begins noticing compulsive automatic loops before they execute. Cravings are sharp, but mental fog starts to clear.",
    icon: "🧠",
    statusText: "Initiating Receptor Recovery"
  },
  {
    range: "Days 8–21",
    minDay: 8,
    maxDay: 21,
    title: "Dopamine Resensitization",
    subtitle: "Dopamine Receptor Sensitivity Restoration",
    description: "Downregulated D2 dopamine receptors begin multiplying again. Everyday life, nature, friendships, and study feel subtly more enjoyable.",
    icon: "⚡",
    statusText: "Rebuilding Neuro-Transmitters"
  },
  {
    range: "Days 22–45",
    minDay: 22,
    maxDay: 45,
    title: "Pathway Pruning",
    subtitle: "Compulsive Habit Pathways Weakening",
    description: "Unused pornography neural networks experience biological pruning. Urges become less frequent, though unexpected flash triggers may occur.",
    icon: "✂️",
    statusText: "Pruning Compulsive Wiring"
  },
  {
    range: "Days 46–90",
    minDay: 46,
    maxDay: 90,
    title: "Neuroplastic Reboot",
    subtitle: "Deep Neuroplasticity Rewiring & Freedom",
    description: "Full prefrontal brain volume restoration, balanced delta-FosB levels, healthy sexual drive redirected toward God's design, and high spiritual clarity.",
    icon: "👑",
    statusText: "Complete Structural Transformation"
  }
];
