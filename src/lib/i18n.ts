import { Language, ThemeMode, NKJVVerse, Milestone, AssessmentQuestion } from "@/types";

export interface I18nContent {
  brand: {
    appName: string;
    slogan: string;
    proverbsRef: string;
    proverbsText: string;
    disguiseTitle: string;
    disguiseSubtitle: string;
  };
  nav: {
    home: string;
    analytics: string;
    sos: string;
    scripture: string;
    shield: string;
  };
  header: {
    lockTitle: string;
    signOutTitle: string;
    switchTheme: string;
    switchLang: string;
    levelPrefix: string;
  };
  home: {
    daysClean: string;
    days: string;
    hours: string;
    mins: string;
    currentStreak: string;
    longestStreak: string;
    urgesDefeated: string;
    victoryRate: string;
    nextMilestone: string;
    viewMilestones: string;
    checkInBtn: string;
    sosBtn: string;
    dailyVerseTitle: string;
    saveVerse: string;
    savedVerse: string;
    meditate: string;
    share: string;
    copied: string;
    neuroRoadmap: string;
    addictionIndexTitle: string;
    dopamineSensitivityTitle: string;
    ptsBaseline: string;
    milestoneModalTitle: string;
    close: string;
    currentRank: string;
    locked: string;
    meditatePrompt: string;
    prayerPrompt: string;
  };
  checkIn: {
    title: string;
    subtitle: string;
    statusClean: string;
    statusCleanDesc: string;
    statusUrge: string;
    statusUrgeDesc: string;
    statusRelapse: string;
    statusRelapseDesc: string;
    urgeIntensity: string;
    triggersLabel: string;
    timeOfDayLabel: string;
    journalLabel: string;
    journalPlaceholder: string;
    submitBtn: string;
    cancelBtn: string;
  };
  grace: {
    title: string;
    proverbsRef: string;
    proverbsText: string;
    message: string;
    actionPrompt: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    customPlaceholder: string;
    confirmBtn: string;
    cancelBtn: string;
  };
  sos: {
    badge: string;
    step1Title: string;
    step1Sub: string;
    boxBreathing: string;
    boxDesc: string;
    breathIn: string;
    breathHold: string;
    breathOut: string;
    pushupsTitle: string;
    pushupsDesc: string;
    step2Title: string;
    step2Sub: string;
    lie1Title: string;
    lie1Desc: string;
    lie2Title: string;
    lie2Desc: string;
    step3Title: string;
    step3Sub: string;
    speakAloud: string;
    nextStep: string;
    step4Title: string;
    step4Sub: string;
    victoryDeclaration: string;
    recordVictoryBtn: string;
    closeBtn: string;
  };
  scripture: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    catAll: string;
    catTemptation: string;
    catGrace: string;
    catIdentity: string;
    catMind: string;
    catDiscipline: string;
    tabLibrary: string;
    tabSaved: string;
    tabLive: string;
    noSaved: string;
    reflectionPrompt: string;
    saveReflection: string;
    removeSaved: string;
    liveLookupTitle: string;
    liveLookupDesc: string;
    bookLabel: string;
    chapterLabel: string;
    verseLabel: string;
    fetchBtn: string;
    fetching: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    victoryRate30: string;
    cleanDays: string;
    urgesDefeated: string;
    relapses: string;
    triggersTitle: string;
    triggersSub: string;
    timeDistributionTitle: string;
    timeDistributionSub: string;
    severityCurveTitle: string;
    severityCurveSub: string;
    clinicalInsightsTitle: string;
    prefrontalGray: string;
    prefrontalGrayDesc: string;
    dopamineD2: string;
    dopamineD2Desc: string;
    deltaFosb: string;
    deltaFosbDesc: string;
  };
  shield: {
    title: string;
    subtitle: string;
    desc: string;
    activeAccount: string;
    signOut: string;
    discipleName: string;
    dataPrivacy: string;
    isolatedBadge: string;
    isolatedDesc: string;
    pinTitle: string;
    pinActive: string;
    pinInactive: string;
    lockNow: string;
    change: string;
    disable: string;
    enterPin: string;
    savePin: string;
    cancel: string;
    pinSuccess: string;
    disguiseTitle: string;
    disguiseDesc: string;
    disguiseInfo: string;
    langTitle: string;
    langDesc: string;
    themeTitle: string;
    themeDesc: string;
    themeLight: string;
    themeDark: string;
    zeroCostTitle: string;
    zeroCostSub: string;
    supabaseSynced: string;
    localStorageActive: string;
    supabaseDesc: string;
    localStorageDesc: string;
    diagnosticTitle: string;
    diagnosticDesc: string;
    retakeBtn: string;
    dataControlsTitle: string;
    loadDemo: string;
    startFresh: string;
    methodologyBtn: string;
    freshConfirmTitle: string;
    freshConfirmDesc: string;
    confirmYes: string;
    methodologyTitle: string;
    methodologyPoint1Title: string;
    methodologyPoint1Desc: string;
    methodologyPoint2Title: string;
    methodologyPoint2Desc: string;
    methodologyPoint3Title: string;
    methodologyPoint3Desc: string;
  };
  auth: {
    signIn: string;
    createAccount: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    submitSignIn: string;
    submitSignUp: string;
    connecting: string;
    orQuick: string;
    demoBtnTitle: string;
    demoBtnSub: string;
    privacyBadge: string;
    privacyDesc: string;
    cloudActive: string;
    offlineActive: string;
    errEmpty: string;
    errPassShort: string;
  };
  onboarding: {
    badge: string;
    title: string;
    subtitle: string;
    questionOf: string;
    neuroInsightTitle: string;
    nextBtn: string;
    calculateBtn: string;
    completeTitle: string;
    completeSub: string;
    scoreLabel: string;
    assignedTier: string;
    neuroPlan: string;
    startJourneyBtn: string;
  };
}

export const I18N_EN: I18nContent = {
  brand: {
    appName: "UNBROKEN",
    slogan: "Clear Eyes, Clean Mind.",
    proverbsRef: "Proverbs 24:16",
    proverbsText: "For a righteous man may fall seven times and rise again, but the wicked shall fall by calamity.",
    disguiseTitle: "Daily Habits",
    disguiseSubtitle: "Habit & Wellness Tracker",
  },
  nav: {
    home: "Home",
    analytics: "Analytics",
    sos: "SOS",
    scripture: "Scripture",
    shield: "Shield",
  },
  header: {
    lockTitle: "Lock App with PIN",
    signOutTitle: "Click to sign out",
    switchTheme: "Toggle Light/Dark Theme",
    switchLang: "تبديل إلى العربية",
    levelPrefix: "Level",
  },
  home: {
    daysClean: "DAYS CLEAN",
    days: "Days",
    hours: "Hours",
    mins: "Mins",
    currentStreak: "Current Clean Streak",
    longestStreak: "Longest Streak",
    urgesDefeated: "Urges Defeated",
    victoryRate: "Victory Rate",
    nextMilestone: "Next Milestone",
    viewMilestones: "View Milestones",
    checkInBtn: "Daily Check-In",
    sosBtn: "SOS Urge Rescue",
    dailyVerseTitle: "Daily Scripture Weapon",
    saveVerse: "Save Verse",
    savedVerse: "Saved",
    meditate: "Meditate",
    share: "Share",
    copied: "Copied!",
    neuroRoadmap: "Neuroplasticity Recovery Roadmap",
    addictionIndexTitle: "Scientific Addiction Index",
    dopamineSensitivityTitle: "Dopamine Sensitivity",
    ptsBaseline: "pts baseline",
    milestoneModalTitle: "Biblical & Neurological Milestones",
    close: "Close",
    currentRank: "Current Rank",
    locked: "Locked",
    meditatePrompt: "Meditate & Pray Through This Verse",
    prayerPrompt: "Personal Prayer Declaration",
  },
  checkIn: {
    title: "Daily Recovery Check-In",
    subtitle: "How was your purity journey today?",
    statusClean: "Clean & Victorious",
    statusCleanDesc: "Maintained complete physical & mental purity",
    statusUrge: "Faced Urge & Overcame",
    statusUrgeDesc: "Trigger hit, but used weapons & stayed clean",
    statusRelapse: "I Relapsed",
    statusRelapseDesc: "Grace is ready; immediate restoration protocol",
    urgeIntensity: "Urge Intensity Peak (1 = faint thought, 10 = extreme craving)",
    triggersLabel: "Triggers Encountered (HALT Model)",
    timeOfDayLabel: "Time of Day",
    journalLabel: "Disciple's Note or Prayer",
    journalPlaceholder: "Reflect honestly on what happened, prayers whispered, or God's grace...",
    submitBtn: "Save Daily Record",
    cancelBtn: "Cancel",
  },
  grace: {
    title: "Grace & Restoration Protocol",
    proverbsRef: "Proverbs 24:16",
    proverbsText: "For a righteous man may fall seven times and rise again, but the wicked shall fall by calamity.",
    message: "Shame is Satan's weapon to keep you paralyzed. Repentance is God's highway back to life. A single fall does not erase the neural pathways you have already rewired.",
    actionPrompt: "Commit to ONE physical boundary adjustment right now:",
    opt1: "Move phone charger completely outside the bedroom tonight.",
    opt2: "Delete or log out of tempting apps/browsers for 48 hours.",
    opt3: "Confess and pray with a trusted pastor, parent, or brother in Christ.",
    opt4: "Take an ice-cold shower immediately and read Psalm 51.",
    customPlaceholder: "Or write your own immediate environmental boundary...",
    confirmBtn: "Reset Streak & Rise in Grace",
    cancelBtn: "Return Without Reset",
  },
  sos: {
    badge: "Emergency Urge Rescue",
    step1Title: "Step 1: Emergency Biological Reset",
    step1Sub: "Lower your heart rate and interrupt the dopamine loop",
    boxBreathing: "Box Breathing (4-4-4-4)",
    boxDesc: "Inhale 4s, Hold 4s, Exhale 4s, Hold 4s",
    breathIn: "Inhale...",
    breathHold: "Hold...",
    breathOut: "Exhale...",
    pushupsTitle: "Physical Shock",
    pushupsDesc: "Do 20 pushups or splash ice-cold water on your face",
    step2Title: "Step 2: Expose the Dopamine Illusion",
    step2Sub: "The prefrontal cortex counter-attack",
    lie1Title: "The 5-Minute Pleasure Trap",
    lie1Desc: "The pleasure lasts only minutes, but the shame, brain fog, and guilt will haunt your entire evening. Choose freedom over regret.",
    lie2Title: "Satan's Empty Promise",
    lie2Desc: "This habit has NEVER fulfilled you once. You will always want more, and feel emptier. True fullness is only in Christ.",
    step3Title: "Step 3: Scripture Sword",
    step3Sub: "Jesus defeated Satan in the wilderness with the written Word",
    speakAloud: "Read this Scripture out loud with authority:",
    nextStep: "Next Step",
    step4Title: "Step 4: Claim Your Victory",
    step4Sub: "Seal the neurological victory with a journal note",
    victoryDeclaration: "I am clean, forgiven, and unbroken through Jesus Christ. The urge has passed.",
    recordVictoryBtn: "Record Victory (+1 Urge Defeated)",
    closeBtn: "Close Emergency",
  },
  scripture: {
    title: "Scripture Vault & Weapons",
    subtitle: "Targeted Biblical verses for spiritual warfare and dopamine renewal",
    searchPlaceholder: "Search verses or themes...",
    catAll: "All Verses",
    catTemptation: "Temptation",
    catGrace: "Grace After Relapse",
    catIdentity: "Identity in Christ",
    catMind: "Mind Renewal",
    catDiscipline: "Self-Discipline",
    tabLibrary: "Scripture Library",
    tabSaved: "Saved Treasures",
    tabLive: "Live Scripture Lookup",
    noSaved: "No saved verses yet. Bookmark verses from your meditations to build your personalized spiritual arsenal.",
    reflectionPrompt: "Personal Reflection",
    saveReflection: "Save with Reflection",
    removeSaved: "Remove",
    liveLookupTitle: "Live Scripture Lookup",
    liveLookupDesc: "Fetch any verse directly from the Holy Scriptures",
    bookLabel: "Book",
    chapterLabel: "Chapter",
    verseLabel: "Verse",
    fetchBtn: "Lookup Scripture",
    fetching: "Fetching Scripture...",
  },
  analytics: {
    title: "Recovery Analytics Engine",
    subtitle: "Behavioral neuroscience & clinical recovery indicators",
    victoryRate30: "30-Day Purity Rate",
    cleanDays: "Clean Days",
    urgesDefeated: "Urges Defeated",
    relapses: "Relapses",
    triggersTitle: "HALT Trigger Breakdown",
    triggersSub: "Emotional & environmental vulnerability drivers",
    timeDistributionTitle: "Vulnerable Times of Day",
    timeDistributionSub: "Circadian fatigue vulnerability window",
    severityCurveTitle: "Addiction Severity Trend",
    severityCurveSub: "Prefrontal cortex recovery vs baseline score",
    clinicalInsightsTitle: "Neurobiological Recovery State",
    prefrontalGray: "Prefrontal Gray Matter",
    prefrontalGrayDesc: "Restoration of impulse control and executive function",
    dopamineD2: "Dopamine D2 Density",
    dopamineD2Desc: "Multiplication of receptors restoring joy in everyday life",
    deltaFosb: "Delta-FosB Gene Accumulation",
    deltaFosbDesc: "Biological pruning of compulsive sexual habit networks",
  },
  shield: {
    title: "Shield & Privacy Engine",
    subtitle: "Discreet Security & Controls",
    desc: "Protect your recovery privacy with PIN lock, app title disguise, and data sync.",
    activeAccount: "Active User Account",
    signOut: "Sign Out",
    discipleName: "Disciple Name",
    dataPrivacy: "Data Privacy",
    isolatedBadge: "100% Isolated",
    isolatedDesc: "Your recovery streak, psychometrics, and journal notes are strictly tied to your account ID.",
    pinTitle: "4-Digit Privacy PIN Lock",
    pinActive: "Lock screen is active",
    pinInactive: "Protect app from curious eyes",
    lockNow: "Lock Now",
    change: "Change",
    disable: "Disable",
    enterPin: "Enter 4-digit PIN",
    savePin: "Save PIN",
    cancel: "Cancel",
    pinSuccess: "✓ PIN lock successfully activated!",
    disguiseTitle: "Disguise Header as 'Daily Habits'",
    disguiseDesc: "Hides recovery wording on the lock and header bar",
    disguiseInfo: "When enabled, the app title displays as 'Daily Habits' so friends or family glancing over your shoulder will not see addiction recovery branding.",
    langTitle: "Language & Direction",
    langDesc: "Switch between English (LTR) and Arabic (RTL)",
    themeTitle: "Theme & Appearance",
    themeDesc: "Switch between Dark Mode and Light Mode",
    themeLight: "Light Mode",
    themeDark: "Dark Mode",
    zeroCostTitle: "Dual-Mode Zero-Cost Engine",
    zeroCostSub: "Zero database bill guarantee",
    supabaseSynced: "Supabase Synced",
    localStorageActive: "LocalStorage Active",
    supabaseDesc: "Your account is actively syncing with your private free-tier Supabase PostgreSQL database.",
    localStorageDesc: "The app is running offline in zero-configuration LocalStorage mode. Your data is 100% private to your device.",
    diagnosticTitle: "Scientific Diagnostic Baseline",
    diagnosticDesc: "Take the 8-question CPUI-9 assessment again after 30 days to measure your prefrontal recovery and re-calibrate your baseline score.",
    retakeBtn: "Retake Baseline Assessment",
    dataControlsTitle: "Recovery Journey Data Controls",
    loadDemo: "Load Realistic Demo Data",
    startFresh: "Start Fresh Clean Slate",
    methodologyBtn: "The Behavioral Neuroscience of Lust (Methodology)",
    freshConfirmTitle: "Start Fresh Clean Slate?",
    freshConfirmDesc: "This will clear all logs and launch the 8-question Scientific Assessment so you can configure your own personal baseline.",
    confirmYes: "Yes, Start Fresh",
    methodologyTitle: "How Unbroken Rewires the Brain",
    methodologyPoint1Title: "1. Delta-FosB & Synaptic Pruning",
    methodologyPoint1Desc: "Every time pornography is viewed, the transcription factor Delta-FosB accumulates in the nucleus accumbens, reinforcing addictive loops. By staying clean, these pathways undergo biological synaptic pruning.",
    methodologyPoint2Title: "2. The Prefrontal Brake",
    methodologyPoint2Desc: "Teenagers have a rapidly developing prefrontal cortex (the impulse brake). Lust hijacks this by stimulating the ventral tegmental area. Speaking Scripture aloud actively activates the left prefrontal cortex, dampening the amygdala.",
    methodologyPoint3Title: "3. Spiritual Sanctification",
    methodologyPoint3Desc: "Romans 12:2 calls for the 'renewing of your mind.' This is not just poetic theology—it is biological truth. God designed neuroplasticity so that your mind can be transformed into Christlikeness.",
  },
  auth: {
    signIn: "Sign In",
    createAccount: "Create Account",
    nameLabel: "Your Name or Disciple Alias",
    namePlaceholder: "e.g. Caleb, Nathaniel, Joshua",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    submitSignIn: "Sign In to My Account",
    submitSignUp: "Create Account & Start Baseline",
    connecting: "Connecting Securely...",
    orQuick: "Or Quick Access",
    demoBtnTitle: "Preview Demo Account (Nathaniel)",
    demoBtnSub: "Preloaded 14-day streak with rich charts",
    privacyBadge: "100% Isolated & Private Data",
    privacyDesc: "Every user's streak counter, daily logs, HALT triggers, and saved Scriptures are stored under their own unique account. Multiple users can log in on the same device without seeing each other's data.",
    cloudActive: "Supabase Cloud Auth Active",
    offlineActive: "Offline Multi-User Storage Active",
    errEmpty: "Please enter both email and password.",
    errPassShort: "Password must be at least 6 characters long.",
  },
  onboarding: {
    badge: "Diagnostic Baseline",
    title: "Scientific Assessment",
    subtitle: "8-Question CPUI-9 Diagnostic for Compulsive Behavioral Loops",
    questionOf: "Question {cur} of {total}",
    neuroInsightTitle: "Neurological Clinical Insight",
    nextBtn: "Next Question",
    calculateBtn: "Calculate Baseline & Begin",
    completeTitle: "Assessment Complete",
    completeSub: "Your baseline neurological profile has been calibrated.",
    scoreLabel: "Diagnostic Score",
    assignedTier: "Assigned Recovery Protocol",
    neuroPlan: "Your personalized neuroplasticity roadmap and Scripture shield are now configured.",
    startJourneyBtn: "Enter Unbroken Dashboard",
  },
};

export const I18N_AR: I18nContent = {
  brand: {
    appName: "UNBROKEN",
    slogan: "عيون نقية، عقل طاهر.",
    proverbsRef: "أمثال ٢٤: ١٦",
    proverbsText: "لأَنَّ الصِّدِّيقَ يَسْقُطُ سَبْعَ مَرَّاتٍ وَيَقُومُ، أَمَّا الأَشْرَارُ فَيَتَعَثَّرُونَ بِالشَّرِّ.",
    disguiseTitle: "العادات اليومية",
    disguiseSubtitle: "متتبع العادات والعافية",
  },
  nav: {
    home: "الرئيسية",
    analytics: "الإحصائيات",
    sos: "طوارئ SOS",
    scripture: "الآيات",
    shield: "الدرع",
  },
  header: {
    lockTitle: "قفل التطبيق برمز سري",
    signOutTitle: "اضغط لتسجيل الخروج",
    switchTheme: "تبديل المظهر الفاتح/الداكن",
    switchLang: "Switch to English",
    levelPrefix: "المستوى",
  },
  home: {
    daysClean: "أيام الطهارة",
    days: "يوم",
    hours: "ساعة",
    mins: "دقيقة",
    currentStreak: "سلسلة الطهارة الحالية",
    longestStreak: "أطول سلسلة طهارة",
    urgesDefeated: "شهوات مهزومة",
    victoryRate: "معدل النصرة",
    nextMilestone: "المعلم الروحي القادم",
    viewMilestones: "عرض المعالم الروحية",
    checkInBtn: "تسجيل المتابعة اليومية",
    sosBtn: "طوارئ إنقاذ الشهوة",
    dailyVerseTitle: "سيف كلمة الله اليومي",
    saveVerse: "حفظ الآية",
    savedVerse: "تم الحفظ",
    meditate: "تأمل",
    share: "مشاركة",
    copied: "تم النسخ!",
    neuroRoadmap: "خارطة إعادة التشكيل العصبي للدماغ",
    addictionIndexTitle: "مؤشر شدة الإدمان السريري",
    dopamineSensitivityTitle: "حساسية الدوبامين",
    ptsBaseline: "نقطة الأساس",
    milestoneModalTitle: "المعالم الروحية والعصبية للتعافي",
    close: "إغلاق",
    currentRank: "مرتبتك الحالية",
    locked: "مغلق",
    meditatePrompt: "تأمل وصلِّ بهذه الآية المقدسة",
    prayerPrompt: "إعلان صلاة شخصية",
  },
  checkIn: {
    title: "تسجيل المتابعة اليومية",
    subtitle: "كيف كان جهادك ومسيرة نقاوتك اليوم؟",
    statusClean: "طاهر ومنتصر بمجد الرب",
    statusCleanDesc: "حافظت على نقاوة القلب والفكر والجسد",
    statusUrge: "واجهت شهوة وتغلبت عليها",
    statusUrgeDesc: "هاجمتني التجربة لكن هربت واستخدمت أسلحة النصرة",
    statusRelapse: "تعثرت اليوم (سقوط / انتكاسة)",
    statusRelapseDesc: "نعمة المسيح كافية؛ قيام فوري بانسحاق وتوبة",
    urgeIntensity: "شدة الشهوة أو الإلحاح (١ = فكرة عابرة، ١٠ = اشتهاء شديد)",
    triggersLabel: "المحفزات التي واجهتك (نموذج HALT)",
    timeOfDayLabel: "وقت التجربة والضعف",
    journalLabel: "ملاحظة أو صلاة خاصة للمجاهد",
    journalPlaceholder: "اكتب بصراحة ما حدث معك، صلواتك، وكيف تدخلت نعمة الله...",
    submitBtn: "حفظ التقرير اليومي",
    cancelBtn: "إلغاء",
  },
  grace: {
    title: "بروتوكول النعمة والقيام الفوري",
    proverbsRef: "أمثال ٢٤: ١٦",
    proverbsText: "لأَنَّ الصِّدِّيقَ يَسْقُطُ سَبْعَ مَرَّاتٍ وَيَقُومُ، أَمَّا الأَشْرَارُ فَيَتَعَثَّرُونَ بِالشَّرِّ.",
    message: "الخزي هو سلاح إبليس ليجعلك محبطاً ومستسلماً. التوبة هي طريق الله السريع للحياة. السقوط المؤقت لا يلغي المسارات العصبية التي أعدت بناءها بنعمة الله.",
    actionPrompt: "التزم بتغيير بيئي وعملي واحد الآن لحماية طهارتك:",
    opt1: "شحن الهاتف خارج غرفة النوم الليلة نهائياً.",
    opt2: "حذف التطبيقات والمواقع المسببة للعثرة لمدة ٤٨ ساعة.",
    opt3: "الاعتراف والصلاة مع أب الاعتراف أو خادم روحي أمين.",
    opt4: "غسل الوجه بماء مثلج وقراءة المزمور الخمسين (ارحمني يا الله).",
    customPlaceholder: "أو اكتب التزامك البيئي العملي الحاسم...",
    confirmBtn: "تصفير العداد والقيام بنعمة المسيح",
    cancelBtn: "الرجوع دون تصفير",
  },
  sos: {
    badge: "طوارئ إنقاذ الشهوة الفوري",
    step1Title: "الخطوة ١: التدخل الفسيولوجي العاجل",
    step1Sub: "خفض نبضات القلب وإيقاف إفراز الدوبامين الإجباري",
    boxBreathing: "التنفس المربع (٤-٤-٤-٤)",
    boxDesc: "شهيق ٤ ثوانٍ، حبس ٤ ثوانٍ، زفير ٤ ثوانٍ، حبس ٤ ثوانٍ",
    breathIn: "شهيق عميق...",
    breathHold: "حبس النفس...",
    breathOut: "زفير بطيء...",
    pushupsTitle: "صدمة فسيولوجية سريعة",
    pushupsDesc: "قم بعمل ٢٠ ضغطة أو اغسل وجهك بماء مثلج لتهدئة الدماغ فوراً",
    step2Title: "الخطوة ٢: كشف كذبة اللذة المؤقتة",
    step2Sub: "هجوم قشرة الفص الجبهي المعرفي المضاد",
    lie1Title: "فخ الخمس دقائق الزائل",
    lie1Desc: "اللذة الزائفة تدوم دقائق معدودة فقط، لكن الخزي والظلمة والكسل والذنب سيلاحقك لأيام. اختر حرية أبناء الله الحقيقية.",
    lie2Title: "وعود العدو الكاذبة الخاوية",
    lie2Desc: "هذه الشهوة لم تشبعك يوماً قط؛ بل تتركك أكثر جوعاً وفراغاً. الشبع الحقيقي والنقاء الكامل في المسيح يسوع وحده.",
    step3Title: "الخطوة ٣: سيف كلمة الله الحيّة",
    step3Sub: "يسوع هزم إبليس في البرية بكلمة الله المكتوبة: 'مكتوب'",
    speakAloud: "اقرأ هذه الآية بصوت مسموع وواضح وبسلطان الإيمان:",
    nextStep: "الخطوة التالية",
    step4Title: "الخطوة ٤: إعلان النصرة والشكر",
    step4Sub: "تثبيت الانتصار العصبي والروحي في سجل جهادك",
    victoryDeclaration: "أنا طاهر، مغفور لي، وغير مكسور بنعمة المسيح. التجربة قد عبرت وسقطت تحت قدمي الصليب.",
    recordVictoryBtn: "تسجيل الانتصار (+١ شهوة مهزومة)",
    closeBtn: "إغلاق الطوارئ",
  },
  scripture: {
    title: "كنز كلمة الله وأسلحة النصرة",
    subtitle: "آيات كتابية مختارة للحرب الروحية وتجديد الذهن وهزيمة الشهوة",
    searchPlaceholder: "ابحث في الآيات أو المواضيع...",
    catAll: "جميع الآيات",
    catTemptation: "محاربة الشهوة",
    catGrace: "النعمة بعد السقوط",
    catIdentity: "الهوية في المسيح",
    catMind: "تجديد الذهن",
    catDiscipline: "ضبط النفس والجهاد",
    tabLibrary: "مكتبة الآيات",
    tabSaved: "كنزي المحفوظ",
    tabLive: "البحث في الكتاب المقدس",
    noSaved: "لم تحفظ أية آية بعد. اضغط على أيقونة الحفظ أثناء التأمل لبناء ترسانتك الروحية الخاصة.",
    reflectionPrompt: "تأمل شخصي في الآية",
    saveReflection: "حفظ مع تأمل",
    removeSaved: "حذف من المحفوظات",
    liveLookupTitle: "البحث الحي في الكتاب المقدس",
    liveLookupDesc: "استخرج أي آية مباشرة من كلمة الله المقدسة",
    bookLabel: "السفر",
    chapterLabel: "الإصحاح",
    verseLabel: "الآية",
    fetchBtn: "عرض الآية",
    fetching: "جاري استخراج الآية...",
  },
  analytics: {
    title: "محرك تحليلات التعافي السريري",
    subtitle: "مؤشرات علم الأعصاب السلوكي ومسار التعافي التدريجي",
    victoryRate30: "نسبة الطهارة (٣٠ يوماً)",
    cleanDays: "أيام طاهرة",
    urgesDefeated: "شهوات مهزومة",
    relapses: "انتكاسات",
    triggersTitle: "تحليل محفزات الضعف (نموذج HALT)",
    triggersSub: "الدوافع العاطفية والبيئية وراء اشتهاء الإدمان",
    timeDistributionTitle: "أخطر أوقات اليوم",
    timeDistributionSub: "نافذة انخفاض الإرادة والتعب الإدراكي",
    severityCurveTitle: "منحنى تعافي شدة الإدمان",
    severityCurveSub: "مسار استعادة قوة الفص الجبهي مقارنة بنقطة البداية",
    clinicalInsightsTitle: "الحالة العصبية والبيولوجية للدماغ",
    prefrontalGray: "كتلة الفص الجبهي الرمادية",
    prefrontalGrayDesc: "استعادة السيطرة على النزوات والفرامل العصبية للإرادة",
    dopamineD2: "كثافة مستقبلات الدوبامين D2",
    dopamineD2Desc: "تكاثر المستقبلات وعودة التلذذ بالحياة الطبيعية البسيطة",
    deltaFosb: "تراكم بروتين الإدمان (Delta-FosB)",
    deltaFosbDesc: "تقليم المسارات العصبية الإجبارية للإباحية بالانقطاع عنها",
  },
  shield: {
    title: "الدرع وإعدادات الخصوصية",
    subtitle: "الأمان والخصوصية والتحكم التام",
    desc: "احمِ خصوصية رحلة تعافيك برمز سري، تمويه الاسم، ومزامنة بياناتك.",
    activeAccount: "حساب المستخدم النشط",
    signOut: "تسجيل الخروج",
    discipleName: "اسم المستخدم",
    dataPrivacy: "خصوصية البيانات",
    isolatedBadge: "معزول ١٠٠٪",
    isolatedDesc: "عداد تعافيك، مقاييسك النفسية، وملاحظاتك مرتبطة حصرياً برقم حسابك الشخصي.",
    pinTitle: "قفل الرمز السري (٤ أرقام)",
    pinActive: "شاشة القفل مفعلة",
    pinInactive: "احمِ التطبيق من الأعين المتطفلة",
    lockNow: "قفل الآن",
    change: "تعديل",
    disable: "إلغاء القفل",
    enterPin: "أدخل رمزاً من ٤ أرقام",
    savePin: "حفظ الرمز",
    cancel: "إلغاء",
    pinSuccess: "✓ تم تفعيل قفل الرمز السري بنجاح!",
    disguiseTitle: "تمويه اسم التطبيق إلى 'العادات اليومية'",
    disguiseDesc: "يخفي عبارات التعافي والإدمان من الشريط العلوي وقفل الشاشة",
    disguiseInfo: "عند التفعيل، يظهر اسم التطبيق كـ 'العادات اليومية' حتى لا يرى الأصدقاء أو العائلة أي ذكر لموضوع الإدمان عند النظر إلى شاشتك.",
    langTitle: "لغة التطبيق واتجاه الواجهة",
    langDesc: "التبديل بين العربية (من اليمين لليسار) والإنجليزية",
    themeTitle: "المظهر والسمات البصرية",
    themeDesc: "التبديل بين المظهر الداكن والمظهر الفاتح",
    themeLight: "المظهر الفاتح",
    themeDark: "المظهر الداكن",
    zeroCostTitle: "المحرك المزدوج بدون تكلفة",
    zeroCostSub: "ضمان عدم دفع أية رسوم قاعدة بيانات",
    supabaseSynced: "مزامنة سحابية (Supabase)",
    localStorageActive: "تخزين محلي (LocalStorage)",
    supabaseDesc: "حسابك متصل بقاعدة بيانات Supabase السحابية المجانية الخاصة بك.",
    localStorageDesc: "التطبيق يعمل بدون إنترنت بتخزين محلي فائق الخصوصية على جهازك فقط.",
    diagnosticTitle: "الاختبار التشخيصي السريري الأساسي",
    diagnosticDesc: "أعد إجراء تقييم الـ ٨ أسئلة بعد ٣٠ يوماً لقياس نمو الفص الجبهي وإعادة معايرة مؤشر شدة الإدمان.",
    retakeBtn: "إعادة الاختبار التشخيصي",
    dataControlsTitle: "التحكم في بيانات رحلة التعافي",
    loadDemo: "تحميل بيانات تجريبية واقعية",
    startFresh: "بدء رحلة جديدة خالية",
    methodologyBtn: "علم الأعصاب السلوكي للشهوة (المنهجية العلمية)",
    freshConfirmTitle: "بدء رحلة جديدة خالية؟",
    freshConfirmDesc: "سيتم مسح السجلات القديمة وفتح اختبار التقييم المكون من ٨ أسئلة لتحديد نقطة انطلاقك الشخصية.",
    confirmYes: "نعم، ابدأ من جديد",
    methodologyTitle: "كيف يعيد التطبيق تشكيل الدماغ بنعمة الله",
    methodologyPoint1Title: "١. بروتين Delta-FosB والتقليم المشبكي",
    methodologyPoint1Desc: "في كل مرة تُشاهد فيها الإباحية، يتراكم بروتين Delta-FosB في نواة المتعة ويعزز حلقة الإدمان. بالامتناع والطهارة، تخضع هذه المسارات العصبية لتقليم بيولوجي طبيعي وتتلاشى.",
    methodologyPoint2Title: "٢. فرامل الفص الجبهي الإدراكي",
    methodologyPoint2Desc: "يمر المراهقون بمرحلة تطور سريع للفص الجبهي المسؤول عن كبح النزوات. الشهوة تعطل هذه الفرامل. قراءة كلمة الله بصوت مسموع تنشط الفص الجبهي الأيسر فوراً وتهدئ اللوزة الدماغية الثائرة.",
    methodologyPoint3Title: "٣. التقديس وتجديد الذهن",
    methodologyPoint3Desc: "يقول الكتاب المقدس في رومية ١٢: ٢: 'تَغَيَّرُوا عَنْ شَكْلِكُمْ بِتَجْدِيدِ أَذْهَانِكُمْ'. هذا ليس مجرد تعبير بلاغي، بل حقيقة علمية بيولوجية صممها الله لكي يتغير دماغك وينمو في شبه المسيح.",
  },
  auth: {
    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب جديد",
    nameLabel: "اسمك أو لقبك الروحي",
    namePlaceholder: "مثال: يوسف، داود، ناثانيل",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    passwordLabel: "كلمة المرور",
    submitSignIn: "تسجيل الدخول إلى حسابي",
    submitSignUp: "إنشاء الحساب وبدء التقييم",
    connecting: "جاري الاتصال الآمن...",
    orQuick: "أو الدخول السريع",
    demoBtnTitle: "تجربة الحساب التجريبي (ناثانيل)",
    demoBtnSub: "سلسلة طهارة ١٤ يوماً مع رسوم بيانية غنية",
    privacyBadge: "بيانات خاصة ومعزولة ١٠٠٪",
    privacyDesc: "عداد كل مستخدم، تقاريره اليومية، محفزاته، وآياته المحفوظة معزولة تماماً في حسابه المستقل. يمكن لعدة مستخدمين استخدام نفس الجهاز بأمان دون تداخل بياناتهم.",
    cloudActive: "مزامنة سحابية نشطة (Supabase)",
    offlineActive: "تخزين محلي معزول متعدد المستخدمين",
    errEmpty: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
    errPassShort: "يجب ألا تقل كلمة المرور عن ٦ أحرف.",
  },
  onboarding: {
    badge: "التقييم التشخيصي الأساسي",
    title: "التقييم العصبي السلوكي",
    subtitle: "تشخيص CPUI-9 السريري المكون من ٨ أسئلة لقياس حلقات الإدمان الإجباري",
    questionOf: "السؤال {cur} من {total}",
    neuroInsightTitle: "التحليل العصبي السريري",
    nextBtn: "السؤال التالي",
    calculateBtn: "حساب المؤشر وبدء المسيرة",
    completeTitle: "اكتمل التقييم بنجاح",
    completeSub: "تم تحديد ملفك العصبي والسلوكي بنجاح.",
    scoreLabel: "درجة التقييم السريري",
    assignedTier: "بروتوكول التعافي المخصص",
    neuroPlan: "تم ضبط خارطة إعادة التشكيل العصبي ودرع الآيات الدفاعية الخاص بك.",
    startJourneyBtn: "الدخول إلى لوحة التحكم",
  },
};

export function getTranslation(lang: Language = "en"): I18nContent {
  return lang === "ar" ? I18N_AR : I18N_EN;
}

// Arabic Translations for Local NKJV Verses (Smith & Van Dyck Arabic Bible)
export const ARABIC_VERSE_DATA: Record<string, { reference: string; text: string; theme: string; meditationPrompt: string }> = {
  "1cor-10-13": {
    reference: "١ كورنثوس ١٠: ١٣",
    text: "لَمْ تُصِبْكُمْ تَجْرِبَةٌ إِلاَّ بَشَرِيَّةٌ. وَلكِنَّ اللهَ أَمِينٌ، الَّذِي لاَ يَدَعُكُمْ تُجَرَّبُونَ فَوْقَ مَا تَسْتَطِيعُونَ، بَلْ سَيَجْعَلُ مَعَ التَّجْرِبَةِ أَيْضاً الْمَنْفَذَ، لِتَسْتَطِيعُوا أَنْ تَحْتَمِلُوا.",
    theme: "المنفذ الإلهي المضمون",
    meditationPrompt: "توقف وانظر حولك الآن. ما هو المخرج العملي الذي أوجده الله لك في هذه اللحظة بالذات؟"
  },
  "2tim-2-22": {
    reference: "٢ تيموثاوس ٢: ٢٢",
    text: "أَمَّا الشَّهَوَاتُ الشَّبَابِيَّةُ فَاهْرُبْ مِنْهَا، وَاتَّبِعِ الْبِرَّ وَالإِيمَانَ وَالْمَحَبَّةَ وَالسَّلاَمَ مَعَ الَّذِينَ يَدْعُونَ الرَّبَّ مِنْ قَلْبٍ نَقِيٍّ.",
    theme: "الهروب الحاسم",
    meditationPrompt: "لا تفاوض الشهوة. اهرب كما هرب يوسف من بيت فوطيفار؛ قف وغيّر مكانك الآن فوراً."
  },
  "james-4-7": {
    reference: "يعقوب ٤: ٧",
    text: "فَاخْضَعُوا للهِ. قَاوِمُوا إِبْلِيسَ فَيَهْرُبَ مِنْكُمْ.",
    theme: "السلطان في المسيح",
    meditationPrompt: "اخضع أفكارك لسيادة المسيح، ارفض إغراءات العدو بإيمان، وسترى الشهوة تتلاشى وتهرب."
  },
  "gal-5-16": {
    reference: "غلاطية ٥: ١٦",
    text: "وَإِنَّمَا أَقُولُ: اسْلُكُوا بِالرُّوحِ فَلاَ تُكَمِّلُوا شَهْوَةَ الْجَسَدِ.",
    theme: "السلوك بالروح القدس",
    meditationPrompt: "التعافي ليس مجرد قمع للجسد، بل هو استسلام حي لقيادة الروح القدس في كل لحظة."
  },
  "matt-26-41": {
    reference: "متى ٢٦: ٤١",
    text: "اِسْهَرُوا وَصَلُّوا لِئَلاَّ تَدْخُلُوا فِي تَجْرِبَةٍ. أَمَّا الرُّوحُ فَنَشِيطٌ وَأَمَّا الْجَسَدُ فَضَعِيفٌ.",
    theme: "السهر واليقظة الروحية",
    meditationPrompt: "اعترف بضعفك البشري أمام الله بدون خجل، واستبدل ضعفك بسلطان السهر والصلاة الدائمة."
  },
  "micah-7-8": {
    reference: "ميخا ٧: ٨",
    text: "لاَ تَشْمَتِي بِي يَا عَدُوَّتِي، إِذَا سَقَطْتُ أَقُومُ. إِذَا جَلَسْتُ فِي الظُّلْمَةِ فَالرَّبُّ نُورٌ لِي.",
    theme: "إذا سقطت أقوم",
    meditationPrompt: "التعثر ليس نهاية قصتك. العدو يريدك أن تبقى في الوحل، لكن يسوع يقول لك: قم، خطاياك مغفورة."
  },
  "1john-1-9": {
    reference: "١ يوحنا ١: ٩",
    text: "إِنِ اعْتَرَفْنَا بِخَطَايَانَا فَهُوَ أَمِينٌ وَعَادِلٌ، حَتَّى يَغْفِرَ لَنَا خَطَايَانَا وَيُطَهِّرَنَا مِنْ كُلِّ إِثْمٍ.",
    theme: "التطهير الفوري بدم المسيح",
    meditationPrompt: "الله لا يحمل ضغينة. بمجرد أن تعترف بقلب تائب، يطهرك دم يسوع ويعيد إليك بهاء نقاوتك."
  },
  "prov-24-16": {
    reference: "أمثال ٢٤: ١٦",
    text: "لأَنَّ الصِّدِّيقَ يَسْقُطُ سَبْعَ مَرَّاتٍ وَيَقُومُ، أَمَّا الأَشْرَارُ فَيَتَعَثَّرُونَ بِالشَّرِّ.",
    theme: "الصديق يقوم دائماً",
    meditationPrompt: "البر لا يعني أنك معصوم من التعثر، بل يتجلى في الإصرار المستمر على القيام بنعمة المسيح."
  },
  "rom-8-1": {
    reference: "رومية ٨: ١",
    text: "إِذاً لاَ شَيْءَ مِنَ الدَّيْنُونَةِ الآنَ عَلَى الَّذِينَ هُمْ فِي الْمَسِيحِ يَسُوعَ، السَّالِكِينَ لَيْسَ حَسَبَ الْجَسَدِ بَلْ حَسَبَ الرُّوحِ.",
    theme: "لا دينونة في المسيح",
    meditationPrompt: "تبكيت الروح القدس يقودك إلى يسوع، بينما إدانة إبليس تدفعك لليأس. ارفض الخزي واثبت في البنوة."
  },
  "ps-103-12": {
    reference: "مزمور ١٠٣: ١٢",
    text: "كَبُعْدِ الْمَشْرِقِ مِنَ الْمَغْرِبِ أَبْعَدَ عَنَّا مَعَاصِيَنَا.",
    theme: "غفران لا حدود له",
    meditationPrompt: "الشرق والغرب لا يلتقيان أبداً. الله لا يعايرك بسقطاتك الماضية بل يمنحك بداية جديدة طاهرة."
  },
  "2tim-1-7": {
    reference: "٢ تيموثاوس ١: ٧",
    text: "لأَنَّ اللهَ لَمْ يُعْطِنَا رُوحَ الْفَشَلِ، بَلْ رُوحَ الْقُوَّةِ وَالْمَحَبَّةِ وَالنُّصْحِ (ضبط النفس).",
    theme: "روح القوة وضبط النفس",
    meditationPrompt: "أنت لست عبداً عاجزاً لهرمونات الشهوة. لقد وُهبت روح القوة والقدرة العصبية على ضبط النفس."
  },
  "2cor-5-17": {
    reference: "٢ كورنثوس ٥: ١٧",
    text: "إِذاً إِنْ كَانَ أَحَدٌ فِي الْمَسِيحِ فَهُوَ خَلِيقَةٌ جَدِيدَةٌ: الأَشْيَاءُ الْقَدِيمَةُ قَدْ مَضَتْ، هُوَذَا الْكُلُّ قَدْ صَارَ جَدِيداً.",
    theme: "خليقة جديدة في المسيح",
    meditationPrompt: "عاداتك القديمة لا تحدد هويتك. في المسيح، روحك متجددة ودماغك يتشكل من جديد بنعمته."
  },
  "1pet-2-9": {
    reference: "١ بطرس ٢: ٩",
    text: "وَأَمَّا أَنْتُمْ فَجِنْسٌ مُخْتَارٌ، وَكَهَنُوتٌ مُلُوكِيٌّ، أُمَّةٌ مُقَدَّسَةٌ، شَعْبُ اقْتِنَاءٍ، لِكَيْ تُخْبِرُوا بِفَضَائِلِ الَّذِي دَعَاكُمْ مِنَ الظُّلْمَةِ إِلَى نُورِهِ الْعَجِيبِ.",
    theme: "كهنوت ملوكي مقدس",
    meditationPrompt: "أبناء الملوك لا يقتاتون على الفتات الرخيص للشهوة. عش بما يليق بكرامتك ودعوتك العظمى."
  },
  "col-3-3": {
    reference: "كولوسي ٣: ٣",
    text: "لأَنَّكُمْ قَدْ مُتُّمْ وَحَيَاتُكُمْ مُسْتَتِرَةٌ مَعَ الْمَسِيحِ فِي اللهِ.",
    theme: "مستترة مع المسيح",
    meditationPrompt: "حياتك الحقيقية راسية في عرش السماء، أرفع بكثير من دناءة النزوات الأرضية."
  },
  "eph-2-10": {
    reference: "أفسس ٢: ١٠",
    text: "لأَنَّنَا نَحْنُ عَمَلُهُ، مَخْلُوقِينَ فِي الْمَسِيحِ يَسُوعَ لأَعْمَالٍ صَالِحَةٍ، قَدْ سَبَقَ اللهُ فَأَعَدَّهَا لِكَيْ نَسْلُكَ فِيهَا.",
    theme: "تحفة الله المصنوعة",
    meditationPrompt: "الله أعد لك خطة عظيمة وتأثيراً مباركاً. لا تضحي بدعوتك ومستقبلك مقابل متعة عابرة."
  },
  "rom-12-2": {
    reference: "رومية ١٢: ٢",
    text: "وَلاَ تُشَاكِلُوا هذَا الدَّهْرَ، بَلْ تَغَيَّرُوا عَنْ شَكْلِكُمْ بِتَجْدِيدِ أَذْهَانِكُمْ، لِتَخْتَبِرُوا مَا هِيَ إِرَادَةُ اللهِ: الصَّالِحَةُ الْمَرْضِيَّةُ الْكَامِلَةُ.",
    theme: "التغيير بتجديد الذهن",
    meditationPrompt: "في كل مرة تختار فيها كلمة الله بدلاً من الشاشات، تعيد كلمة الله رسم المسارات العصبية لدماغك."
  },
  "phil-4-8": {
    reference: "فيلبي ٤: ٨",
    text: "أَخِيراً أَيُّهَا الإِخْوَةُ: كُلُّ مَا هُوَ حَقٌّ، كُلُّ مَا هُوَ جَلِيلٌ، كُلُّ مَا هُوَ عَادِلٌ، كُلُّ مَا هُوَ طَاهِرٌ، كُلُّ مَا هُوَ مَسَرٌّ، كُلُّ مَا صِيتُهُ حَسَنٌ... فَفِي هذِهِ افْتَكِرُوا.",
    theme: "المصفاة الفكرية النقية",
    meditationPrompt: "جوّع مسارات الشهوة القديمة بتغذية فصك الجبهي بأفكار الطهارة، السلام، والجمال الإلهي."
  },
  "2cor-10-5": {
    reference: "٢ كورنثوس ١٠: ٥",
    text: "هَادِمِينَ ظُنُوناً وَكُلَّ عُلُوٍّ يَرْتَفِعُ ضِدَّ مَعْرِفَةِ اللهِ، وَمُسْتَأْسِرِينَ كُلَّ فِكْرٍ إِلَى طَاعَةِ الْمَسِيحِ،",
    theme: "أسر الأفكار الدخيلة",
    meditationPrompt: "لا يمكنك منع الطير من التحليق فوق رأسك، لكن يمكنك منعه من بناء عش في شعرك. اقطع الأفكار المباغتة فوراً."
  },
  "ps-119-9-11": {
    reference: "مزمور ١١٩: ٩، ١١",
    text: "بِمَ يُزَكِّي الشَّابُّ طَرِيقَهُ؟ بِحِفْظِهِ إِيَّاهُ حَسَبَ كَلاَمِكَ... خَبَّأْتُ كَلاَمَكَ فِي قَلْبِي لِكَيْلاَ أُخْطِئَ إِلَيْكَ.",
    theme: "الكلمة المطهرة الحافظة",
    meditationPrompt: "حفظ كلمة الله في القلب يبني جدار حماية روحي وعصبي تلقائي يحميك في لحظات التجربة المفاجئة."
  },
  "col-3-2": {
    reference: "كولوسي ٣: ٢",
    text: "اهْتَمُّوا بِمَا فَوْقُ لاَ بِمَا عَلَى الأَرْضِ،",
    theme: "الارتقاء بالبصيرة",
    meditationPrompt: "ثبّت نظرك على السماويات. عندما تنظر إلى فوق، تفقد الأشياء الأرضية الرخيصة جاذبيتها الكاذبة."
  },
  "phil-4-13": {
    reference: "فيلبي ٤: ١٣",
    text: "أَسْتَطِيعُ كُلَّ شَيْءٍ فِي الْمَسِيحِ الَّذِي يُقَوِّينِي.",
    theme: "القوة الفائقة بالمسيح",
    meditationPrompt: "مسيرة طهارتك لا تعتمد على إرادتك البشرية الضعيفة وحدها، بل على قوة المسيح الحي الساكن فيك."
  },
  "ps-51-10": {
    reference: "مزمور ٥١: ١٠",
    text: "قَلْباً نَقِيّاً اخْلُقْ فِيَّ يَا اَللهُ، وَرُوحاً مُسْتَقِيماً جَدِّدْ فِي دَاخِلِي.",
    theme: "القلب النقي المتجدد",
    meditationPrompt: "اطلب من الله أن يجري لك عملية جراحية روحية في قلبك وعقلك الآن، مانحاً إياك روحاً ثابتاً في القداسة."
  },
  "1cor-9-27": {
    reference: "١ كورنثوس ٩: ٢٧",
    text: "بَلْ أَقْمَعُ جَسَدِي وَأَسْتَعْبِدُهُ، حَتَّى بَعْدَ مَا كَرَزْتُ لِلآخَرِينَ لاَ أَصِيرُ أَنَا نَفْسِي مَرْفُوضاً.",
    theme: "انضباط المجاهد والرياضي",
    meditationPrompt: "تعامل مع نزواتك الجسدية كبطل رياضي منضبط. جسدك يخدم روحك وليس العكس."
  },
  "prov-4-23": {
    reference: "أمثال ٤: ٢٣",
    text: "فَوْقَ كُلِّ تَحَفُّظٍ احْفَظْ قَلْبَكَ، لأَنَّ مِنْهُ مَخَارِجَ الْحَيَاةِ.",
    theme: "حراسة ينبوع الحياة",
    meditationPrompt: "عيناك هما بوابة نفسك إلى قلبك. احرس ما تشاهده على وسائل التواصل وما تتصفحه في ساعات الليل المتأخرة."
  },
  "isaiah-40-31": {
    reference: "إشعياء ٤٠: ٣١",
    text: "وَأَمَّا مُنْتَظِرُو الرَّبِّ فَيُجَدِّدُونَ قُوَّةً. يَرْفَعُونَ أَجْنِحَةً كَالنُّسُورِ. يَرْكُضُونَ وَلاَ يَتْعَبُونَ، يَمْشُونَ وَلاَ يُعْيُونَ.",
    theme: "تجديد القوة والارتفاع",
    meditationPrompt: "عندما يشتد التعب في أيام الانسحاب الصعبة، انتظر الرب في سكون وصلاة؛ فهو يجدد قوتك ويرفعك كالنسور."
  }
};

export function getLocalizedVerse(verse: NKJVVerse, lang: Language): NKJVVerse {
  if (lang !== "ar") return verse;
  const ar = ARABIC_VERSE_DATA[verse.id];
  if (!ar) return verse;
  return {
    ...verse,
    reference: ar.reference,
    text: ar.text,
    theme: ar.theme,
    meditationPrompt: ar.meditationPrompt,
  };
}

export function getLocalizedMilestone(m: Milestone, lang: Language): Milestone {
  if (lang !== "ar") return m;
  const translations: Record<number, { title: string; description: string; verseText: string }> = {
    1: {
      title: "خطوة الإيمان",
      description: "أول ٢٤ ساعة من كسر النمط التلقائي والدخول في النعمة الإلهية الشافية.",
      verseText: "وَأَمَّا الإِيمَانُ فَهُوَ الثِّقَةُ بِمَا يُرْجَى وَالإِيقَانُ بِأُمُورٍ لاَ تُرَى.",
    },
    3: {
      title: "فجر القيامة",
      description: "اجتياز ذروة الانسحاب الجسدي الحادة خلال ٧٢ ساعة. النور يبدأ بالعودة.",
      verseText: "يُحْيِينَا بَعْدَ يَوْمَيْنِ. فِي الْيَوْمِ الثَّالِثِ يُقِيمُنَا فَنَحْيَا أَمَامَهُ.",
    },
    7: {
      title: "منتصر السبت",
      description: "أسبوع كامل من الطهارة. إدراك الفص الجبهي للنزوات يبدأ بالاستيقاظ.",
      verseText: "اُذْكُرْ يَوْمَ السَّبْتِ لِتُقَدِّسَهُ.",
    },
    14: {
      title: "الحارس على الأسوار",
      description: "أسبوعان من اليقظة الروحية. تعلمت رصد المحفزات قبل تحولها إلى اشتهاء.",
      verseText: "عَلَى أَسْوَارِكِ يَا أُورُشَلِيمُ أَقَمْتُ حُرَّاساً لاَ يَسْكُتُونَ كُلَّ النَّهَارِ وَكُلَّ اللَّيْلِ عَلَى الدَّوَامِ.",
    },
    21: {
      title: "بطل صوم دانيال",
      description: "٢١ يوماً من الصوم المقدس عن الشهوة. المسارات العصبية القديمة تضعف بقوة.",
      verseText: "فِي تِلْكَ الأَيَّامِ أَنَا دَانِيآلَ كُنْتُ نَائِحاً ثَلاَثَةَ أَسَابِيعِ أَيَّامٍ، لَمْ آكُلْ طَعَاماً شَهِيّاً...",
    },
    40: {
      title: "غالب تجربة البرية",
      description: "٤٠ يوماً في برية الجهاد متغلباً على التجربة مثل المسيح بسيف كلمة الله.",
      verseText: "لَيْسَ بِالْخُبْزِ وَحْدَهُ يَحْيَا الإِنْسَانُ، بَلْ بِكُلِّ كَلِمَةٍ تَخْرُجُ مِنْ فَمِ اللهِ.",
    },
    90: {
      title: "الذهن المتجدد",
      description: "إعادة تشغيل عصبية كاملة. تجديد الذهن بالكامل وعودة حساسية الدوبامين الطبيعية.",
      verseText: "وَتَغَيَّرُوا عَنْ شَكْلِكُمْ بِتَجْدِيدِ أَذْهَانِكُمْ...",
    },
  };

  const item = translations[m.days];
  if (!item) return m;
  return {
    ...m,
    title: item.title,
    description: item.description,
    verseText: item.verseText,
  };
}

export function getLocalizedTrigger(id: string, lang: Language): string {
  if (lang !== "ar") return id;
  const map: Record<string, string> = {
    Bored: "الملل والفراغ",
    Tired: "التعب والإرهاق",
    Stressed: "التوتر والضغوط",
    Lonely: "الوحدة والعزلة",
    Angry: "الغضب والإحباط",
    "Late Night Phone": "الهاتف في السرير ليلاً",
    "Social Media Trigger": "التصفح العشوائي لوسائل التواصل",
    Hungry: "الجوع الجسدي",
  };
  return map[id] || id;
}

export function getLocalizedTimeOfDay(id: string, lang: Language): string {
  if (lang !== "ar") return id;
  const map: Record<string, string> = {
    Morning: "الصباح (٦ص - ١٢ظ)",
    Afternoon: "بعد الظهر (١٢ظ - ٦م)",
    Evening: "المساء (٦م - ١١م)",
    "Late Night 11PM-3AM": "منتصف الليل (١١م - ٣ص)",
  };
  return map[id] || id;
}

export function getLocalizedQuestion(q: AssessmentQuestion, lang: Language): AssessmentQuestion {
  if (lang !== "ar") return q;
  const map: Record<number, { title: string; question: string; neuroInsight: string }> = {
    1: {
      title: "القهرية والصراع الروحي",
      question: "كم مرة تجد نفسك تشاهد الإباحية أو تمارس العادة حتى بعد أن قطعت وعداً لنفسك ولله بأنك ستتوقف؟",
      neuroInsight: "يشير إلى حلقة دوبامين إجبارية تلقائية تتجاوز الإرادة الواعية وقوة العزيمة."
    },
    2: {
      title: "ضعف فرامل السيطرة",
      question: "بمجرد أن تبدأ رغبة الشهوة، ما مدى صعوبة تحويل انتباهك وتركيزك بعيداً عنها؟",
      neuroInsight: "يقيس مدى انخفاض نشاط قشرة الفص الجبهي أثناء إثارة الجهاز الحوفي الدماغي."
    },
    3: {
      title: "الهروب العاطفي (نموذج HALT)",
      question: "كم مرة تلجأ لهذه العادة للهروب من مشاعر غير مريحة مثل التوتر، الوحدة، الملل، الإرهاق، أو القلق؟",
      neuroInsight: "غالباً ما تعمل الإباحية كمسكن عاطفي اصطناعي ذاتي بدلاً من كونها رغبة جنسية حقيقية."
    },
    4: {
      title: "التصعيد واعتياد الجرعة",
      question: "هل لاحظت أنك أصبحت بحاجة لجلسات أطول أو محتوى أكثر إثارة للشعور بنفس مستوى الإثارة أو الراحة؟",
      neuroInsight: "انخفاض مستقبلات الدوبامين D2 يتطلب محفزات أكثر غرابة وجدة لتحقيق نفس الاستجابة العصبية."
    },
    5: {
      title: "الضعف الليلي وتعب الإرادة",
      question: "كم مرة تؤخر هذه العادة نومك أو تحدث في وقت متأخر من الليل عندما تكون وحيداً مع هاتفك في السرير؟",
      neuroInsight: "تنخفض قوة الإرادة والوظيفة التنفيذية للدماغ بشكل حاد مع إرهاق الدماغ قرب منتصف الليل."
    },
    6: {
      title: "الأفكار الدخيلة والخواطر المباغتة",
      question: "كم مرة تقاطع أفكار أو صور جنسية غير مرغوب فيها تركيزك أثناء المذاكرة، الصلاة، أو مهامك اليومية؟",
      neuroInsight: "الذكريات الجنسية عالية الشدة المخزنة في اللوزة الدماغية تثير أفكاراً واقتحامات ذهنية لا إرادية."
    },
    7: {
      title: "دورة الخزي بعد السقوط",
      question: "كم مرة تشعر بخزي شديد، أو بعد روحي عن الله، أو انطفاء في الطاقة مباشرة بعد السقوط؟",
      neuroInsight: "ارتفاع هرمون البرولاكتين مصحوباً بانهيار الدوبامين السريع يثير شعوراً عصبياً حاداً بالندم والذنب."
    },
    8: {
      title: "أعراض الانسحاب والتململ",
      question: "عندما تحاول البقاء طاهراً لعدة أيام، كم مرة تشعر بالتوتر، العصبية، التململ، أو شدة التجربة غير المعتادة؟",
      neuroInsight: "مرحلة التخلص من السموم العصبية حيث يصرخ الدماغ مطالباً بمستواه المعتاد من الدوبامين."
    }
  };

  const item = map[q.id];
  if (!item) return q;
  return {
    ...q,
    title: item.title,
    question: item.question,
    neuroInsight: item.neuroInsight,
  };
}

export function getLocalizedLikert(lang: Language) {
  if (lang !== "ar") {
    return [
      { value: 0, label: "Never", description: "Not experienced" },
      { value: 1, label: "Rarely", description: "Once a month or less" },
      { value: 2, label: "Sometimes", description: "1-2 times a week" },
      { value: 3, label: "Often", description: "3-5 times a week" },
      { value: 4, label: "Almost Always", description: "Daily occurrence" }
    ];
  }
  return [
    { value: 0, label: "أبداً", description: "لم يحدث معي إطلاقاً" },
    { value: 1, label: "نادراً", description: "مرة شهرياً أو أقل" },
    { value: 2, label: "أحياناً", description: "١-٢ مرات في الأسبوع" },
    { value: 3, label: "غالباً", description: "٣-٥ مرات في الأسبوع" },
    { value: 4, label: "دائماً تقريباً", description: "بشكل يومي مستمر" }
  ];
}
