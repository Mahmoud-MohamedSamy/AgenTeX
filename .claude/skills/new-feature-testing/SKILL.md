---
name: new-feature-testing
description: End-to-end QA intake for a newly implemented feature that clones a reference product (Zoho Desk, Zoho CRM, SalesIQ…) — find the feature's PRD in Plane, map what the current build really ships (bundle + live API + UI), research the reference product's documentation, produce a parity gap list and file it to Plane as ONE "missing functions" work item, then write a test spec that covers every test type and scenario (functional, edge, negative, data-class sweep, UI/i18n/RTL, UX/a11y, performance, security/permissions/API, cross-module integration, compatibility, E2E journeys) with the gaps kept as a runnable "Group Z". Use when the user says a feature was implemented "like Zoho", asks "what are the gaps / what's not implemented yet", asks for a gap ticket plus a spec for a new feature, or invokes /new-feature-testing. Always starts by asking the user which feature, app, reference product and output they want.
---

# New-Feature-Testing — gap analysis → one Plane ticket → full test spec

## Role
A feature has just been built as a clone of a reference product. You produce three things, in this order:
1. **A gap list** — what the reference product does that the build does not, grounded in evidence from both sides.
2. **One Plane work item** holding that list (not one ticket per gap).
3. **A test spec** covering every test type for what *is* built, plus a Group Z for what is not.

Read-only until the spec is written. Gap analysis and spec writing do **not** change the tenant; never save
settings, send emails or create records during intake. (Functional testing against the spec is a separate run.)

Everything in `CLAUDE.md` still applies — credentials, evidence redaction, ticket house style, the false-positive
checklist, parallel-agent guardrails. This skill adds the intake workflow on top.

## Step 0 — ASK FIRST, every time the skill is called
Before any search, bundle download or Plane call, ask the user with **AskUserQuestion** (one call, up to 4
questions). Do this even if the invocation already named a feature — confirm it rather than assume.

1. **Feature** (header "Feature") — "Which feature do you want the missing list and spec for?"
   Offer 2–3 likely candidates as options (recent Desk/CRM PRDs in Plane Backlog that have no gap item yet, or the
   name the user typed); the user can type any other feature via "Other".
2. **App** (header "App") — Desk · CRM · Omnichannel · Analytics (Vault via "Other").
3. **Reference** (header "Compare with") — the Zoho product to compare against, e.g. Zoho Desk (Recommended for
   Desk) · Zoho CRM · Zoho SalesIQ.
4. **Output** (header "Output") — Missing list + Plane ticket + spec (Recommended) · Missing list + Plane ticket
   only · Spec only.

Optional follow-up only if still unclear: the **PRD ticket id** (e.g. NDC-1670) and the exact **page/URL** of the
feature. Then run only the steps the chosen output needs:
- Missing list + ticket → Steps 1–5 and 7. Spec only → Steps 1, 2, 6 and 7. All → Steps 1–7.

The Plane filing fields (assignee, state, priority, module, sprint) are asked separately at Step 5, every run.

## Step 1 — Find the PRD and prior tickets (Plane, NDC)
```
workitem list project=NDC pql='text ~ "<feature name>"'
workitem list project=NDC pql='text ~ "<key noun, e.g. rating / widget>"'
```
- The feature's PRD is usually a Backlog item named after the feature (e.g. NDC-1670 "Customer Happiness Rating",
  NDC-1666 "Web Forms"). Read it fully — goals, **non-goals**, requirements, ACs, phases, dependencies.
- Also find earlier parity items (e.g. NDC-1779…1785 per-area gaps, NDC-1852 Web Forms gaps) — a gap already
  filed there is referenced, not re-filed. See memory `search-plane-before-filing`.
- A gap that the PRD lists as a **non-goal** or a later **phase** is still listed, but labelled as such so it
  can be triaged ("deferred by NDC-xxxx Phase 3", "non-goal in NDC-xxxx").

## Step 2 — Map what the build ships (authoritative, fast)
Work in `scratchpad/<app>/<feature><MMDD>/`. Use your **own driver port** — check the port first
(`curl 127.0.0.1:<port>/drain`); another session may own the usual one (Desk driver 8898 → copy it to 8897).
1. **Bundle scan** (no login needed):
   - `curl https://<host>/<any route>` → the `index-*.js` name; download it and every `assets/*.js` it lists.
   - `grep -li '<feature keyword>' chunks/*.js` → the feature's pages, hooks and API paths
     (`r.get('/desk/…')`), permission keys (`desk:<x>:manage`), routes, query keys.
   - Which consumers use each hook — an API hook no page imports means the **UI for it does not exist**.
   - `status:\`in-development\`` and `InDevelopmentTab/Page` markers → surfaces that are placeholders.
   - Locale file (`/locales/en/<app>.json`) → every UI string; strings saying "not available yet" / "needs X"
     are the build admitting a gap.
2. **Live API**, logged in as owner (atomic login; wait for `input[type=password]` before filling):
   GET every discovered endpoint; record the full settings object as the **baseline**, read-only limits
   (`*_max`, `*_min`, `*_configured`), and probe plausible-but-absent routes (`/stats`, `/reports`, `/ratings`)
   — a 404 is evidence the capability is missing server-side too.
3. **UI**: open each page, capture text + one screenshot; note environment blockers (e.g. "public page not
   configured") — these become a precondition in the spec, **not** a gap in the product.

## Step 3 — Research the reference product
Spawn one `general-purpose` agent (background) with WebSearch/WebFetch to build an exhaustive, itemised
inventory from the vendor's official help docs, API docs and edition/pricing pages: every setting with options
and defaults, mechanics and limits, where the data surfaces (record views, list views, reports, dashboards,
profiles), automation hooks (workflow, notifications, webhooks), channels, API, plan availability — each with a
source URL, inferred items marked. Do Step 2 while it runs; never duplicate its searches.

## Step 4 — Build the gap list
Compare item by item: reference inventory × PRD × build map. For each reference capability decide:
**Built** · **Partly built** (say exactly what is missing) · **Missing** · **Not a gap** (the reference doesn't do it
either, or the build does it another way — say so, it prevents noise). Group by area (Configuration, Customer-facing
page, Where results appear, Automation/notifications, Reporting, Channels, API, i18n). For every gap state the
Zoho behaviour, what the build does, and the PRD position (required P0 / later phase / non-goal / not mentioned).
Separate **"Could not be confirmed"** (blocked by environment or no data) from real gaps.

## Step 5 — File ONE Plane item
1. **Ask every run** (AskUserQuestion): assignee, state, priority, module, sprint — suggestions, not defaults.
   Confirm the sprint is still open (`cycle list status=incomplete`); a completed cycle refuses items.
2. `workitem create` in NDC, written for the **dev team in simple words** — follow the template and the
   writing rules below exactly (this is the approved style, NDC-1854). `start_date` today; state set explicitly
   (the project default is Cancelled). Pass `description_html` raw, never escaped.
3. Add to the module (`module manage_workitems`) and sprint (`cycle manage_workitems`); read both back.
4. Comment on the PRD linking the gap item (relations are 402 on this workspace).

### Gap ticket — writing rules (approved by the user, 29 Sep 2026)
- **Title:** `<Feature>: features Zoho <Product> has that <App> is missing` — no "BUG", no id prefix.
- **Short sentences, plain words.** One line per gap. Say *what is missing*, then *what the app shows today* only
  if it helps, then the PRD phase. Do not explain how Zoho works in paragraphs.
- Start each gap with the thing itself ("Reopen the ticket when…", "Happiness tab on contacts…"), not "Zoho has…".
- Numbering runs across groups (`<ol start="10">`), so the dev team can say "item 13".
- Name API routes and fields only where a dev needs them (e.g. the endpoint that exists with no screen, the 404s).
- **Already done**, **Could not be checked** and **Additional notes** are `<ul>` bullet lists — one capability,
  blocker or note per bullet — never run-on paragraphs (user request, 1 Oct 2026, NDC-1869). Only the "Missing — …"
  groups are numbered `<ol>` lists.
- Each "Could not be checked" bullet ends with its own **clear request** ("Please configure X so we can test Y").
- Possible bugs go in Additional notes, one bullet each, starting "Possible bug to check separately:" — never as gaps.
- House style still applies: bold-paragraph headers, no tables, no `<h3>`.

### Gap ticket — template (fill in; keep the shape)
```html
<p><strong>Summary</strong></p>
<p>We compared <App>'s new <Feature> feature with Zoho <Product>. This ticket lists what Zoho has and <App> does not
have yet. The feature spec is NDC-<PRD>; each item says which phase of NDC-<PRD> it belongs to, where it is mentioned there.</p>
<p><strong>Already done in <App></strong></p>
<ul><li><p><Short sentence per built capability.></p></li>
    <li><p><Next built capability.></p></li>
    <li><p><App> also has <extra beyond Zoho>, which Zoho does not have.</p></li></ul>
<p><strong>Missing — settings</strong></p>
<ol><li><Thing that is missing> (<options>). NDC-<PRD> Phase <n>.</li>
    <li><Thing>. Today <what the app shows>.</li></ol>
<p><strong>Missing — where <users> see <results></strong></p>
<ol start="<next>"><li>…</li></ol>
<p><strong>Missing — automation</strong></p>
<ol start="<next>"><li>…</li></ol>
<p><strong>Missing — channels</strong></p>
<ol start="<next>"><li>…</li></ol>
<p><strong>Missing — API</strong></p>
<ol start="<next>"><li><What the API cannot do>. Today only <what exists>; <routes> return 404.</li></ol>
<p><strong>Could not be checked</strong></p>
<ul><li><p><Blocker 1, quoting the on-screen message.> Please <action> so we can test <list>.</p></li>
    <li><p><Blocker 2.> Please <action> so we can test <list>.</p></li></ul>
<p><strong>Additional notes</strong></p>
<ul><li><p>Not gaps: <things Zoho doesn't do either / PRD non-goals>.</p></li>
    <li><p>Possible bug to check separately: <one sentence>.</p></li>
    <li><p>Possible bug to check separately: <one sentence>.</p></li>
    <li><p>Test spec: <App> Specs/spec-<app>-<feature>.md in the QA repository.</p></li>
    <li><p>Nothing was changed on the tenant (or say exactly what was, and that it was set back).</p></li></ul>
<p><strong>Environment</strong></p>
<p><host>, Chromium, <D Month YYYY>, admin account.</p>
```
Leave out a "Missing — …" group if it has no items. The full approved example is NDC-1854 for wording, and
NDC-1869 for the bullet-list sections (NDC-1854 still uses paragraphs there — follow NDC-1869). Read them with
`workitem retrieve_by_identifier` before writing a new one.

### PRD comment (one line, simple words)
*"The gaps between the current <App> build and Zoho <Product> <Feature> are listed in NDC-<gap> (<n> missing
functions, each mapped to its phase of this specification). <Blocker in one sentence, if any>."*

## Step 6 — Write the spec
Save as `<App> Specs/spec-<app>-<feature>.md` (e.g. `Desk Specs/spec-desk-customer-happiness.md`). Model it on
`Desk Specs/spec-desk-web-forms.md` and point to `Suit 1/_COMMON.md` for lenses and D1–D20. Required sections:
- **0 How to run** — group order, tags, which groups must run serially (anything writing tenant-wide config),
  which run exclusively (perf), what `[data]` rows must record.
- **1 Preconditions** — accounts, **baseline JSON** to restore from, environment **blockers** (and "mark
  Inconclusive, not Fail, if still blocked"), customer-side needs (real mailbox, allowed origin…), test-data
  prefix `QA `, cleanup, and anything that **cannot be deleted** once created.
- **2 Surface and contract** — admin API, public API, field register (kind + limits), page states and messages.
- **Groups A…L**, one per surface, every scenario tagged — cover *all* lenses:
  access/permissions (UI **and** API, direct URL, other tenant) · rendering & defaults · every setting with its
  D-classes (§5 of `_COMMON.md`) in UI and API · save/concurrency (double submit, stale two-tab write,
  partial body, read-only keys, session expiry, audit log) · the generated artefact (email/link/record) ·
  the customer-facing page (every state, every message, mobile, a11y, i18n/RTL) · where results appear ·
  changes after the fact (disable, expire, edit, delete, restore) · security (XSS, type confusion, enumeration
  🔒, data leakage, CORS, tenant isolation, auth bypass) · performance (exclusive) · cross-module · compatibility.
- **E2E journeys** — the real user stories chained end to end, including the negative-recovery journey.
- **Group Z** — one row per gap: how to test it and the expected result from the reference/PRD.
- **Traceability** — every PRD requirement → scenario ids. Any requirement with no scenario is a hole: fix it.
- **Reporting** — evidence redaction (report token *lengths*, never values), coverage gaps restated, revert
  proven by a final GET diff against the baseline.

## Step 7 — Close out
- Remove any placeholder in the spec (e.g. the gap ticket id).
- Update memory: one project memory for the feature (PRD id, gap item id, spec path, API surface, blockers).
- Report to the user in the same simple style: gap ticket id, the gaps as short grouped lines, spec path,
  blockers that stop functional testing.

## Worked example
Desk Customer Happiness, 29 Sep 2026: PRD **NDC-1670** → gap item **NDC-1854** "Customer Happiness: features Zoho
Desk has that Desk is missing" (23 one-line gaps in 5 groups, simple-words version approved by the user; Backlog,
Desk module, Sprint 01) → spec `Desk Specs/spec-desk-customer-happiness.md` (groups A–L, E2E, Z1–Z23,
traceability). Use it and `Desk Specs/spec-desk-web-forms.md` + NDC-1852 as the reference shape.

## Pitfalls seen doing this
- A hook exists but no page imports it → the API works and the UI is missing. Check consumers, not just existence.
- Environment flags (`public_page_configured:false`) make whole feature halves untestable — call it out as a
  blocker in the spec and the ticket's notes, not as a product gap.
- Hard-coded English strings in a public page are an i18n gap even when the admin UI is translated.
- A settings `PUT` without `If-Match`/row_version is a lost-update risk — include the two-tab case.
- Don't parallelise config writes; the settings object is tenant-wide.
- Plane: pass `description_html`/`comment_html` raw, never escaped (memory `plane-comment-html-must-be-raw`).
