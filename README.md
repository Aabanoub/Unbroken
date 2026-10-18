# 🛡️ UNBROKEN — Recovery PWA

> *"Clear Eyes, Clean Mind."*
>
> **A 100% Free-Tier Mobile-First Progressive Web App** designed to help teenagers overcome pornography and masturbation addiction through **behavioral neuroscience**, **deep habit analytics**, and **New King James Version (NKJV) Scripture**.

---

## 🌟 Key Features

### 1. 🛡️ Dual-Mode Zero-Cost Architecture ($0 Guaranteed)
- **Zero-Config LocalStorage Mode:** Works immediately upon opening the app—no database setup, no credit cards, zero friction. All data is private and encrypted to the local device.
- **Supabase Cloud Sync (100% Free PostgreSQL):** Connect free environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to sync across devices with pre-configured Row-Level Security (RLS).
- **Vercel & GitHub Ready:** Optimized for single-click deployment to Vercel's free hobby tier.

### 2. 🧠 Scientific Baseline Assessment (BPS & CPUI-9 Psychometrics)
- 8-question scientific assessment evaluating **Compulsivity**, **Loss of Brake Control**, **Emotional Coping (HALT)**, **Escalation & Tolerance**, **Nighttime Vulnerability**, **Cognitive Intrusion**, **Post-Act Guilt Cycle**, and **Withdrawal & Restlessness**.
- **Tier Diagnosis (0 to 32 pts):**
  - **Level 1 (0–10 pts):** *Mild Habitual Loop* — 21-Day Consecrated Fast (70% Initial Dopamine Sensitivity)
  - **Level 2 (11–21 pts):** *Moderate Compulsive Dependency* — 40-Day Wilderness Renewal (45% Initial Dopamine Sensitivity)
  - **Level 3 (22–32 pts):** *High Neurological Dependency* — 90-Day Full Neuroplasticity Reboot (20% Initial Dopamine Sensitivity)

### 3. 🛡️ Motivating Home Dashboard & Anti-Despair Engine
- **Animated Circular Streak Ring:** Live Days, Hours, and Minutes clean counter with an animated progress ring toward the next Biblical rank.
- **Biblical Milestone Ranks:**
  - Day 1: *Step of Faith* (Hebrews 11:1)
  - Day 3: *Resurrection Dawn* (Hosea 6:2)
  - Day 7: *Sabbath Overcomer* (Exodus 20:8)
  - Day 14: *Watchman on the Wall* (Isaiah 62:6)
  - Day 21: *Daniel's Fast Victor* (Daniel 10:2-3)
  - Day 40: *Wilderness Conqueror* (Matthew 4:1-4)
  - Day 90: *Renewed Mind* (Romans 12:2)
- **The "30-Day Victory Rate" Metric:** Shows `(Clean Days in Last 30 Days / 30) * 100%`. If a teen slips, their streak resets, but their 30-day rate remains **93%+**, actively preventing the despair spiral and binge relapse loops.
- **Daily NKJV Anchor Card:** Daily rotating Scripture with meditation guides, vault saving, and 1-tap sharing.
- **Grace-Filled Relapse Modal:** If a relapse is logged, immediately covers the teen with **Micah 7:8** and **1 John 1:9 (NKJV)** and prompts an actionable environmental boundary adjustment before resetting.

### 4. 📊 Comprehensive Analytics Suite ("Large Analysis" Tab)
- **Current Addiction Severity Index:** Dynamic psychometric index that decreases in real-time as clean days accumulate and urges are conquered.
- **Neuroplasticity & Brain Reboot Progress (0% to 100%):** 4 biological healing stages:
  1. *Days 1–7:* Prefrontal cortex impulse awareness awakening.
  2. *Days 8–21:* Dopamine receptor sensitivity restoration begins.
  3. *Days 22–45:* Compulsive habit pathways weakening.
  4. *Days 46–90:* Deep neuroplasticity rewiring and baseline dopamine balance.
- **Urge Intensity vs. Self-Control Area Chart (`recharts`):** Dual-gradient timeline plotting cravings against cumulative clean streak momentum.
- **HALT Trigger Breakdown (Horizontal Bar Chart):** Ranks triggers (*Boredom*, *Tiredness*, *Stress*, *Loneliness*, *Late Night Phone in Bed*).
- **Targeted AI Neuroscience Insight:** Dynamic behavioral advice based on the teen's top trigger (e.g. *"Your #1 trigger is Late Night Phone. Charge your device outside the bedroom at 10:30 PM."*).
- **Circadian Heatmap:** Visual vulnerability breakdown by time of day (*Morning*, *Afternoon*, *Evening*, *Late Night 11PM-3AM*).

### 5. 🚨 SOS "Urge Rescue" Protocol (Center Floating Panic Button)
1. **Stage 1: 60-Second Box Breathing:** Interactive glowing expanding/contracting breathing ring with 16-second cycle (4s Inhale, 4s Hold, 4s Exhale, 4s Hold) to calm the autonomic nervous system.
2. **Stage 2: The Sword of the Spirit:** High-impact NKJV Scripture battle cards (**1 Cor 10:13**, **2 Tim 2:22**, **Ps 119:9**, **Gal 5:16**) with "Read Aloud 3 Times" verbal counter.
3. **Stage 3: Physical Pattern Interrupt:** Checklist for leaving the room, 20 pushups, cold water on face, and moving the phone.
4. **"I Defeated This Urge!":** Triggers a triumphant confetti explosion, increments lifetime defeated urges trophy counter, and logs victory.

### 6. 📖 NKJV Scripture Vault & Live Bolls Life API
- 25+ pre-loaded exact NKJV verses categorized by emotional states: `temptation`, `grace_after_relapse`, `identity`, `mind_renewal`, `discipline`.
- Free & keyless **Bolls Life Bible API** live search (`https://bolls.life/get-verse/NKJV/{bookId}/{chapter}/{verse}/`) with automatic offline fallback.
- Save Scriptures to personal reflection journal.

### 7. 🌐 Arabic Language & Light Mode Options
- **Bilingual Internationalization (Arabic & English):** Instant switching between **English (LTR)** and **Arabic (العربية RTL)** with native typography and Smith & Van Dyck Arabic Bible verses.
- **Light & Dark Themes:** Seamless toggling between sleek **Dark Mode** (`#090D16`) and high-contrast, clean **Light Mode** (`#F8FAFC`).
- **Accessible Everywhere:** Quick switchers in the top navigation bar, on the Login page, and in the Shield & Settings menu with persistent state in `localStorage` and `UserProfile`.

### 8. 🔒 Discreet Privacy & Multi-User Isolation
- **Multi-User Data Isolation:** Every registered user has their own independent data space; multiple disciples can use the app on the same device without data collisions.
- **4-Digit PIN Lock Screen:** Discrete keypad with attempt limits.
- **Disguised App Header:** 1-tap toggle to disguise the header as **"Daily Habits"** so nobody glancing over a teen's shoulder knows they are in recovery.

---

## 🚀 Quickstart & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```

Open `http://localhost:3000` in any mobile browser or desktop browser.

---

## 🗄️ Supabase Free-Tier Setup (Optional)

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project and open the **SQL Editor**.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Add these environment variables in `.env.local` or on your Vercel Project Settings:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Deploy to Vercel via GitHub for 100% free hosting.
