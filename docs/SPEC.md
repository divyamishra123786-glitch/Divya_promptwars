# BLINDSPOT AI — PRODUCT SPECIFICATION & GUARDRAILS

**Tagline:** "Every decision has a side you haven't seen."  
**Secondary line:** "See Beyond What You See."  
**Hackathon theme:** "The Blind Spot — Same decisions. A wider view."

---

## 1. NON-NEGOTIABLE AI GUARDRAILS

- **The AI never decides for the user:** No "you should accept/reject", no "best option". Enforced in prompts AND a server-side post-check.
- **No invented facts or statistics:** Mark uncertainty explicitly. No numeric probability or confidence scores; risk/severity are qualitative **Low / Medium / High**, labelled "AI-estimated, not statistical".
- **Don't force blind spots:** If input is thin, return fewer insights and list missing information.
- **Perspectives labelling:** All simulated viewpoints are labelled **"Simulated viewpoint — not professional advice."**
- **Security:** User text is untrusted (prompt-injection defence). API key stays on the server only.
- **Demo Mode distinction:** Live AI and Demo are always clearly distinguished. **Demo output is never presented as live Gemini output.**
- **No fabricated statistics:** No fake dashboard statistics, history, or charts anywhere.

---

## 2. RECRUITER UNDERSTANDING LAYER

1. **Proof chips under hero headline:** `Real Gemini AI` · `Never decides for you` · `Saved privately in your browser` · `Tested`.
2. **"What's inside" section on landing page:** Map of 6 core capabilities with direct links to demo views.
3. **"Take the 60-second tour" button:** Guided tour with 6 coach-mark steps over demo analysis.
4. **About / How It Works page (`/app/about`):** Product story, interactive SVG architecture diagram, Gemini API breakdown table, safety design guardrails, engineering tech stack & test summary.
5. **Footer on app pages:** "Built with React, TypeScript, Express and Google Gemini" + GitHub link.
6. **Comprehensive README:** 3-step setup, architecture diagram, design decisions, and safety guarantees.

---

## 3. CORE CAPABILITIES

1. **One-Click Interactive Demo:** Student 6-month internship case study works offline with no API key.
2. **Visual Design System:** Burnt orange `#F2A36D`, Ivory `#D8D0C2`, Dark background `#101214`, Hairline borders `#2c3236`, Lucide React icons, Cinematic `<Eclipse />` component.
3. **Quick New Analysis (`/app/new-analysis`):** Only 1 required field, auto-generated title, optional priority chips, pre-built templates.
4. **Analysis Results (`/app/analysis/:id`):** Executive summary, Decision DNA, 3 top blind spots, Risk Matrix (3x3 qualitative grid), 5 critical questions, PDF export.
5. **Perspective Lab (`/app/perspective-lab`):** 5 Simulated viewpoints (Recruiter, Mentor, Financial, Family, Future Self) with side-by-side comparison mode.
6. **What-If Simulator (`/app/what-if`):** Dynamic scenario stress-testing with risk shifts and broken assumption alerts.
7. **Challenge Your Thinking (`/app/challenge`):** Interactive Socratic sparring partner pushing back on logic.
8. **Decision Journal (`/app/journal`):** Long-term decision reflection tracking and past choice analysis.
