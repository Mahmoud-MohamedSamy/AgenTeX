# Retest spec: TIA Assistant (Tia), part 2, CRM + Desk

Written 24 Nov 2026. It follows the run of 23–24 Nov:
- Spec: `spec-tia-assistant.md`
- Report: https://claude.ai/artifact/59X6Vi1tLWAeetA81a5iSF
- Bugs: NDC-3244 – 3247 and NDC-3249 – 3255

It covers two groups:
- **Group N:** cases that were never covered, mainly CRM in the browser and the 5 cases with no result.
- **Group C:** cases that changed after the run (NDC-3246, and whether NDC-3244 and NDC-3254 share a cause).

The case ids keep their original spec ids where there is one, so results join the first run.

---

## 0. How to run

**Order**
1. P preflight.
2. Group N1, the CRM browser pass. It runs first because everything else in CRM depends on a working sign-in.
3. Group N2, the 5 cases with no result.
4. Group C.
5. R restore.

**Run serially**
- N2-02 (B-09) and N2-03 (F-08) open Tia's setup page.
- N2-02 changes a draft and must be **discarded, never deployed**.
- No other session may change Tia's settings while those cases run.

**Results**
- Use the same words as the first run: Pass, Fail, Finding, Blocked or Inconclusive.
- Questions to Tia are asked **up to 2 times**. Two wrong answers make a Fail; one wrong and one right make a Finding ("unstable").
- A case passes on facts and behaviour, never on exact wording.

**Evidence**
- Take a screenshot for every Fail and Finding. If it confirms a filed bug, put the ticket number in its name, e.g. `C-01-NDC-3246.png`.

**Sign-in**
- Each account signs in **once** and the session is saved; never load one saved session into two browsers.
- Stop on HTTP 429.
- NDC-Staging only.

**Output**
- Write results to `executions/execu_2026-11-24_tia-retest/out/results.jsonl`, the same shape as the first run.
- Record any data created in `ledger.md`.
- Nothing goes to Plane without the user's go.

---

## 1. Preconditions

### 1.1 Accounts

| Label | Account | Use |
|---|---|---|
| OWN | ndc-staging-owner | CRM browser pass (N1), setup page (N2), owner comparison (C-02) |
| CRA | Mahmoud Mohamed (CRM Admin + Desk Admin) | CRM cards in the browser, if his sign-in works (it looped at the organisation picker on 23 Nov) |
| RST | Customer Experience Specialists 2 (Desk Agent, no CRM app) | C-01 and C-02 in Desk; needs "Chat with Tia" again (see P-03) |
| A5 | A user whose only CRM profile is **CRM Admin**, if one exists | N2-01 (A-05); otherwise read the profile |

### 1.2 The CRM browser sign-in (the main blocker)

On 23 Nov, CRA's sign-in kept returning to the organisation picker, and OWN's saved CRM session had expired. Try these in order and stop at the first that works:
1. **OWN signs in through the CRM sign-in form once** (this worked for Desk on 23 Nov) and saves the session as `staging-crm.taviportal.com_own.json`.
2. CRA signs in and picks the "Wonder Travel" organisation; if the picker shows again, choose it once more and wait for the CRM nav.
3. If both fail, mark Group N1 **Blocked**, attach a screenshot of the picker loop, and stop N1 rather than retrying in a loop.

### 1.3 Baseline (taken in P-02; R must match it)
- Tia's definition and `has_undeployed_changes:false`.
- The AI policy, the runtime settings, and the permissions of the Desk Agent profile.

### 1.4 Test data
- Prefix all test data `QA TIA RT`.
- **CRM:** 1 lead "QA TIA RT Lead" with a Name value, and 1 deal "QA TIA RT Deal 1500" (Qualification).
- **Desk:** 1 ticket "QA TIA RT T1" in QA AO Dept A.
- Every record and chat created is deleted in R.

---

## 2. P. Preflight (serial)

| Id | Step | Expected |
|---|---|---|
| P-01 | GET `/agents/tia/status` as OWN in CRM and Desk | `available:true` in both |
| P-02 | Save the baseline in §1.3 to `out/baseline.json` | saved; `has_undeployed_changes:false` |
| P-03 `[data]` | Add "Chat with Tia" (`ai:tia:use`) to the Desk Agent profile again, and add RST to QA AO Dept A | RST can open Tia; R removes both |
| P-04 `[data]` | Create the test data in §1.4 | ids written to `ledger.md` |
| P-05 | CRM browser sign-in, as in §1.2 | a saved CRM session that opens `/settings` with the CRM nav |

---

## 3. Group N1: CRM in the browser (never covered)

These were checked in Desk on 23 Nov but not in CRM. Use the OWN CRM session unless the case says otherwise.

| Id | Original case | Test | Steps | Expected |
|---|---|---|---|---|
| N1-01 | A-01 | Launcher in CRM | Open Home, a Leads list, a lead and Settings | the "Ask Tia" launcher shows on every page |
| N1-02 | B-01 | Setup page in CRM | Open Settings → Integrations → Tia in CRM | the same agent and values as Desk (Deployed, version, apps, audience, caps); Edit, Deploy changes (disabled), Deactivate |
| N1-03 | B-01b | Menu entries in CRM | Look at the Settings menu | note whether CRM also shows both "Tia Assistant" and "Tia" (Finding B-01b in Desk) |
| N1-04 | C-03 | Same switch in CRM AI Features | Open CRM → Settings → AI Features | the "Tia" toggle exists and matches the setup page (on). Do **not** change it |
| N1-05 | H-01, H-02 | Open, close, minimise | Click the launcher, Minimise, reopen, Close | focus starts in the input; the same chat comes back; the launcher returns |
| N1-06 | H-04 | Position saved per app | Drag the panel in CRM, reload, then open Desk | CRM keeps its position; Desk keeps its own |
| N1-07 | H-06, H-07, H-07b | Welcome and CRM suggestions | Start a new chat | "Hi, I'm Tia…" and the disclaimer; CRM suggestions include pipeline and follow-ups, plus "What can you help me with?" |
| N1-08 | H-08 | Suggestions on CRM pages | Open QA TIA RT Lead, then a report | "Summarise this record" on the lead; "Explain this report" on the report |
| N1-09 | H-09 `[credit]` | Click a CRM suggestion | Click "Summarise this record" on QA TIA RT Lead | a correct summary of the lead, with a reference chip that opens it |
| N1-10 | H-09 `[credit]` | The pipeline suggestion | Click the pipeline suggestion | an answer. If it shows "Missing required argument 'report_id'…", it confirms **NDC-3245**; note the ticket number |
| N1-11 | J-01 `[credit]` `[data]` | Create-record card | Ask "Create a lead QA TIA RT J01, company QA Co" | a card that needs confirmation, with kind Create, target Leads, field lines, expiry and the automation note; nothing created yet. Note whether lines show labels or keys (Finding J-01) |
| N1-12 | J-01 / J-02 `[data]` | Confirm in the browser | Press Confirm | "Done…"; the lead exists, owned by the person asking; the reference chip opens it |
| N1-13 | J-03 `[credit]` | Cancel in the browser | Ask for another lead, then press Cancel | "Cancelled. Nothing was changed."; no record |
| N1-14 | J-04 `[credit]` `[data]` | Update card | Ask "Change the lead source of QA TIA RT Lead to referral", then confirm | the card shows the change and the record is updated. Note whether it shows old → new (Finding J-04) |
| N1-15 | J-21 `[credit]` | Card after reload | Ask for a card, reload before confirming | the card is still there with Confirm, or its expiry is shown |
| N1-16 | M-01 | CRM panel in Arabic | Switch OWN to Arabic, open the panel and setup page in CRM; switch back to English afterwards | right-to-left layout with no English left; **switch back to English is verified** |
| N1-17 | L-05 `[credit]` | Busy across apps | Send a long question in CRM and, while it runs, one in Desk (same user, two tabs) | the second shows the busy message, or both answer; nothing hangs |
| N1-18 | M-06 | Keyboard focus in CRM | Tab into the panel with it open | note whether focus stays inside the dialog (Finding M-06 in Desk) |

---

## 4. Group N2: the 5 cases with no result

| Id | Original case | Test | Steps | Expected |
|---|---|---|---|---|
| N2-01 | A-05 | CRM Admin and "Chat with Tia" | Read the CRM Admin profile's permissions (`/iam/profiles`, `app_key=crm`). If an A5 user exists, sign in as A5 and look for the launcher | if CRM Admin lacks `ai:tia:use` while the setup page says "built-in Admin profiles come with it" → **Finding**; if it has it, Pass |
| N2-02 | B-09 `[serial]` | Run-action tool with no custom actions | Setup page → Edit → Tools: turn on "Propose running an action" (`tia_proposeRunAction`) with no custom actions chosen. **Do not deploy.** Press Discard | Deploy is disabled with "…choose which actions before you deploy.", or the tool cannot be turned on because no custom actions exist (record which). After Discard, `has_undeployed_changes:false` |
| N2-03 | F-08 | Topics help text | Setup page → Topics card | the text "Topic rules are checked by AI, so they are strong but not absolute…" is shown |
| N2-04 | M-04 `[credit]` | Arabic question about an English-named record | As OWN in CRM, in Arabic: "ما هي مرحلة الصفقة QA TIA RT Deal 1500؟" | an Arabic answer naming Qualification; the English name shows correctly inside the Arabic text (no reversed or broken characters) |
| N2-05 | M-12 | Setup page by keyboard | Tab through the setup page: Edit, Deploy, toggles, the audience picker, topics; open and close the Edit dialog | every control can be reached and used; the Edit dialog keeps focus inside and Esc closes it |

---

## 5. Group C: changed since the run

| Id | Ticket | Test | Steps | Expected |
|---|---|---|---|---|
| C-01 `[credit]` `[data]` | NDC-3246 | "Draft a private comment" from the suggestion button | As RST, open QA TIA RT T1 in Desk, open Ask Tia, click the suggestion **"Draft a private comment"** (do not type) | Tia offers text and shows the Private comment card **within 2 messages**. Confirm adds a private comment (`is_public:false`). If it takes more pushes or refuses → still failing, note the number of messages |
| C-02 `[credit]` | NDC-3246 | The typed path from the Jam | Same ticket: "draft a private comment on this ticket", "you suggest a private comment", "go ahead" | the card appears at "go ahead". If Tia again says "I cannot draft…", NDC-3246 still fails |
| C-03 `[credit]` | NDC-3244 / NDC-3254 | "How many open tickets do I have?" as an agent | As RST in Desk, click the suggested question; then ask "Count the tickets with status Open that I can see". Get the true count with the API (status Open, RST's departments) | record both answers against the true count. The 23 Nov result was the customer-bot reply, then 40 |
| C-04 `[credit]` | NDC-3254 | The same question as the Owner | As OWN in Desk, click the same suggestion; then ask "how many tickets are assigned to me". Get the true counts with the API | record both answers. 24 Nov Jam: "0 open tickets" with a "Conversations" (chat) card, then "you do not have access to the tickets module" |
| C-05 | NDC-3244 / NDC-3254 | Same cause or not | Compare C-03 and C-04, and read the turn status (`GET /agents/tia/turns/{id}`) for each answer | write one line for each ticket: still failing, fixed, or changed. If the Owner gets chat counts or "no access" and the agent gets the customer-bot reply, they look like separate causes, so keep both tickets. Say this is an inference |

---

## 6. R. Restore (serial)

| Id | Step | Expected |
|---|---|---|
| R-01 | Delete all `QA TIA RT` records and tickets, the comment from C-01 and C-02, and this run's Tia chats | none left in a search of each module |
| R-02 | Remove "Chat with Tia" from the Desk Agent profile, and remove RST from QA AO Dept A | both equal the baseline |
| R-03 | OWN's interface language is English in CRM and Desk | verified |
| R-04 | Final GET; compare with `out/baseline.json` | equal except for version numbers and the credit wallet |

---

## 7. Reporting

- The report has these parts:
  - totals per group;
  - each Fail and Finding with its screenshot;
  - for C-01 to C-05, one line per filed ticket: **still failing**, **fixed** or **changed**.
- Suggested Plane comments for NDC-3244, NDC-3246 and NDC-3254 are **drafted only**; nothing is posted without the user's go.
- Any new problem becomes a draft on the bug drafts page (https://claude.ai/artifact/ErwATaH6cg5xrxowjyCCmr) first.
- **If the CRM sign-in stays blocked:**
  - Group N1 is reported Blocked, with the picker-loop screenshot.
  - Groups N2 and C still run: N2-01, N2-02, N2-03 and N2-05 can use Desk's setup page, and N2-04 can use the API.

**Size:** 18 + 5 + 5 cases. About 25 questions to Tia. That is a small share of the first run, which used about 50 credits in total.
