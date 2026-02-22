# pkminfotech.com → Exam Practice + Mock Test + Online Tools Platform  
## End-to-End Transformation Roadmap

**Document version:** 1.0  
**Target:** Indian market, 1 developer, limited budget, long-term organic growth  
**Current state:** 6-year domain, 86 indexed pages, mixed tech & travel blog (Next.js CMS, MongoDB, NextAuth)

---

# 1. Business Strategy

## 1.1 Clear Niche Positioning

**One-line positioning:**  
*"India’s free exam practice and mock test platform for government jobs, banking, SSC, railways, and competitive exams—with calculators and tools."*

**Refined niche (avoid "everything"):**
- **Primary:** Government job exams (SSC, Railway, Banking, UPSC prelims-style MCQs)
- **Secondary:** Entrance exams (CAT, GATE, JEE/NEET practice), recruitment tests
- **Tertiary:** Online tools (percentage calculator, compound interest, age calculator, etc.) — high search volume, low competition, strong for Adsense

**What you are NOT (to stay focused):**
- Not a full coaching institute replacement
- Not a paid test series first (free first, premium later)
- Not a generic “education” site

**Tagline options (Hindi + English audience):**
- "Free Mock Tests & Exam Practice – Sarkari Naukri, Banking, SSC"
- "Practice. Test. Clear. – Free exam mock tests and tools"

---

## 1.2 Target Audience

| Segment | Description | Primary needs | Where they are |
|--------|-------------|----------------|-----------------|
| **Govt job aspirants** | 18–28, Hindi + English, tier 2/3 | Free mock tests, topic-wise practice, previous papers | Google: "SSC mock test free", "railway mock test online" |
| **Banking aspirants** | 22–30 | Quantitative, reasoning, English mock tests | "IBPS mock test", "SBI clerk mock test" |
| **Entrance exam** | 17–25 | Subject-wise MCQs, speed practice | "GATE previous year questions", "CAT quant practice" |
| **Tools users** | Broad | Quick answers: percentage, interest, age, conversion | "percentage calculator", "compound interest calculator" |

**India focus:**
- Keywords in Hindi (e.g. "mock test", "previous paper", "sarkari exam") + English
- Content in English by default; critical pages in Hinglish or Hindi where it converts
- Mobile-first (most traffic will be mobile)
- Consider Aadhaar-free signup for practice; optional account for saving progress

---

## 1.3 Competitive Advantage

| Advantage | How you use it |
|-----------|----------------|
| **6-year domain** | Trust and backlink history; keep existing URLs and redirect carefully |
| **Existing 86 pages** | Don’t kill them; repurpose or redirect with a clear content plan |
| **Single developer** | Focus on one stack (Next.js), reuse current CMS and auth |
| **Free-first** | Many competitors lock content; you offer real free practice + tools |
| **Tools + tests** | Tools bring broad traffic and ad revenue; tests build depth and return visits |
| **No app required** | PWA-ready site works like an app without Play Store dependency |

---

## 1.4 Monetization Model

**Phase 1 (Months 1–6):**
- **Google AdSense** on all pages (you already have setup): in-article, sidebar, sticky mobile. Focus on high-CTR placements on tools and result pages.
- **Affiliate (soft):** Book recommendations (Amazon), test series (only if genuinely useful). One clear “Recommended books” or “Resources” section per exam.

**Phase 2 (Months 6–12):**
- **Premium mock tests:** 2–3 full-length tests per exam as paid (R99–299). Use Stripe/Razorpay; keep 80%+ content free.
- **Sponsored tests:** Coaching institutes sponsor a “branded mock test” (fixed fee).

**Phase 3 (Year 2+):**
- **Subscription lite:** “Pro” — no ads, downloadable PDFs, more tests (e.g. ₹199/month or ₹999/year).
- **Lead gen:** Partner with coaching for “contact for counselling” (pay per lead), only with user consent.

**Revenue mix target (Year 1):**  
Adsense 70%, Affiliate 15%, Premium tests 15%.

---

# 2. SEO Migration Plan

## 2.1 Redesigning Homepage Without Losing SEO

**Principles:**
- Keep **same URL:** `https://www.pkminfotech.com/` (no redirect).
- Keep **same core signals:** same domain, same root; change only content and layout.
- **Enhance, don’t replace in one shot:** Introduce new sections (Exam categories, Mock tests, Tools) above the fold while keeping a “Latest from blog” or “Guides” section that still links to existing posts.
- **Title/description:** Evolve gradually. Example transition:
  - Current (concept): "Latest Tech News, Business Updates & Travel Guides | pkminfotech"
  - New: "Free Mock Tests, Exam Practice & Online Tools | SSC, Banking, Railway | pkminfotech"
  - Do this in one go but keep brand name and main keywords; avoid changing again for 6+ months.
- **Internal links:** From day one, link from homepage to 5–10 key new sections (exam categories, top tools, “Start free mock test”). Link from new sections back to relevant old blog posts where they add value (e.g. “SSC preparation tips” → old article if any).
- **Technical:** Don’t change canonical of homepage. Ensure new homepage is server-rendered (your current setup is), and core content isn’t hidden behind heavy JS so crawlers see it.

**Homepage content blocks (in order):**
1. Hero: Headline + “Choose exam” / “Try a mock test” / “Use a tool” (CTAs).
2. Exam categories (cards: SSC, Banking, Railway, etc.) with links to `/exams/[exam-slug]`.
3. Featured mock tests (e.g. “SSC CGL Tier 1 – 100 questions”).
4. Popular tools (e.g. Percentage calculator, Compound interest).
5. “Latest articles” (existing blog posts — keep this to preserve relevance and internal links).
6. Footer with silo links (exams, tools, blog, about, contact).

---

## 2.2 Handling Existing 86 Indexed URLs

**Audit first:**
- Export from GSC: all indexed URLs, impressions, clicks, position.
- Classify each URL:
  - **Keep as-is:** High value, still relevant (e.g. some tech/how-to that fits “tools” or “career”).
  - **Keep but refresh:** Same URL, update content to be exam/tools-related or add a clear “Related mock tests” section.
  - **Redirect 301:** Off-topic (e.g. random travel) → best matching new page (e.g. `/exams` or `/tools`) or `/blog` if it’s a list.
  - **Noindex + later remove:** Only for duplicate or very low value; prefer redirect over deletion.

**Rules:**
- **No URL change for kept pages.** If a blog post stays, its path stays (e.g. `/some-old-post`).
- **301 redirect only when you retire a URL.** Redirect to the closest thematic page or `/blog`.
- **Avoid mass 301 to homepage** (too many to one URL can look soft-404). Prefer redirect to category or `/blog`.
- **Update internal links:** In remaining blog posts, add links to new exam/tool pages so link equity flows into the new structure.
- **Sitemap:** Add new sections (exams, mock tests, tools); keep existing blog URLs in sitemap until you redirect or noindex them. Remove from sitemap only after 301 or noindex is live and verified.

**Suggested mapping:**
- Tech/career/education posts → keep, add “Practice SSC mock test” etc. in content or sidebar.
- Travel/off-topic → 301 to `/blog` or `/exams` (one target per type).
- Old “latest”, “english”, “hindi” listing pages → keep URL, change page content to new listing (exams + blog mix) or redirect to new `/blog` if you consolidate.

---

## 2.3 Internal Linking Structure

**Silo idea:**  
Exams = one silo; Tools = another; Blog = supporting (career tips, how-to). Homepage and main category pages are “pillar” pages.

**Link flow:**
- **Homepage** → Exam categories, Top tools, Blog.
- **Exam category** (e.g. `/exams/ssc`) → List of tests, list of practice sets, related blog posts.
- **Mock test / practice set page** → Same exam category, “More tests”, related tools (e.g. “Percentage calculator” for quant).
- **Tool page** → Tools category, “More tools”, and optionally relevant exam (e.g. “Use for SSC quant”).
- **Blog post** → At least one CTA to an exam or tool; sidebar “Popular tests” / “Popular tools”.

**Anchors:** Prefer descriptive (e.g. “SSC CGL mock test”, “percentage calculator”) over “click here”. Reuse focus keywords naturally.

**Count:** Each new page should get 2–5 internal links from existing or new pages. Homepage and category pages should have 15–30 outlinks to key content.

---

## 2.4 Silo Architecture

```
/                          → Homepage (exams + tools + blog)
/exams                     → Exam hub (all exam categories)
/exams/[exam-slug]         → e.g. /exams/ssc, /exams/banking
/exams/[exam]/practice     → Topic-wise practice (optional sub)
/exams/[exam]/mock-tests   → List of mock tests for that exam

/mock-tests                → All mock tests (optional hub)
/mock-tests/[test-slug]    → Single mock test (attempt + result)

/practice                  → All practice sets (optional hub)
/practice/[set-slug]       → Single practice set (unlimited attempts)

/tools                     → Tools hub
/tools/[tool-slug]         → e.g. /tools/percentage-calculator

/blog                      → Blog listing (existing content)
/blog/[slug]               → Keep existing blog URL pattern (e.g. /[slug] if that’s current)
```

Use **one primary silo per section:**  
Exams under `/exams/*`, tools under `/tools/*`, blog under `/blog` or current pattern. Avoid mixing (e.g. don’t put tools under `/exams`).

---

## 2.5 Category Structure

**Exams (categories):**
- SSC (CGL, CHSL, MTS, etc.)
- Railway (RRB NTPC, Group D, etc.)
- Banking (IBPS PO/Clerk, SBI PO/Clerk, RBI)
- UPSC (Prelims practice)
- Defence (CAPF, CDS, etc.)
- Other (state-level, teaching, etc.)

**Tools (categories):**
- Calculators (percentage, compound interest, simple interest, age, etc.)
- Converters (units, etc.)
- Other (date, number, etc.)

**Blog:**  
Keep existing categories (e.g. latest, english, hindi) for old content; for new posts use tags like “SSC”, “Banking”, “Exam tips”, “Career”.

---

## 2.6 URL Structure

**Rules:**  
Lowercase, hyphens, avoid query params for primary content, keep short and readable.

| Type | Pattern | Example |
|------|--------|--------|
| Exam category | `/exams/[exam-slug]` | `/exams/ssc`, `/exams/banking` |
| Mock test | `/mock-tests/[test-slug]` | `/mock-tests/ssc-cgl-tier-1-100-questions` |
| Practice set | `/practice/[set-slug]` | `/practice/ssc-quant-mcq-50` |
| Tool | `/tools/[tool-slug]` | `/tools/percentage-calculator` |
| Blog | Keep current | `/[slug]` or `/blog/[slug]` (choose one and stick) |

**Existing blog URLs:**  
Do not change. If current pattern is `pkminfotech.com/[slug]`, keep it and add new routes under `/exams`, `/tools`, `/mock-tests`, `/practice` so there’s no collision.

---

## 2.7 Keyword Strategy (India-Focused)

**Primary keywords (to target with pages):**
- Exam: "SSC CGL mock test free", "IBPS PO mock test online", "Railway group d mock test", "free mock test for sarkari exam"
- Practice: "SSC previous year questions", "banking exam practice", "quantitative aptitude practice"
- Tools: "percentage calculator", "compound interest calculator", "age calculator", "simple interest formula calculator"

**Content mapping:**
- One exam category page per exam (e.g. "SSC Mock Tests & Practice").
- One mock test page per test (title: e.g. "SSC CGL Tier 1 Free Mock Test – 100 Questions").
- One tool page per tool (title: e.g. "Percentage Calculator – Calculate % Online Free").
- Blog: long-tail and tips ("How to prepare for SSC CGL in 3 months", "Best books for IBPS PO").

**Search intent:**  
Mock test / practice pages = transactional/practice intent; tool pages = direct answer intent; category pages = informational + navigational; blog = informational.

**Volume vs competition:**  
Prioritise "free mock test" + exam name, "calculator" + type (India). Use free keyword tools (Ubersuggest, Google Keyword Planner) to pick 20–30 keywords for Month 1–2.

---

# 3. Feature Architecture

## 3.1 Exam Practice System

**Concept:**  
Topic-wise or mixed MCQs; unlimited attempts; instant feedback (right/wrong + explanation if stored).

**Entities:**
- **Exam** (e.g. SSC CGL)
- **PracticeSet** (e.g. "Quant – 50 questions", "Reasoning – 30 questions")
- **Question** (stem, options, correct index, explanation, subject/topic)
- **Attempt** (optional: user, set, answers, score, startedAt, completedAt) — can be anonymous if no auth

**Flow:**
1. User lands on `/exams/ssc` → sees "Practice" and "Mock tests".
2. Clicks "Practice" → `/practice/ssc-quant-50` (or list first).
3. Questions shown one-by-one or all on one page (configurable).
4. On submit: show score, correct/incorrect, optional explanation.
5. No login required; optional "Save progress" if logged in.

**Data:**  
Questions can be stored in DB (MongoDB/PostgreSQL via Prisma). Start with 5–10 sets (e.g. 2–3 for SSC, 2 for Banking) with 20–50 questions each.

---

## 3.2 Mock Test System

**Concept:**  
Timed, full-length or half-length test; one attempt per test per user (or per device if no auth); result page with score, rank (optional), and review.

**Features:**
- **Timer:** Countdown (e.g. 60 min). On expiry, auto-submit.
- **Question navigation:** Next/prev, flag for review, question palette (optional).
- **Submit:** Confirm dialog; then redirect to result page.
- **Result page:** Total score, section-wise (if any), correct/incorrect/unattempted, optional leaderboard (e.g. last 100 attempts).
- **Persistence:** Store attempt in DB (anonymous or by user). No need to persist per-question timing in v1.

**Same entities as practice where applicable;** add **MockTest** (title, examId, durationMinutes, questionIds or practiceSetId, isPremium, etc.).

**URLs:**  
`/mock-tests/[slug]` → attempt; `/mock-tests/[slug]/result?attempt=xxx` or result as same page with hash/state.

---

## 3.3 Quiz System

**Relationship to practice/mock:**  
- **Practice** = untimed, can retry anytime, topic/set based.  
- **Mock test** = timed, exam-like, limited attempts.  
- **Quiz** can be a lighter label: same backend as “practice” but smaller sets (e.g. "5 min quiz – 10 questions") or daily quiz.  

Recommendation: **Unify with practice** (same tables and routes); use "quiz" only in UI/labels for short sets. No separate "quiz system" codebase.

---

## 3.4 Online Tools Section

**Examples:**  
Percentage calculator, compound interest, simple interest, age calculator, percentage increase/decrease, discount calculator.

**Implementation:**  
Each tool = one page under `/tools/[tool-slug]`. Client-side calc (React state) or minimal API. No DB for calculations. Optional "Save result" or "Share" that generates a link (e.g. query params) or copy to clipboard.

**SEO:**  
Unique title, meta description, one H1, short intro, form/inputs, result, and 2–3 FAQs (schema FAQPage). Internal links to "More tools" and related exam if relevant.

**Ad placement:**  
Above fold (below tool), sidebar (desktop), after result (mobile). Tools are ideal for Adsense.

---

## 3.5 User Dashboard (Optional)

**Phase 1:**  
Skip full dashboard. Optional: "Save my progress" → requires signup → store attempts linked to user. Show "Your last attempts" on a simple `/my/attempts` page.

**Phase 2:**  
Dashboard: `/dashboard` — list of attempts, bookmarks, optional "My mock tests", profile (name, email). Keep scope small so one developer can ship.

**Auth:**  
Reuse NextAuth; add Credentials or Google. No need for email verification in v1 if you accept some spam risk.

---

## 3.6 Admin Panel Structure

**Reuse current admin** (`/admin/*`). Add:

- **Exams:** CRUD for exams (name, slug, description, order).
- **Practice sets:** CRUD; link to exam; add questions (inline or bulk).
- **Questions:** CRUD; link to set or mock test; stem, options, correct answer, explanation, subject/topic.
- **Mock tests:** CRUD; link exam, duration, select questions/sets, set free/premium.
- **Tools:** Either static pages (no CMS) or simple "Tool" entity (name, slug, description, config) if you want to manage from admin.
- **Attempts (read-only):** List recent mock test attempts (for support and to build leaderboard).

Keep **Blogs, Pages, Ads, Media** as they are. No need to split admin into multiple apps.

---

# 4. Technical Architecture (Next.js)

## 4.1 Recommended Folder Structure

```
src/
├── app/
│   ├── (marketing)/           # Optional group for layout
│   │   ├── page.tsx           # New homepage
│   │   ├── exams/
│   │   │   ├── page.tsx       # Exam hub
│   │   │   └── [examSlug]/
│   │   │       └── page.tsx   # Exam category
│   │   ├── mock-tests/
│   │   │   ├── page.tsx       # List
│   │   │   └── [testSlug]/
│   │   │       ├── page.tsx   # Attempt test
│   │   │       └── result/
│   │   │           └── page.tsx
│   │   ├── practice/
│   │   │   ├── page.tsx
│   │   │   └── [setSlug]/
│   │   │       └── page.tsx
│   │   ├── tools/
│   │   │   ├── page.tsx       # Tools hub
│   │   │   └── [toolSlug]/
│   │   │       └── page.tsx
│   │   └── blog/              # If you move blog under /blog
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── admin/                 # Existing
│   ├── api/
│   │   ├── exams/
│   │   ├── practice/
│   │   ├── mock-tests/
│   │   ├── attempts/
│   │   ├── tools/             # If any server-side calc
│   │   └── ...
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── exams/
│   ├── mock-tests/
│   ├── practice/
│   ├── tools/
│   ├── ui/
│   └── ...
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── seo-utils.ts
│   └── ...
└── types/
```

Use **existing** `app/page.tsx`, `app/[slug]`, etc. and add `app/exams`, `app/mock-tests`, `app/practice`, `app/tools` without breaking current routes. If your blog is at `/[slug]`, keep it; ensure no exam or tool slug collides (e.g. reserve prefixes).

---

## 4.2 Database Schema (MongoDB with Prisma)

**Keep:** User, Blog, Ad, Page.

**Add (minimal v1):**

```prisma
model Exam {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String   // e.g. "SSC CGL"
  slug        String   @unique
  description String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  practiceSets PracticeSet[]
  mockTests   MockTest[]
}

model PracticeSet {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String   @unique
  examId      String   @db.ObjectId
  exam        Exam     @relation(fields: [examId], references: [id])
  questionIds String[] // Array of Question id
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  questions   Question[]  // relation via questionIds if you model it
}

model Question {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  stem        String   // question text
  options     String[] // ["A", "B", "C", "D"]
  correctIndex Int     // 0-based
  explanation String?
  subject     String?  // quant, reasoning, english
  topic       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model MockTest {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  slug        String   @unique
  examId      String   @db.ObjectId
  exam        Exam     @relation(fields: [examId], references: [id])
  durationMinutes Int
  questionIds String[]
  isPremium   Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  attempts    Attempt[]
}

model Attempt {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  mockTestId   String   @db.ObjectId
  mockTest     MockTest @relation(fields: [mockTestId], references: [id])
  userId       String?  @db.ObjectId  // optional
  answers      String[] // e.g. ["0","2","1",...] per question index
  score        Int
  total        Int
  startedAt    DateTime @default(now())
  completedAt  DateTime?
}
```

**Note:** For MongoDB you may store `questionIds` and then lookup Questions in a separate query; or embed question snapshot in Attempt for history. Start simple: separate Question collection and reference by id.

**PostgreSQL alternative:** Same structure; use `@db.Uuid` or auto-increment if you prefer. Prisma supports both.

---

## 4.3 API Routes Structure

- `GET /api/exams` — list exams
- `GET /api/exams/[slug]` — one exam with sets and mock tests
- `GET /api/practice/[setSlug]` — get practice set with questions (or question ids and fetch questions)
- `POST /api/practice/[setSlug]/submit` — body: `{ answers: number[] }` → return score + correct/incorrect
- `GET /api/mock-tests/[testSlug]` — get test meta + question ids (don’t send answers)
- `POST /api/mock-tests/[testSlug]/start` — create Attempt, return attemptId
- `POST /api/mock-tests/[testSlug]/submit` — body: `{ attemptId, answers }` → compute score, update Attempt, return result
- `GET /api/attempts/[id]` — get attempt for result page (optional auth check)

Use **route handlers** in `app/api/...`. Keep auth optional; rate-limit by IP for submit endpoints to avoid abuse.

---

## 4.4 Authentication System

**Current:** NextAuth with one admin role.

**Add:**
- **Credentials provider** (email + password) for students, or
- **Google OAuth** for "Sign in to save progress" (no password storage).
- **Session:** Same NextAuth session; add a role or flag `role: 'user' | 'admin'`. Admins get existing admin UI; users get optional dashboard.
- **No auth required** for taking tests or using tools; auth only for "My attempts", saved progress, or premium tests later.

**Tables:** User already exists; ensure one user can have both "admin" and "user" or use a single role field.

---

## 4.5 Scalability Strategy

- **Read-heavy:** Cache exam list, practice set list, mock test list (e.g. Next.js `revalidate` or Redis later). Question payloads can be cached per set/test.
- **Write:** Only attempts and optional user progress. MongoDB/PostgreSQL on a single instance is enough for a long time.
- **Static:** Tool pages can be largely static; generate metadata at build or with ISR.
- **Rate limiting:** Apply to submit and start endpoints (e.g. 30 req/min per IP) to avoid bots.
- **CDN:** Keep using Vercel edge for static assets and HTML; no change needed initially.
- **DB:** Start with MongoDB Atlas (or existing) M10 or equivalent; move to larger tier when you see consistent load. No need for read replicas in year 1.

---

# 5. UI/UX Structure

## 5.1 Homepage Layout Sections (Top to Bottom)

1. **Header:** Logo, Nav (Exams, Mock tests, Practice, Tools, Blog), CTA "Free mock test", mobile menu.
2. **Hero:** Headline ("Free Mock Tests & Exam Practice for Govt Jobs"), subline, primary CTA "Browse exams", secondary "Try a tool".
3. **Exam categories:** 6–8 cards (SSC, Railway, Banking, etc.) with icon + name + "Practice" / "Mock test" link.
4. **Featured mock tests:** 3–4 tests with "Start" button, duration, questions count.
5. **Popular tools:** 4–6 tool cards (icon + name) linking to `/tools/[slug]`.
6. **How it works:** 3 steps (Choose exam → Practice / Mock test → Track progress).
7. **Latest from blog:** 3–6 existing blog posts (keep for SEO and relevance).
8. **Footer:** Links (Exams, Tools, Blog, About, Contact, Privacy), optional newsletter (Phase 2).

**Above the fold (mobile):** Hero + one row of exam cards or one CTA. No heavy images.

---

## 5.2 Conversion Strategy

- **Primary goal:** Start a mock test or practice set (or use a tool). Secondary: sign up to save progress.
- **CTAs:** One primary per section ("Start SSC mock test", "Calculate percentage"). Same style (e.g. solid button) across site.
- **Trust:** "Free", "No signup required", "86+ pages of content" (reuse existing strength). Later: "50k+ tests taken".
- **Exit intent:** Optional soft popup "Save your progress? Create free account" on result page (Phase 2).

---

## 5.3 CTA Placement

- **Homepage:** Hero (Browse exams / Try a tool), after exam cards (per exam CTA), after featured tests (Start test), after tools (Use tool).
- **Exam category page:** "Start mock test" and "Practice" at top and after intro.
- **Mock test page:** Single prominent "Start test" (and timer + "Submit" during test).
- **Result page:** "Try another test", "Practice more", "Share score" (optional).
- **Tool page:** Use tool is the main action; secondary "More tools".
- **Blog post:** End and sidebar — "Practice SSC mock test" or "Use percentage calculator".

---

## 5.4 Mobile-First Layout

- Single column for all key flows; two columns only on desktop where it helps (e.g. sidebar with "More tests").
- Touch targets ≥ 44px; spacing between links so no mis-taps.
- Sticky header with hamburger; footer with key links.
- Mock test: one question per view on mobile with Next/Prev; optional question palette as drawer.
- Forms (tools): large inputs, one per row on mobile.
- Ads: one block after hero, one after content; avoid multiple interstitials.

---

# 6. 90-Day Execution Plan

## Month 1: Foundation

**Week 1–2:**
- Finalise keyword list (20 exam + 10 tools); content mapping for first 10 tool pages and 3 exam categories.
- Export GSC URLs; classify 86 URLs (keep / refresh / redirect). Create redirect table (old URL → new URL).
- DB: Add Prisma models (Exam, PracticeSet, Question, MockTest, Attempt); run migration. Seed 2 exams (e.g. SSC, Banking), 2 practice sets (20 questions each), 1 mock test (same questions, 30 min).
- Implement `/exams`, `/exams/[slug]`, `/practice/[setSlug]` (attempt + submit), `/mock-tests/[testSlug]` (start + submit + result). API routes as in 4.3.
- New homepage layout (sections 1–5 from 5.1) with placeholder content; keep existing blog block and footer.

**Week 3–4:**
- Deploy redirects (301) for URLs you decided to retire; update sitemap (add `/exams`, `/practice`, `/mock-tests`). Update internal links from homepage and exam pages to old blog URLs where relevant.
- Build 5 tool pages (e.g. percentage, compound interest, simple interest, age, percentage increase). Each: page, meta, simple UI, no backend. Add `/tools` hub.
- Admin: CRUD for exams, practice sets, questions, mock tests. No need for fancy UI; functional is enough.
- Launch new homepage (same URL); monitor GSC for crawl errors and indexing of new URLs.

**Deliverables:** New homepage live, 2 exams + 2 practice sets + 1 mock test, 5 tools, redirects live, sitemap updated, admin can add content.

---

## Month 2: Content + Tools

**Week 5–6:**
- Add 2 more exams (e.g. Railway, UPSC prelims-style); 2 practice sets each; 2 more mock tests. Total: 4 exams, 6+ sets, 3+ mock tests.
- Add 5 more tools (discount, SI from formula, etc.); interlink tools and add "Use in exam" where relevant.
- Publish 4–6 new blog posts (exam tips, how to use mock tests, calculator guides) targeting chosen keywords. Link from posts to exams and tools.
- Implement optional auth (Google or email); "Save progress" or "My last attempt" on result page (simple list). No full dashboard yet.

**Week 7–8:**
- Expand to 8–10 tools; add FAQ schema to tool pages; submit new URLs to GSC.
- Internal linking pass: from every blog post to at least one exam and one tool; from exam pages to blog posts.
- Fix any broken links from redirects; add "Related tests" and "Related tools" components on key pages.
- Optional: Leaderboard for one mock test (last 100 attempts, nickname or "Guest").

**Deliverables:** 4 exams, 6+ practice sets, 3+ mock tests, 10 tools, 4–6 new blog posts, optional login and "My attempts", improved internal linking.

---

## Month 3: Authority Building

**Week 9–10:**
- Add 2–3 more mock tests and 2 more practice sets; aim for 5 exams, 5 mock tests, 8+ practice sets.
- Refresh 5–10 high-potential old blog posts (add section "Practice here" with link to exam/tool). No URL changes.
- Apply for or re-check AdSense; ensure policy compliance (no misleading CTAs, clear privacy policy). Optimise ad units on tool pages and result pages.
- Basic analytics: track "Start test", "Complete test", "Use tool" (GA4 events). Set up goals.

**Week 11–12:**
- Outreach: 2–3 quality backlinks (resource page, forum, or partner). No paid links.
- One "State of SSC/Banking" or "Free mock test index" page that can attract links.
- Final sitemap and index check; noindex any duplicate or low-value legacy URLs you didn’t redirect.
- Document runbook: how to add exam, set, mock test, tool; how to add redirects.

**Deliverables:** More content, refreshed posts, AdSense in place, events tracked, 2–3 backlinks, runbook. Ready to scale content and consider premium tests in Month 4+.

---

# 7. Revenue Growth Plan (1 Year Projection)

## Assumptions (Conservative)

- Current: ~86 indexed pages; assume current traffic is modest (e.g. 5–15k monthly visits). Post-migration dip possible in months 1–2, then recovery.
- New content: 4 exam categories, 5 mock tests, 8+ practice sets, 10+ tools, 10+ new/refreshed blog posts by month 3.
- India traffic; RPM for Adsense in this niche: rough range ₹30–80 (tools and result pages higher).

## Traffic Targets (Rough)

| Month | Focus | Monthly sessions (target) | Notes |
|-------|--------|---------------------------|--------|
| 1–2   | Launch, redirects | 5–10k | Maintain; avoid drop |
| 3     | New pages index | 10–20k | Tools + exam pages start ranking |
| 4–6   | Content + links | 25–50k | More tools and tests |
| 7–9   | Scale content | 50–100k | 20+ tools, 10+ mock tests |
| 10–12 | Authority | 100–200k | Repeat traffic, brand queries |

## Monetization Scaling

- **Months 1–3:** Adsense only; optimize placement on tools and result pages.
- **Months 4–6:** Affiliate (books/resources); one clear section per exam. Premium: launch 1–2 paid mock tests (R99–199).
- **Months 7–12:** More premium tests; optional "Remove ads" or Pro subscription (R199/mo or R999/yr) if product is stable.

## Revenue Bands (Indicative, INR)

- **Low (e.g. 30k sessions, RPM ₹40):** ~₹1,200/month Adsense; affiliate ~₹500; total ~₹1.7k.
- **Mid (100k sessions, RPM ₹50):** ~₹5,000 Adsense; affiliate ~₹2k; premium ~₹3k; total ~₹10k.
- **High (200k sessions, RPM ₹60):** ~₹12,000 Adsense; affiliate ~₹5k; premium ~₹8k; total ~₹25k.

Adjust with real RPM and conversion rates. Focus on traffic and UX first; revenue follows.

---

# 8. Risk Analysis

## 8.1 SEO Risks

| Risk | Mitigation |
|------|------------|
| Homepage change causes drop | Same URL, gradual content shift; keep blog block; don’t change title too often. |
| Mass redirects look like site move | Redirect only retired URLs; keep most URLs as-is. Use 301; avoid redirect chains. |
| New pages don’t index | Submit sitemap; internal link from homepage and category pages; avoid blocking in robots. |
| Keyword cannibalisation | One primary page per keyword (one "SSC mock test" page, not five). |
| Thin content | Each tool page: 300+ words intro + FAQs; each exam page: 200+ words + lists. |
| Core Web Vitals | Lazy-load below fold; optimize images (you have Cloudinary); minimal JS for first paint. |

## 8.2 Domain Trust Issues

- **6-year domain:** Asset. Don’t change domain; keep brand (pkminfotech) and migrate content in place.
- **Topic shift:** Google may reassess relevance. Mitigate with clear new theme (exams + tools), consistent internal linking, and keeping useful old content or redirecting cleanly.
- **E-E-A-T:** Add/about page, author or "Team" in footer, clear contact and privacy policy. Later: short bios, "How we create mock tests".

## 8.3 Migration Mistakes to Avoid

- **Changing blog URL structure** without 301s (e.g. moving from `/[slug]` to `/blog/[slug]` without redirects). If you change, 301 every old URL.
- **Deleting or noindexing** high-value pages without redirecting.
- **Bulk 301 to homepage** for many URLs (prefer category or `/blog`).
- **Launching without redirect list** and then changing URLs again.
- **Ignoring mobile** (most Indian traffic).
- **Over-promising** ("Lakhs of questions") with little content; start small and scale.
- **Copying question banks** from other sites (copyright); use original or licensed content.
- **Skipping rate limiting** on submit APIs (leads to spam and server load).

---

# Summary Checklist

- [ ] Positioning: Exam practice + mock tests + tools; India; free-first.
- [ ] Monetization: Adsense → affiliate → premium tests → optional subscription.
- [ ] Homepage: Same URL; new sections; updated title/description once.
- [ ] 86 URLs: Audit → keep/refresh/301; no mass 301 to homepage.
- [ ] Silo: `/exams`, `/mock-tests`, `/practice`, `/tools`; blog unchanged.
- [ ] Features: Practice (unlimited), Mock test (timer, result), Tools (client-side), optional auth/dashboard.
- [ ] Tech: Next.js, Prisma, MongoDB (or PostgreSQL); reuse admin and auth.
- [ ] 90 days: M1 foundation + redirects + 5 tools; M2 content + 10 tools + auth; M3 authority + AdSense + links.
- [ ] Revenue: Traffic first; scale Adsense and premium in months 4–12.
- [ ] Risks: Redirect carefully; one primary page per keyword; rate-limit APIs; original content only.

You can use this document as the single source of truth and break it down into tickets (e.g. "Add Exam model", "Build /exams/[slug] page", "Create redirect list") for your first month.
