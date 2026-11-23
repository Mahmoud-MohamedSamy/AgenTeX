# TIA Assistant — Test Plan (CRM + Desk)

**Status:** Draft for review, 23 Nov 2026 · **Step 1 of 4** (plan → spec → run → report)
**Environment:** NDC-Staging, `staging-crm.taviportal.com` and `staging-desk.taviportal.com`
**Compared with:** Zoho Zia (Zoho CRM and Zoho Desk)
**Plane:** read only. Nothing is filed unless you ask. Bugs are drafted in the run folder.

---

## 1. What TIA is (from the build, 23 Nov)

There is **no PRD for TIA in Plane.** The search for "TIA", "assistant", "AI assistant" and "copilot" found nothing.
The nearest items are NDC-2004 ("AI help for agents", Phase 4) and NDC-2947 (Desk ticket AI tools return 404).
Everything below comes from the live front-end code and the English text files of both apps.

TIA (shown as **"Tia"**) is a **staff assistant**, not a customer bot. It has two parts.

**A. Chat panel (CRM and Desk, same code)**
- An **"Ask Tia" launcher** opens a panel. The panel can be dragged and minimised, and its position is saved per app.
- It shows a welcome message, a disclaimer ("only sees what you can see, and can make mistakes") and suggested questions for each app:
  - CRM: pipeline, follow-ups.
  - Desk: open tickets, team this week.
  - Both: summarise this record or ticket, draft a private comment.
- Answers are **streamed**. You can **Stop**, **Try again**, and see **"Records this answer used"** (references).
- **Past chats:** list, rename, delete (with confirm), load older messages, new chat.
- **"What Tia can see"** shows the apps, the modules it can read, the tools it may use, and the setup areas it may help with.
- **Action cards** ("Needs your confirmation") come in 10 kinds:
  - create record, update record, add note
  - knowledge base draft, private ticket comment
  - workflow rule, blueprint
  - run action, setup change, other
- Each card has **Confirm / Cancel**, an expiry time and a note that automation may run after the change.
- A card ends as **done**, **failed**, **unknown** or **cancelled**. It can also show **"lost on the way"**, and then TIA checks again what happened.
- About **35 error states**, for example:
  - no credits, rate limit, daily, monthly and workspace limit
  - not in audience, not in this app, not set up, switched off
  - busy in another tab, expired or already handled
  - stream cut, AI provider down, safety block, language not allowed, too many steps
  - session ended, offline
- API: `/agents/tia/status`, `/turn/stream` (server-sent events), `/turns/{id}` with `/cancel`, `/conversations` (list, rename, delete, messages), `/capabilities`, and `/actions/{id}` with `/confirm` and `/reject`.

**B. TIA Setup page (Settings → Integrations → Tia, in both apps)**
- **Lifecycle:** Create Tia → Edit → Save (as a draft) → Deploy or Deploy changes → Deactivate (past chats are kept) → Delete (Recycle Bin, can be restored for 60 days).
- **Deploy is blocked** when:
  - no tool is chosen
  - write tools are on but no modules are chosen
  - run-action is on but no actions are chosen
- **Tia switch** is workspace-wide and separate from the customer-agent switch. It is also under CRM → Settings → AI Features. Changing it needs "Manage AI policy". If two people save at the same time, the page shows a conflict message.
- **Apps:** which apps Tia appears in (CRM, Desk, Omnichannel, Analytics). At least one must be ticked.
- **Who can use Tia:**
  - "Admins only" is the default, through the "Chat with Tia" profile permission.
  - Or "Only these profiles and users", with a maximum number kept and a warning when nobody is chosen.
- **Tools:** 29 tools in three groups (Reads / Proposes changes / Setup). There is a default set.
- **Setup areas:** per area, "Explain" and/or "Propose changes". Areas are grouped CRM, Desk, Omnichannel, Analytics, Shared. Proposals are saved switched off.
- **Topics:** allowed and never-allowed lists, one per line. The lists have a maximum size and a character limit. The page says topic rules are "strong but not absolute".
- **Credits:**
  - per-user daily credit limit
  - workspace daily and monthly allowance, with a maximum and a monthly-below-daily warning
  - **Stronger model** step limits, per person and per workspace, from 0 to max
- **Reports card:** "Tia sees reports exactly as the person asking does". It links to Report access.
- Leave-page guard. Save conflict ("Someone else changed Tia's settings…"). Read-only views for people without permission.
- **Permissions used:**
  - Manage AI agents (`agentManage`)
  - Manage AI policy (`aiPolicyManage`)
  - Chat with Tia
  - Manage report access (`reportingDataAccessManage`)
  - Manage custom actions (`customActionManage`)
  - Manage Agent Studio / Manage profiles
- API: `/agents`, `/agents/tools`, `/agents/modules`, `/agents/custom-actions`, `/agents/tia-setup-areas`, `/agents/runtime-settings` (+ `/tia-strong-steps`), `/agents/runtime-status`, `/ai/policy`, `/ai/credits/wallet`, `/billing/packs`, `/settings/security/report-access`.

**Languages:** English and Arabic text files exist; French returns 404. Arabic means right-to-left (RTL) layout must be tested.

---

## 2. Scope

**In scope:** the chat panel and the setup page in **CRM and Desk**, the API behind them, permissions, credits and limits, data scope, proposed actions end to end, and parity with Zoho Zia.

**Out of scope for this cycle:**
- Tia inside Omnichannel and Analytics. One check only: the "Apps" setting hides or shows Tia there.
- Customer-facing AI agents and chatbots.
- Desk ticket AI buttons (summary, triage, reply suggestions). These are tracked separately in NDC-2947.
- Mobile apps. No Tia code was looked for in them.

---

## 3. Test groups and estimated size

| Group | Area | What we check | Est. cases |
|---|---|---|---|
| **A** | Access and permissions | Launcher shown or hidden per profile ("Chat with Tia"), audience modes, setup page for Manage AI agents vs others, read-only views, direct URL and API without permission, other tenant | 22 |
| **B** | Setup lifecycle | Create, edit, save as draft, deploy, "changes not live" banner, deploy-blocked rules, deactivate (chats kept), delete → Recycle Bin → restore, leave guard, two-tab save conflict | 20 |
| **C** | Switch and apps | Tia switch on/off (CRM AI Features and the setup page agree), launcher appears on the next app open, Apps card (CRM only / Desk only / none blocked), "not in this app" message | 12 |
| **D** | Audience | Admins only, chosen profiles and users, nobody chosen, maximum number kept, custom admin profile without permission | 10 |
| **E** | Tools and setup areas | Each tool on/off changes what Tia does and what "What Tia can see" lists, default set, Explain vs Propose per area, write modules and custom actions lists | 18 |
| **F** | Topics | Allowed-only list, never list, max size and character limit, refusal wording; not absolute, so results are recorded, not hard-failed, except for a data leak | 8 |
| **G** | Credits and limits | Per-user daily limit (empty / 0 / n), workspace daily and monthly allowance, max value, monthly below daily, stronger-model steps, no-credits screen, wallet shown (rate limit by request burst only) | 18 |
| **H** | Chat panel UI | Launcher, open/close/minimise, drag and saved position per app, welcome, disclaimer, suggestions per app and page, streaming, Stop, Try again, references, past chats (list, rename, delete, load older, new chat), "chat no longer exists" | 26 |
| **I** | Answers — read tools | **CRM:** search, list/count/read records, describe module, run report, pipeline and follow-ups. **Desk:** open tickets, read ticket thread, team performance, user activity, explain assignment, read blueprint, product guide. Each answer checked against the real data | 30 |
| **J** | Proposed actions | Every card kind: create/update record and add note (CRM), private comment and KB draft (Desk), workflow and blueprint (saved off), run action, setup change. Confirm, Cancel, expiry, already handled, outcome check, automation note, audit log entry | 24 |
| **K** | Data scope and security | Only sees what the user sees (restricted role, department, field permission, report access), cross-tenant, guessing conversation or action IDs, prompt injection from record and ticket text, HTML/XSS in answers and references, safety block, API without session, CORS | 22 |
| **L** | Errors and resilience | Offline, session expired, stream cut, busy in two tabs or apps, duplicate send, timeout, provider down (as reachable), invalid or too-long message (200-character title limit and others) | 14 |
| **M** | i18n, RTL, accessibility | Arabic interface and Arabic questions, "language not allowed", keyboard only, screen-reader announcer, focus order, contrast, mobile width | 12 |
| **N** | Performance (run alone) | Time to first streamed text, time to full answer, history with many chats, many messages | 5 |
| **O** | Cross-module | Confirmed change fires workflow rules, KB draft visible in Desk KB, comment visible on ticket, record in CRM list, Recycle Bin restore, audit log | 8 |
| **E2E** | Journeys | (1) Admin sets up and deploys, agent asks and confirms a change. (2) CRM sales user end to end. (3) Desk agent end to end. (4) Negative recovery: credits run out → admin raises the limit → user continues | 4 |
| **Z** | Parity with Zoho Zia | One row per gap (preliminary list in §5) | ~22 |
| | **Total** | | **≈ 275** |

---

## 4. Accounts and data needed

- **Owner** on NDC-Staging: setup, switch, policy and credits.
- **Admin profile user:** has "Chat with Tia" by default.
- **Standard agent without "Chat with Tia":** for the negative access cases.
- **Agent with "Chat with Tia" but restricted data access:** one department in Desk, a limited role or profile in CRM, and one hidden field. This is the key user for the "only sees what you can see" tests.
- **Second tenant** (Anyware) for cross-tenant API checks.
- **Test data** uses the `QA TIA ` prefix: a few CRM leads, contacts and deals, and Desk tickets with known values, so answers can be checked against them.
- **Baseline:** before any write, take a GET of `/agents`, `/ai/policy`, `/agents/runtime-settings`, the wallet and the profile permissions. The run ends with a diff against it.

---

## 5. Zoho Zia comparison (first pass; refined in the spec)

The full research is in `zia-inventory.md`. The two products are shaped differently:
- **Zia in CRM** is a chat assistant ("Ask Zia").
- **Zia in Desk** has no general chat. It is buttons inside the ticket, plus Answer Bot and Zia Actions.

So in Desk, TIA's general chat is **more** than Zia offers. Extras are not bugs.

**Likely gaps (to confirm during the run)**

CRM:
- An answer cannot be turned into a chart and added to a dashboard.
- No report co-creation in the chat.
- No "show how this was worked out" view.
- No scheduled (recurring) questions.
- Ask cannot be opened from global search ("/").
- No like/dislike feedback on answers.
- No voice input.
- No Record Assistant button on the record (TIA uses a suggested question instead).
- No email or note drafting with tone and length options in the composer.
- No choice of AI model or own provider key.
- No on/off switch per AI feature.
- No per-profile permission per AI feature.

Desk:
- Answer Bot (a customer bot from the knowledge base) is not part of TIA.
- No reply assistance or writing assistance in the reply editor (overlaps NDC-2947).
- No field prediction.
- No AI steps in workflow rules (Zia Actions).
- No hiding of personal data before it is sent to the AI.
- No per-department AI feature preferences.

**TAVI extras (note, do not file):**
- one assistant across apps
- proposed changes with confirmation
- workflow, blueprint and setup proposals
- "explain an assignment"
- credit caps per user and per workspace
- topic rules
- "What Tia can see"

---

## 6. How the run will work

- **Order:**
  1. Baseline.
  2. A, B, C, D, E, F, G (setup changes, **one at a time**, because they affect the whole workspace).
  3. H, I, J, K, L, M, O.
  4. N alone.
  5. E2E.
  6. Z.
  7. Restore and diff against the baseline.
- **Method:**
  - API first for setup and access.
  - Real browser for the panel, streaming, cards, RTL and accessibility.
  - Each account signs in once per run.
  - Answers in group I are compared with an API or UI lookup of the same data.
- **AI answers vary,** so a case passes on **facts and behaviour** (right numbers, right records, refuses what it must, nothing leaks), not on exact wording. Wording problems are noted, not failed.
- **Evidence:**
  - Screenshots for every failed case, side by side with Zoho where it helps.
  - Lengths are reported, never token values.
- **Output:**
  - Run folder `executions/execu_2026-11-2x_tia-assistant/`
  - Bug drafts in `bug-drafts.md` (**not filed**)
  - Full HTML execution report (step 4)

---

## 7. Risks and things that may block us

- **AI credits are used up by testing.** The no-credits and limit cases set low caps instead of draining the wallet.
- **Current state is unknown:** Tia may not be created or deployed yet, the switch may be off, or the workspace may have no credits. The first run step checks this; if it is not ready, those groups are marked **Blocked**.
- **Confirming actions creates real data,** and automation may then send emails. Only `QA TIA` records and test contacts are used, and they are cleaned up afterwards.
- **"Provider down" and "safety block"** may not be reachable on purpose. They are marked **Inconclusive**, not Fail.
- **The owner's browser sign-in failed earlier today** on another run. If it still fails, UI cases use the admin user, and owner-only steps go through the API.

---

## 8. Questions for you before the spec

1. **Credits:** is it OK to spend AI credits on NDC-Staging, about 300–500 questions in total?
2. **Write actions:** is it OK to confirm real changes (create and update records, notes, comments, KB drafts, workflow rules and blueprints saved off), all cleaned up afterwards?
3. **Restricted user:** do we already have an agent with limited access I should use, or should I create one with the `QA TIA` prefix?
4. **NDC-2947** (Desk ticket AI tools): keep it out of scope as planned, or add a short regression check?
