// Builds report-progress.html: the LIVE progress report of the Desk automation-order run (8 Nov 2026 onward).
// One page to follow the run. Update the data blocks below after each step, then: node scripts/build-progress-report.js
const fs = require('fs'), path = require('path');
const D = path.join(__dirname, '..');
const UPDATED = '13 Nov 2026, 00:20 (Cairo)';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/`([^`]+)`/g, '<code>$1</code>');
const C = { PASS: 'ok', FAIL: 'bad', BUG: 'bad', FINDING: 'warn', PARTIAL: 'warn', INCONCLUSIVE: 'warn', BLOCKED: 'grey', SKIPPED: 'grey', MOVED: 'grey', 'API ONLY': 'grey', 'NOT RUN': 'info', Done: 'ok', 'In progress': 'warn', 'Not started': 'info', Filed: 'ok', Partial: 'warn' };
const pill = (t, c) => `<span class="pill ${c || C[t] || 'grey'}">${esc(t)}</span>`;
const table = (head, rows, cls = '') => `<div class="tw"><table class="${cls}"><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.join('')}</table></div>`;

// ---------- Latest activity (newest first) ----------
const log = [
  ['13 Nov 00:20', 'Filed NDC-2997 (E2E-1 role round robin, High), NDC-2998 (date trigger on non-date field, Low), NDC-2999 (owner target not checked, Medium) — Bug, Desk, Sprint 15, annotated images; read back OK.'],
  ['13 Nov 00:10', 'Ran all remaining: A10 + O5 cross-tenant (Anyware) PASS, D6 cannot occur (module made + deleted), I10 workflow wins, O12 50/50, E2E-2/4/5 PASS, E2E-1 FAIL (role round robin = I8), E2E-3 waits on Gmail, Z24/Z25/Z27 missing. Tag audit: only P11 and J5-wall were affected. Everything reverted.'],
  ['12 Nov 19:20', 'Remaining A4 rows run (your OK to change and revert): PASS P22/Z23, E15, F10, G9, A2, E5, F21, J6, P23/Z26, O13; FINDING C9, M5, M7, O7; NEW FAIL P11 (Execution Time condition never matches); O5 partial. Waiting on you: I9, I29 (rate ticket #3194), J5 (shift choice), A10 (second tenant). Business hours and the test agent profile reverted; Customer Happiness ON until you rate.'],
  ['12 Nov 23:20', 'Filed NDC-2973 (I9, Owner Assignment ignores suspended / non-member agents) with annotated image. P11 rechecked: PASS — the earlier FAIL was my test error (subject guard did not match), so it was not filed. I29 PASS, J5 PASS.'],
  ['12 Nov 19:30', 'Your OK: filed 13 Workflow Rules bugs NDC-2948 … NDC-2968 (Bug, Desk, Sprint 15, labels Workflow Rules + Automation Execution Order, NDC-2811 assignees), each with one annotated image (TAVI vs Zoho where Zoho has the feature). Rechecked first on staging: D-07 (C3 history) dropped — TAVI history now shows "Status was updated Open → Closed" and "Workflow rule ran … by workflow rule"; Z18 narrowed to Field Update (two Tasks now allowed); B-2 narrowed to the API (the editor hides Created By). Evidence data deleted; rules back to 50.'],
  ['12 Nov 18:40', 'C3 checked in Zoho (your OK): a workflow Field Update that closes a ticket sends NO closed mail in Zoho either (#185 on Create, #186 on Edit); an agent close does (#184). So the missing mail is not a bug. Only difference: Zoho history shows "Ticket was updated through a Workflow Rule … Status changed from Open to Closed"; TAVI shows only "Workflow rule ran". Zoho cleaned, notification back off. New report: report-workflow-findings.html.'],
  ['12 Nov 17:30', 'All 22 workflow bug items checked against live Zoho Desk (techsolutionsegypt, nothing saved) and Zoho help: 6 differ from Zoho (expected result now = Zoho), 7 are real bugs Zoho has nothing to compare with, 8 are TAVI-only features, B-5 withdrawn (Zoho does the same). Bugs report report-workflow-bugs.html updated.'],
  ['12 Nov 16:10', 'Your OK: deleted the 3 inactive Java leftovers (QA 2205 / 2206). Workflow rules now equal the 11 Nov baseline: 50 rules, 8 saved actions, nothing extra.'],
  ['12 Nov 16:00', 'Your OK: deleted 57 "QA AO WF" rules (55 were active) and 1 saved action; 53 rules left, none active. E2E-6 PASS: baseline intact; 3 inactive Java leftovers listed for you.'],
  ['12 Nov 15:40', 'Screen run of the A4 rows finished. Rules, saved actions and tickets made today deleted; 11 Nov user-round settings restored (happiness, Dept A private).'],
  ['12 Nov 15:30', 'NEW FAIL F18: ${recordId} / ${moduleId} render empty. NEW FINDING I30: happiness email Succeeded while ratings are off. I19, I20, I21 PASS. B-3 now fixed (Happiness Email in the library).'],
  ['12 Nov 14:30', 'NEW FAIL M6: Execution History shows rule and record as raw ids, record not a link. NEW FAIL G5: a save silently overwrites a change made meanwhile. G6 PASS.'],
  ['12 Nov 13:40', 'NEW FAIL G4: a double-click on Save & Activate creates 2 identical rules. Editor rows D, E, F mostly PASS; findings on the pattern (E9), raw server messages (F9, F12), length limits only at save (C4, C7).'],
  ['12 Nov 13:00', 'Staging gave 502 / time-outs for a few minutes; screen runs retried.'],
  ['12 Nov 12:45', 'List rows: B10 PASS, B11 finding (raw id toast), B2 finding (internal field names in the Trigger column).'],
  ['12 Nov 12:20', 'A4 API rows: 24 more run. NEW FAIL O4 (security): a webhook header value with a line break sends an extra header (webhook.site got "Injected: 1"). NEW FINDING L1: Test rule ignores the sample record and only uses typed values. Test data from today deleted.'],
  ['12 Nov 12:00', 'Java API rows A9, A11, B13, E11, G7, K3, K5, K9 PASS (skipped on 11 Nov by the Edge timeout).'],
  ['12 Nov 11:50', 'I4 rechecked: PASS (address part updated, other parts kept). The 11 Nov 500 was staging: at 11:45 the metadata service answered 503 "temporarily unavailable". QA layout removed again, Standard unchanged.'],
  ['12 Nov 11:40', 'SL-40 day-before notice PASS: Test User 1 bell "Contract … expires tomorrow" at 00:00 UTC. Contract and account deleted.'],
  ['12 Nov 11:30', 'Moved to the new PC: API helper now finds its folders itself; Java run needs -Dcredentials.file=…/TAVI Desk Credentials.csv.'],
  ['12 Nov', 'Progress report rebuilt as one live page (this file).'],
  ['11–12 Nov', 'A4 Java suite rest: WorkflowHijTest 19 pass; J1 rerun alone PASS; H13, I3 PASS on a temporary QA layout; I4 FAIL (500), needs a recheck.'],
  ['11–12 Nov', 'A4 Group A permissions (A3–A8) PASS; O3 SSRF PASS; O1 FINDING: script in an Add Comment body runs in the rule editor.'],
  ['11 Nov', 'A4 user round (portal reply, ratings, mails): P1, P5, I28, P15, P16, I18 PASS. C3 FINDING: a ticket closed by a workflow Field Update sends no closed mail.'],
  ['11 Nov', 'A4 Group P (features built since 12 Oct) by API: 21 PASS, P18 finding, P22 blocked (custom action needs an OpenAPI spec), P23 reassign inconclusive.'],
  ['11 Nov', 'B14: the 50-rule limit is gone (rules #51 and #52 saved).'],
  ['11 Nov', 'NT-06, NT-10, NT-19, NT-30, SL-18, SL-44 PASS. NDC-2864 filed (High) and corrected.'],
  ['10 Nov', 'A1–A3 finished (C-08, I-04, F-08 PASS). Filed NDC-2839, 2841, 2850–2853.'],
  ['9 Nov', 'Missing list filed as NDC-2829 (15 gaps). NDC-2825, 2826 filed.'],
  ['8 Nov', 'Plan, missing list, specs; SLA and Notifications run started.']];

// ---------- Plan status ----------
const plan = [
  ['A1–A3', 'Skills, Direct assignment, Round robin', 'Done', '~115 cases. All run. NDC-2824 still fails (you said to set it aside).'],
  ['A4', 'Workflow (274 cases)', 'Done', 'All 274 executed (12–13 Nov): 229 pass, 25 fail, 18 findings, 2 partial (E2E-3 Gmail text check, plus one earlier). Tenant reverted.'],
  ['A5', 'SLA (67 cases)', 'Done', 'All 67 run. SL-40 day-before notice PASS (12 Nov).'],
  ['A6', 'Blueprint', 'Not started', 'Recheck current state of NDC-2755..2788 too.'],
  ['A7', 'Notifications (30 cases)', 'Done', 'All 30 run.'],
  ['A8', 'Macros (MC-01..18)', 'Not started', ''],
  ['B', 'Every pair (OR-01..35)', 'Not started', 'Some rows need live Zoho.'],
  ['C', 'Whole order (OR-22..27, E2E)', 'Not started', '100-ticket timing and real-mail journeys.'],
  ['Z', 'Missing list vs Zoho', 'Filed', 'NDC-2829 (15 gaps with images).'],
  ['—', 'Live Zoho comparisons', 'Partial', 'Setup pages (SLA, skills, round robin, assignment rules) do not load on this network (Zoho CDN fails).'],
  ['V', 'Visual checks', 'Partial', 'English, Arabic, 390 px done for SLA / notifications / assignment and the workflow list + editor. No dark theme in TAVI.']];

// ---------- Needs your decision / action ----------
const decide = [
  ['I9 agent invite', 'Accept in Gmail', 'Open the TAVI Desk invite sent to mahmoud.mmohamedsamy+wf@gmail.com (QA AO WF Agent), accept, set any password.'],
  ['I29 rating', 'Rate in Gmail', 'Open the happiness email for ticket #3194 "QA AO WF I29 please rate" (to +qaao) and click any smiley. Customer Happiness stays ON until then.'],
  ['J5 business hours', 'Choose', 'Wait until 23:00 Cairo tonight (hours 01:00–23:00 fit Shift-01), or let me shorten Shift-01 for 15 minutes and restore it.'],
  ['A10 second tenant', 'Add a login', 'A login on another TAVI tenant (row in TAVI Desk Credentials.csv); without it A10 and the cross-tenant half of O5 stay blocked.'],
  ['P11 new FAIL', 'File it?', 'Execution Time condition (during / outside business hours / holiday) never matches.'],
  ['O4 security', 'File it?', 'Webhook header injection: a line break inside a header value adds a new header to the outgoing request (proved on webhook.site). Saved through the API; screen not tried yet.'],
  ['O1 security', 'File it?', 'An Add Comment action body saved through the API with <img onerror> runs script when an admin opens the rule in the editor. Screen input not tried, so it is API-only input; but the editor is the one rendering it. Evidence: evidence/raw/o1-editor-cm.png.'],
  ['NDC-1488', 'Post?', 'Hosted web form link still 404 (11 Nov). Not posted to Plane.'],
  ['Zoho Setup', 'Other network?', 'Q2 skill rule, Q3 SL-21 picker, Q4 SL-30 and missing-list items 5, 17–20 need Zoho Setup pages, which fail here.']];

// ---------- Filed in Plane ----------
const filed = [
  ["NDC-2948", "E9", "Medium", "Workflow Rules | A criteria pattern that leaves out a condition is accepted, and that condition is ignored", "WF-E9-pattern-leaves-out-condition-vs-zoho.png", '12 Nov'],
  ["NDC-2951", "Z18", "Medium", "Workflow Rules | A rule can have only one Field Update action", "WF-Z18-one-action-per-type-vs-zoho.png", '12 Nov'],
  ["NDC-2953", "F7 (B-2)", "Medium", "Workflow Rules | The rules API accepts a Field Update on the system field Created By", "WF-B2-field-update-created-by-vs-zoho.png", '12 Nov'],
  ["NDC-2955", "C4/C7", "Low", "Workflow Rules | Rule name length is only checked when you save", "WF-C4-name-length-only-at-save-vs-zoho.png", '12 Nov'],
  ["NDC-2958", "F18", "Medium", "Workflow Rules | ${recordId} and ${moduleId} come out empty in a Field Update", "WF-F18-recordid-moduleid-empty.png", '12 Nov'],
  ["NDC-2961", "B2", "Low", "Workflow Rules | Rules list shows internal field names in the Trigger column", "WF-B2-trigger-column-internal-names.png", '12 Nov'],
  ["NDC-2962", "O4", "High", "Workflow Rules | A line break in a webhook header value adds an extra header to the outgoing request", "WF-O4-webhook-header-injection.png", '12 Nov'],
  ["NDC-2963", "O1", "High", "Workflow Rules | Script saved in an Add Comment action runs when an admin opens the rule", "WF-O1-add-comment-script-runs-in-editor.png", '12 Nov'],
  ["NDC-2964", "G4", "High", "Workflow Rules | Double-clicking Save & Activate creates two identical rules", "WF-G4-double-save-two-rules.png", '12 Nov'],
  ["NDC-2965", "G5", "Medium", "Workflow Rules | Saving a rule silently overwrites a change made by someone else", "WF-G5-save-overwrites-other-change.png", '12 Nov'],
  ["NDC-2966", "I30", "Low", "Workflow Rules | \"Send happiness email\" is logged as Succeeded while ratings are off", "WF-I30-happiness-email-succeeded-while-off.png", '12 Nov'],
  ["NDC-2967", "API-T3 (B-1)", "High", "Records API | 500 error when \"kind\" is not the first key of a field value", "WF-API-500-value-key-order.png", '12 Nov'],
  ["NDC-2968", "I25 (B-8)", "Medium", "Workflow Rules | Create Record action skips required fields and leaves the new record without an owner", "WF-I25-create-record-skips-required-fields.png", '12 Nov'],
  ["NDC-2973", "I9", "Medium", "Workflow Rules | Owner Assignment action assigns suspended agents and agents outside the department", "WF-I9-owner-assignment-ignores-suspended-agent.png", '12 Nov'],
  ["NDC-2997", "E2E-1 / I8", "High", "Workflow Rules | Owner Assignment by role (round robin) never assigns anyone", "WF-E2E1-role-round-robin-assigns-nobody.png", '13 Nov'],
  ["NDC-2998", "D6 side", "Low", "Workflow Rules | The rules API accepts a date trigger on a field that is not a date", "WF-D6-date-trigger-on-text-field.png", '13 Nov'],
  ["NDC-2999", "E2E-1 side", "Medium", "Workflow Rules | Owner Assignment action saves any role or user value, even \"x\"", "WF-owner-target-not-checked.png", '13 Nov'],
  ['NDC-2825', 'SL-30', 'High', 'SLA | Updating a ticket does not restart an SLA set to run on Ticket Update', 'SL-30-sla-not-reset-on-update-vs-zoho.png', '9 Nov'],
  ['NDC-2826', 'SL-12', 'Medium', 'SLA | Target conditions offer no number or date operators', 'SL-12-sla-no-number-date-operators-vs-zoho.png', '9 Nov'],
  ['NDC-2829', 'Missing list', 'Medium', 'Desk Automation: features Zoho Desk has that Desk is missing (15 gaps)', '*', '9 Nov'],
  ['NDC-2832', 'SL-62', 'High', 'Tickets | Countdown Mode: 6 of 7 columns show "Couldn\'t load these tickets"', 'SL-62-countdown-mode-columns-fail-vs-zoho.png', '10 Nov'],
  ['NDC-2833', 'SL-38', 'Medium', 'SLA | Plan\'s SLA still runs after the ticket allowance is used up', 'SL-38-sla-applied-after-allowance-used-up-vs-zoho.png', '10 Nov'],
  ['NDC-2834', 'SL-57', 'Low', 'SLA | An escalation template used by an SLA can be deleted with no warning', 'SL-57-template-used-by-sla-deleted-without-warning-vs-zoho.png', '10 Nov'],
  ['NDC-2835', 'SL-54', 'Low', 'SLA | A "Before due" escalation longer than the target can be saved', 'SL-54-before-due-escalation-longer-than-target-vs-zoho.png', '10 Nov'],
  ['NDC-2837', 'EM-08', 'Medium', 'Email | Setup says "Mail is arriving" when customer mail does not reach Desk', 'EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png', '10 Nov'],
  ['NDC-2838', 'E18-03', 'Low', 'Assignment Rules | Round robin backlog skips an old ticket without saying why', 'E18-03-backlog-skips-old-ticket-without-reason.png', '10 Nov'],
  ['NDC-2839', 'Prefs', 'Low', 'Assignment Rules | Agent without the permission can read Round Robin Preferences', 'AG-prefs-agent-can-read-rr-preferences.png', '10 Nov'],
  ['NDC-2840', 'Owner on create', 'Low', 'Ticket Form | Tickets can\'t be created unassigned like Zoho (filed by you)', null, '10 Nov'],
  ['NDC-2841', 'SL-60', 'Medium', 'SLA | A contract can use a support plan from another department', 'SL-60-contract-takes-plan-from-another-department-vs-zoho.png', '10 Nov'],
  ['NDC-2850', 'SL-51', 'Medium', 'SLA | Removing an agent drops them from escalations with no replacement', 'SL-51-removed-agent-dropped-from-escalation-not-replaced-vs-zoho.png', '10 Nov'],
  ['NDC-2851', 'NT-24', 'Medium', 'Notifications | Bulk close sends closed mails (Zoho sends none)', 'NT-24-bulk-close-sends-closed-mail-vs-zoho.png', '10 Nov'],
  ['NDC-2852', 'SL-21', 'Medium', 'SLA | Chosen escalation agents without ticket access are skipped silently', 'SL-21-escalation-skips-chosen-agents-without-ticket-access-vs-zoho.png', '10 Nov'],
  ['NDC-2853', 'SL-22', 'High', 'SLA | Department admin named in an escalation never gets the mail', 'SL-22-escalation-email-never-reaches-department-agent-vs-zoho.png', '10 Nov'],
  ['NDC-2864', 'AG-MAIL', 'High', 'Notifications | Agent emails not sent with the default template (in-app only)', 'AG-MAIL-agent-notification-email-not-sent-with-default-template-vs-zoho.png', '11 Nov']];
const missingImgs = fs.existsSync(D + '/evidence/annotated') ? fs.readdirSync(D + '/evidence/annotated').filter(f => /^\d\d-/.test(f)).sort() : [];

// ---------- A4 Workflow: per-row results ----------
const spec = fs.readFileSync(path.join(D, '../../docs/desk-workflow-rules/spec-desk-workflow-rules.md'), 'utf8').split(/\r?\n/);
const groups = []; let g = null;
for (const l of spec) {
  if (/^## (Group [A-Z]|E2E journeys)/.test(l)) { g = { title: l.replace(/^## /, '').replace(/`\[serial\]`/, '').replace(/`/g, '').trim(), rows: [] }; groups.push(g); continue; }
  if (/^## /.test(l)) { g = null; continue; }
  if (g && /^\| *(?:[A-Z]\d+|E2E-\d) *\|/.test(l)) { const c = l.split('|').slice(1, -1).map(s => s.trim()); g.rows.push({ id: c[0], sc: c[1] }); }
}
const P = ['Customer Reply trigger', 'Agent Response trigger', 'Comment trigger, public / private', 'Private Thread trigger + direction', 'Happiness Rating trigger', 'Field Changed: 3 fields, Any / All', 'Several events in one rule', 'Department scope', 'Active / Inactive tabs', 'Contact and Account conditions', 'Execution Time: business hours', 'New ticket fields (Is Overdue, Created By…)', "Operators: doesn't contain, between, Current Time", 'Add Comment public / private', 'Send Email Reply', 'Email to Contact, Team, Role', 'Assign to a team on Create / Edit', 'Add Followers', 'Mark as Spam', 'Share Ticket', 'Change Layout', 'Run Custom Action', 'Add / Remove / Recalculate Skills, Reassign by Skills', 'Update Related Record', 'Ticket history names the rule', 'Saved actions for new types'];
const Rr = ['B-1 record API 500 when "kind" is not first', 'B-2 created_by accepted by Field Update', 'B-3 no Send happiness email saved action', 'B-4 webhook 404 shown as Cancelled', 'B-5 picker offers used action types', 'B-6 no menu link to Execution History', 'B-7 cancelled scheduled action has no dispatch row', 'B-8 Create Record skips required fields', 'B-9 role round robin assigns nobody', 'NDC-2205, 2204, 2173', 'NDC-2203 FAIL items'];
const zi = groups.findIndex(x => /^Group Z/.test(x.title));
groups.splice(zi, 0, { title: 'Group P — Built since 12 Oct', rows: P.map((s, i) => ({ id: 'P' + (i + 1), sc: s })) },
  { title: 'Group R — Old bug rechecks', rows: Rr.map((s, i) => ({ id: 'R' + (i + 1), sc: s })) });
const A = {}; const set = (st, list, note = '') => list.split(/\s+/).filter(Boolean).forEach(i => A[i] = [st, note]);
set('PASS', 'A3 A4 A6 A7 A8', 'Desk Agent profile: read-only rights work by API.');
set('PASS', 'A5', 'Screen: New Rule hidden, row actions disabled with "Requires …", editor blocks.');
set('PASS', 'B1 B3 B7 B8 B9 C2 D2 D7 E2 E16 F1 F4 F5 F19 G1 G3 K1 L4 L5 M2 M3');
set('PASS', 'B6', 'NDC-2173 still fixed.'); set('PASS', 'B14', 'Limit removed: #51 and #52 saved (spec row outdated).');
set('PASS', 'F2', 'Scheduled Field Update now built: 60 s delay applied.');
set('PASS', 'G8', 'Java row passed; B-1 / B-2 tracked in R1 / R2.');
set('PASS', 'H1 H2 H5 H6 H7 H8 H9 H10 H11 H12 H15 H16 H17 H18 H19 H20');
set('PASS', 'H3 H4', 'NDC-2205 still fixed.'); set('PASS', 'H13 I3', 'On a temporary QA WF Layout (removed after).');
set('PASS', 'I1 I2 I5 I6 I7 I11 I12 I13 I15 I16 I17 I22 I23 I24 I26 I27 I31 I32 I33 J2 J3 J4 J8 J9 J10 J11');
set('PASS', 'I18', 'One mail per person (Samy once although named and a team member).');
set('PASS', 'I28', 'Send happiness email sends the closed mail with rating, as Zoho.');
set('PASS', 'J1', 'Rerun alone 219 s; earlier fail was late-night slowness.');
set('PASS', 'O3', 'Private / loopback / metadata URLs refused at save.');
set('FAIL', 'M1', 'B-6 still: no menu link to Execution History.'); set('FAIL', 'F7', 'B-2 still.'); set('FAIL', 'F3', 'B-5 still.');
set('FAIL', 'K2', 'B-3 still.'); set('FAIL', 'J7', 'B-7 still.'); set('FAIL', 'I14', 'B-4 still.'); set('FAIL', 'I25', 'B-8 still.'); set('FAIL', 'I8', 'B-9 still.');
set('PASS', 'I4', '12 Nov: city part updated, street and country kept. 11 Nov 500 was a staging outage (metadata service 503).');
set('PASS', 'A9 A11 B13 E11 G7 K3 K5 K9', '12 Nov, Java API contract tests.');
set('PASS', 'H14', 'Rules fire on API-created tickets.'); set('PASS', 'K6', 'Usage lists both rules.');
set('PASS', 'K7', 'Delete refused: "Cannot delete … it is used by 2 rule(s): …" (Zoho not documented).');
set('PARTIAL', 'K8', 'Inactive saved via API; the editor warning on screen not checked yet.');
set('FINDING', 'L1', 'Test rule ignores the sample record id: a matching ticket with no typed values → "not matched"; only typed JSON values count. Nothing saved (correct). Panel example JSON is CRM-style (revenue, intValue).');
set('PASS', 'L2', 'Not matched.'); set('PASS', 'L3', 'Bad value / not an object → 400 naming the field. Screen message not checked.');
set('PASS', 'L6', 'Shows the webhook with delaySeconds 120.');
set('PASS', 'M4', 'Detail has trigger, outcome, criteria, record, sync ms, correlation, dispatches.');
set('PARTIAL', 'M7', 'API: take/skip work, page ignored, no total count. Screen paging not checked.');
set('PASS', 'M8', 'Runs of a deleted rule still readable.'); set('PASS', 'B12', 'Restored from the Recycle Bin, active with its action.');
set('PASS', 'G10 N4', 'Audit: workflow_rule created / updated / deleted / restored with actor and field changes.');
set('PASS', 'N1', 'History: "workflow rule ran" with rule name, actor System (no separate field-change line, same as C3).');
set('PASS', 'O2', 'Merge field rendered once; {{…}} / ${…} in the subject stay plain text.');
set('FAIL', 'O4', 'SECURITY: header value "a" + line break + "Injected: 1" saved and sent as two headers (receiver got Injected: 1). Host override accepted (dispatch stuck Pending, TLS error). Authorization allowed (normal).');
set('PASS', 'O6', 'Random ids → 404 with only the id; similar times.');
set('FINDING', 'O1', 'Security: script in an Add Comment body runs in the rule editor. Your decision.');
set('MOVED', 'I10', 'Part B (Workflow vs Round robin).'); set('BLOCKED', 'A10', 'No second tenant.'); set('SKIPPED', 'O13', 'Edge only on this machine.');
set('PASS', 'P1', 'Portal reply fired the Customer Reply rule.'); set('PASS', 'P2 P3 P6 P8 P10 P12 P13 P14 P19 P20 P21 P24 P26');
set('PASS', 'P4', 'Direction now built (API + screen).'); set('PASS', 'P5', 'Good fired "good" + "any", not "bad".');
set('PASS', 'P7', 'Ticket events combine; record + ticket events in one rule not possible.');
set('PASS', 'P15 P16', 'Mails confirmed in your Gmail.'); set('PASS', 'P17', 'Team on Create fixed (NDC-2203 item).');
set('PARTIAL', 'P11', 'Business-hours half only (tenant is 24/7).');
set('FINDING', 'P18', 'Agents without ticket access skipped, history still says Succeeded (same family as NDC-2852).');
set('BLOCKED', 'P22', 'API needs a pasted OpenAPI spec; do on screen.');
set('PARTIAL', 'P23', 'Add / remove skills PASS; reassign by skills inconclusive (nobody online).');
set('FINDING', 'P25', 'C3: close by workflow Field Update: no closed mail / rating, same as Zoho (checked live 12 Nov, not a bug). Differs only in history: TAVI logs "Workflow rule ran" with no status line; Zoho logs the rule, the field update and "Status changed from Open to Closed".');
['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'].forEach((r, i) => A[r] = ['FAIL', 'Still fails (' + ['G8 / API-T3', 'F7', 'K2', 'I14', 'F3', 'M1', 'J7', 'I25', 'I8'][i] + '). Never filed; file with your OK.']);
set('PASS', 'R5', 'B-5 WITHDRAWN after the Zoho check: Zoho also offers an action type again once used (it allows several of each). The real gap is Z18.');
A.R2[1] += ' Zoho: Field Update offers only the 14 editable ticket fields, no Created By.';
set('PASS', 'R10', 'NDC-2205, 2204, 2173 all still fixed.'); set('PASS', 'R11', 'Direction and team on Create both fixed.');
const zp = { Z1: 'P1', Z2: 'P2', Z3: 'P4', Z4: 'P5', Z5: 'P3', Z6: 'P6', Z7: 'P7', Z8: 'P8', Z9: 'P9', Z10: 'P10', Z11: 'P11', Z12: 'P12', Z13: 'P13', Z14: 'P14', Z15: 'P15', Z16: 'P16', Z17: 'P17', Z19: 'P18', Z20: 'P19', Z21: 'P20', Z22: 'P21', Z23: 'P22', Z26: 'P23', Z28: 'P25' };
for (const [z, p] of Object.entries(zp)) if (A[p]) A[z] = [A[p][0], 'Built now; result of ' + p + '.'];
A.Z16 = ['FAIL', 'No free-text / outside addresses in Email recipients: gap stays.'];
set('SKIPPED', 'Z24', 'No chat tool connected.'); set('SKIPPED', 'Z25', 'IM skipped (standing rule).'); set('SKIPPED', 'Z27', 'AI skipped (standing rule).');
// ---- 12 Nov afternoon: screen rows (Playwright, Edge) + runtime rows by API ----
set('PASS', 'A1', 'Owner opens the rules list, Actions library and Execution History.');
set('FINDING', 'B2', 'Trigger column shows internal field names ("Field Changed: qa_ndc_related_branch", "due_date") and "1 days before". Same in Arabic. Zoho shows labels.');
set('PASS', 'B4', 'Module filter offers all 10 Desk modules.'); set('PASS', 'B5', '"No matching rules / No workflow rules match your search or filter."');
set('PASS', 'B10', '"Delete 2 workflow rules?" + Recycle Bin text; toast "2 rules deleted".');
set('FINDING', 'B11', 'One of 2 already deleted: other one deleted, but the toast is a raw id "Rule 19fe442f-… not found." (no "1 deleted, 1 failed").');
set('PASS', 'C1', 'Cancel and Escape close the wizard; nothing saved.');
set('PASS', 'C3', 'Next stays disabled until module and name are filled (no message text).');
set('FINDING', 'C4', 'Screen box has no length limit (1000 chars typed); server limit is 200 ("must be 200 characters or fewer") shown only at save. Padded name trimmed; spaces-only blocked. Zoho: name box stops typing at 50 (maxlength).');
set('PASS', 'C5', 'Arabic + emoji + <img onerror> name saved and shown as text in header and list; no script ran.');
set('PASS', 'C6', 'Duplicate names allowed, no crash (as Zoho).');
set('FINDING', 'C7', 'Description limit 2000 chars, enforced only by the server at save (no limit in the box).');
set('PASS', 'C8', 'Layout hint changes for All layouts / one layout.');
set('PARTIAL', 'C9', 'Reloading the new-rule page kept the draft name silently; "Resume your draft?" prompt not seen in this path.');
set('PASS', 'C10', 'Wizard → editor at /new; nothing stored before Save.');
set('PASS', 'D1', 'Summary sentence changes per trigger (created / edited / created or edited / deleted / "Subject" changes).');
set('PASS', 'D3', 'Watch field list = editable fields only (no Created / Modified / Ticket Number).');
set('PASS', 'D4', 'Save → "Pick the date field for the trigger."'); set('PASS', 'D5', 'Only date fields (Created, Modified, Due, Closed, Response Due, First Response + QA date fields).');
set('BLOCKED', 'D6', 'Every module has system date fields (Created / Modified Time), so no module without date fields exists to test.');
set('PASS', 'D8', 'Elapsed / Business hours hints shown; summary adds "counting business hours only".'); set('PASS', 'D9', 'Recurring / One time with descriptions.');
set('PASS', 'D10', 'With Delete trigger only Webhook, Email, Task, Create Record are offered (Remove Tags cannot be picked).');
set('PASS', 'D11', 'No "Score value" offered.'); set('PASS', 'D12', 'Panels collapse to the summary sentence; values kept.');
set('PASS', 'E1', '"No conditions — actions run on every event of this trigger." / matching adds a condition.');
set('PASS', 'E3', 'Operators per type: text 11, pick list 7, date 10 (between / not between), user, skills, lookup; all have "changed".');
set('PASS', 'E4', 'Pick-list values as chips (high, urgent) stored as a Membership list.');
set('BLOCKED', 'E5', 'No pick-list field without options found on Tickets.');
set('PASS', 'E6', 'Empty value → "Incomplete" + "Complete the highlighted conditions."'); set('PASS', 'E7', 'AND/OR toggle updates the pattern ((1 and 2) or 3).');
set('PASS', 'E8', 'Saved as Or(And(1,2),3).');
set('FINDING', 'E9', 'Errors shown: "Pattern ends unexpectedly.", "Missing closing parenthesis.", "Pattern refers to condition 4, which doesn\'t exist." But "1 and 2" with 3 conditions is accepted: condition 3 stays on screen and is silently ignored. "1 and 2 or 3" read as ((1 and 2) or 3) without asking. Zoho refuses it: "Numbers in this pattern do not match with the numbers used in the Criteria Editor" (seen live).');
set('PASS', 'E10', 'Removing condition 2 renumbers the pattern to (1 and 2).'); set('PASS', 'E12', '"Subject changed" saved.');
set('PASS', 'E13', 'Tags offered as a condition field.'); set('PASS', 'E14', 'Only address parts are offered (Account · Street / City), never a whole address.');
set('PARTIAL', 'E15', 'Arabic + emoji + ZWJ typed into a value; stored value not re-checked (that condition was removed in E10).');
set('PASS', 'F6', '125 writable fields; system fields not offered.'); set('PASS', 'F8', 'Roles = Desk roles CEO, Manager (NDC-2204 still fixed); Users / Teams / Roles / Profiles / User Fields.');
set('FINDING', 'F9', 'Methods POST / PUT / PATCH. Empty URL / body not checked on screen: the server answers with raw text "Actions[0].Url: \'Url\' must not be empty.; …".');
set('PARTIAL', 'F10', 'Internal / metadata URLs refused by the server (O3); screen message not checked.');
set('PASS', 'F11', '"Every Email action needs at least one recipient." / "Select a template…"; "Free-text addresses aren\'t allowed."');
set('FINDING', 'F12', 'Empty title saved → raw server toast "Actions[0].TaskTitle: \'Task Title\' must not be empty." (no on-screen check). Assignee hint shown, no Reminder field.');
set('PASS', 'F13', 'Calls: Standard layout picked, required fields added automatically (Subject, Start Time, Call Status, Contact Name, Department).');
set('PASS', 'F14', '"Select at least one tag for the Add Tags action."; Add to / Replace existing tags.');
set('PASS', 'F15', '"Select at least one tag for the Remove Tags action."'); set('PASS', 'F16', 'All three info texts shown.');
set('PASS', 'F17', 'Insert field + help text (${recordId}, ${moduleId}, $${).');
set('FAIL', 'F18', '${recordId} and ${moduleId} render EMPTY in a Field Update although the help says they are always available. ${unknown} → empty, $${x} → ${x}, unclosed ${subject stays literal (correct). Zoho ${Cases.Request Id} gives the ticket number.');
set('PASS', 'F20', 'Saved action picker + "SAVED" badge.'); set('SKIPPED', 'F21', 'Library has Tickets actions; the "only other modules" state would need deleting them.');
set('PASS', 'F22', '"Pick a saved action for each “Use a saved action” slot."'); set('PASS', 'F23', 'Removed action type offered again.');
set('PASS', 'F24', 'Delay box: whole number ≥ 1 with days / hours / minutes.');
set('PASS', 'G2', 'Save & Activate stores an active rule.');
set('FAIL', 'G4', 'A real double-click on Save & Activate created 2 identical rules (twice: C5 and G4 tests).');
set('FAIL', 'G5', 'Tab 1 saved over a change made meanwhile (rename by tab 2): no "Rule changed" warning, the other change was silently lost.');
set('PASS', 'G6', 'Save after delete → error toast (raw id "Rule … not found."), no ghost rule; reload "Rule not found".');
set('PARTIAL', 'G9', 'Session cleared with the editor open: draft kept in the browser; the save stopped at the screen check, server reply not reached.');
set('BLOCKED', 'I9', 'The A4 agent "QA AO WF Agent" never accepted the invite (status Invited), so there is no active agent to suspend.');
set('PASS', 'I19', 'Email to role Manager + Ticket Owner field: dispatch Succeeded.');
set('PASS', 'I20', 'Template deleted (allowed, no warning, as NDC-2834) → email Cancelled with "The rule\'s email template was deleted. Choose another template in the rule."');
set('PASS', 'I21', 'Scheduled email (60 s): nothing at 15 s, Succeeded by 100 s.');
set('NOT RUN', 'I29', 'Needs a customer to rate in Gmail first (then fire the action again).');
set('FINDING', 'I30', 'Ratings off: Send happiness email dispatch says "Succeeded" with no reason and nothing in history; help says nothing is sent, so it should say skipped and why.');
set('NOT RUN', 'J5 J6', 'Tenant runs 24/7; needs business hours set by the owner and a wait across opening hours.');
set('PASS', 'K2 R3', 'New Action now offers "Happiness Email" (B-3 fixed, 12 Nov).');
set('PASS', 'K4', '"Name is required.", "Select a module.", "Add at least one field to update."');
set('PARTIAL', 'K8', 'Inactive saved actions are not offered in the picker, so the inactive warning is not reachable on screen; runtime skip proven in I32.');
set('PASS', 'K10', 'Arabic / emoji / HTML names shown as text; spaces-only and >200 chars refused.');
set('PARTIAL', 'M5', 'Trigger column shows "On Create"; a Field Changed row not looked at on screen (Java H3/H4 pass).');
set('FAIL', 'M6', 'Execution History shows Rule and Record as raw ids (rules exist), and the record is not a link to the ticket.');
set('PASS', 'N2', 'History shows the department by name. Side note: "Ticket was created" appears twice.');
set('PASS', 'N3', 'Task created by the rule shows in the ticket Activity tab.'); set('PASS', 'N5', 'Audit Log rule link opens the rule. Side notes: actor shown as "User a7a7a7a7", "&lt;img" double-escaped.');
set('PARTIAL', 'O7', 'Arabic list is right-to-left and translated; Arabic editor not opened (helper uses English labels).');
set('PASS', 'O8', 'Keyboard reaches New Rule, Enter opens the wizard, focus inside, Escape closes.');
set('PASS', 'O9', 'No unnamed controls on the list (305) or editor (72).'); set('PASS', 'O10', '390 px: list and editor fit, no page-wide scroll (search box squeezed to "Sear…").');
set('PASS', 'O11', 'List with 113 rules loads in 2.5 s.');
set('NOT RUN', 'O12', 'Burst of 50 tickets with 3 active QA rules: left for Part C (OR-27).');
set('PASS', 'P9 Z9', 'Active 59 / Inactive 54 / All 113, each tab filters right.');
set('FAIL', 'Z18', 'Still one action per type per delay ("A rule can have only one \'FieldUpdate\' action with the same delay."): gap stays. Zoho allows up to 10 alerts, 10 tasks, 10 field updates per rule.');
set('NOT RUN', 'E2E-1 E2E-2 E2E-3 E2E-4 E2E-5', 'Whole journeys moved to Part C (they chain several automations; E2E-1 also depends on B-9).');
set('PASS', 'E2E-6', 'Clean-up diff vs the 11 Nov baseline: none of the 50 rules or 8 saved actions missing or changed. 3 extra inactive Java retest leftovers then deleted with your OK; tenant now equals the baseline (50 rules, 8 actions).');
set('NOT RUN', 'A2', 'Needs a user whose profile has no workflow view right; none exists, and making one changes tenant profiles (ask first).');
set('NOT RUN', 'O5', 'Needs a second tenant / record to prove nothing else leaks into a webhook or email body; only one tenant here.');
// ---- 12 Nov evening: remaining rows (user: run the 9 + change/revert or dummy data for the rest) ----
set('PASS', 'P22', 'Custom action built on screen (Custom Actions › New action › Paste spec › Desk) and published; Run Custom Action in a Desk rule → Succeeded, webhook.site got the GET.');
set('FINDING', 'C9', 'Draft is kept in the browser, but New Rule never asks "Resume your draft?" — it starts empty; opening /workflow-rules/new later silently restores an old draft (seen with the F10 draft).');
set('PASS', 'E15', 'Arabic + emoji + <b>HTML</b> + zero-width joiner typed on screen: stored exactly (19 code points); a ticket with the exact text fires, the same text without the ZWJ does not.');
set('FINDING', 'M5', 'Execution History shows a Field Changed rule run as "On Edit" (spec: "Field Changed"). TAVI-only page (Zoho has none).');
set('FINDING', 'M7', 'Execution History shows the latest 50 runs only: no paging and no total on screen (API take/skip work). TAVI-only page.');
set('FINDING', 'O7', 'Arabic: right-to-left, back arrow flipped, labels translated except "Webhook" and "Close"; flow connector lines sit outside the cards in RTL.');
set('PASS', 'F10', 'localhost, 127.0.0.1, 169.254.169.254, metadata.google.internal, 10.x refused on save: "Actions[0].Url: Webhook Url must be a public http(s) endpoint; loopback, private, link-local, and internal hosts are not allowed." (raw "Actions[0].Url:" prefix, as F9). 2 kB public URL accepted.');
set('PASS', 'G9', 'Session removed with the editor open, then Save: "Your session expired. Please sign in again." and the draft stays in the browser.');
set('PASS', 'A2', 'Customer Experience Specialists 2 switched to Desk Light Agent (no workflow rights): no workflow menu items; the 3 pages by URL show "You do not have permission / access"; API 403; no rule data. Profile restored to Desk Agent.');
set('PASS', 'E5', 'Not reachable: a pick-list cannot be created without options ("At least one allowed value is required"), so the editor state cannot occur.');
set('PASS', 'F21', 'Calls rule › Field Update › Use a saved action: Tickets actions not offered; "No saved Field Update actions for this module yet — create one in Settings → Automation → Actions." (wording differs from spec).');
set('PASS', 'J6', 'Tenant 24/7: "2 hours before due, business hours" fired together with the wall-clock rule, 2 h before due.');
set('PASS', 'J5', 'Hours 01:00–23:00 (fits Shift-01), 6 business hours before due 02:37 Cairo: the business-hours rule fired 18:37 Cairo, skipping the 23:00–01:00 closed gap; the wall-clock control could not fire (my test error: its subject guard did not match the ticket), so the 2-hour difference was not shown side by side. Hours reverted to 24/7.');
set('PASS', 'P11', "Rechecked 12 Nov 23:10: 24/7 → During business hours Fired, Outside and Holiday No match; hours 01:00–23:00 while closed → Outside Fired, During and Holiday No match. The earlier FAIL was my test error (rule subject guard did not match the ticket). Holiday positive not checked (no holiday today). Hours back to 24/7.");
set('PASS', 'P23', 'Test User 1 (skill QA AS6 sk1) signed in: Reassign by skills → owner Test User 1 ("reassigned": true).');
set('PARTIAL', 'O5', 'Same tenant: two tickets fired one webhook together; each body had only its own subject/description. Other-tenant half needs a second tenant.');
set('PASS', 'O13', 'Edge, Chromium (Chrome engine) and Firefox 156: list, editor, save and search work the same.');
set('PASS', 'I29', 'After your Good rating on #3194, firing the action again sent nothing (link stays rated). On #3205 with a pending link, it sent a new mail "Reminder: Your ticket #3205 has been closed". Note: Execution History shows Succeeded even when nothing was sent. Happiness settings restored (no diff); rules and tickets deleted.');
set('FAIL', 'I9', "Owner Assignment ignores who can own the ticket. (1) Agent in the department, suspended: the ticket is left unassigned but Execution History says Fired with no error or reason (manual assign is refused: not an active agent of the department). (2) Agent not in the department: the rule assigns them anyway, even while suspended, though manual assign refuses it. Ticket stays usable. Filed NDC-2973."); set('BLOCKED', 'A10', 'No second TAVI tenant available (you, 12 Nov).');
for (const [z, p] of Object.entries(zp)) if (A[p]) A[z] = [A[p][0], 'Built now; result of ' + p + '.'];
// ---- 12 Nov night: user "run them all"
set("PASS", "A10", "Second tenant (Anyware, signed in 12 Nov): GET/PATCH/deactivate/DELETE of an NDC rule id → 404 (PUT 405); NDC ticket replies 404; executions for the NDC ticket empty; NDC rule and run not in Anyware lists. Same with the NDC tenant header. NDC rule unchanged afterwards.");
set("PASS", "O5", "Both halves: same tenant (two tickets, each body only its own); cross tenant: the same webhook rule in NDC and Anyware fired together — each body carried only its own ticket and department. Anyware rule + ticket deleted.");
set("PASS", "D6", "Cannot occur: a new module (QA AO WF D6, created and deleted) still gets Created Time + Modified Time, which cannot be deleted (409 STANDARD_FIELD_NOT_DELETABLE); the date picker lists them. Side note: the rules API accepts a date trigger on the text field name (201); an unknown field is refused (400).");
set("PASS", "I10", "Direct assignment rule (switch turned on for the test, then back off) + workflow Owner Assignment on create: assignment sets the owner first, then the workflow replaces it → workflow wins (Zoho order: assignment, then workflow). Assignment alone → Test User 1.");
set("PASS", "O12", "3 active rules, 50 tickets created in 10 s: 50/50 tickets have exactly 3 runs, 0 duplicates, all actions Succeeded; field and tag applied 50/50; queue drained within ~3.5 min.");
set("FAIL", "E2E-1", "Tag, Task (+1 day) and Email to owner all Succeeded, one run per ticket, only urgent tickets matched. Owner by role round robin (CEO role: Test User 1 online + Dev Team 2) assigned nobody on 6 tickets, also unowned ones — same as I8 (B-9). Run still says Fired. Filed NDC-2997.");
set("PASS", "E2E-2", "Due + 10 min, Status Open: the open ticket got the Task and the Webhook at 21:46:09 (expected 21:45:43); the ticket closed before the due time got nothing.");
set("PARTIAL", "E2E-3", "Saved Email action in 2 rules: Used by = 2 (list and usage API). Template edited once; both rules sent before (#3313, #3314) and after (#3315, #3316), all Succeeded. The text in the mails (ONE before, TWO after) needs a Gmail check (+qaao).");
set("PASS", "E2E-4", "Field Changed Status → Add Tag: no tag on create or after editing priority and description; tag added only after the status change (history).");
set("PASS", "E2E-5", "Receiver answering 500: retries 1→2→3 with growing gaps (6 s, ~2 min, ~10 min), each showing HTTP 500, status Pending; receiver fixed → next ticket Succeeded first time and the first ticket Succeeded on attempt 4. Rule stayed active, ticket usable.");
set("FAIL", "Z24", "Missing: no chat notification actions (Cliq, Slack, Teams, Google Chat) in the action picker (22 actions listed, 12 Nov).");
set("FAIL", "Z25", "Missing: no instant-messaging actions (WhatsApp, Telegram, SMS template message) in the action picker.");
set("FAIL", "Z27", "Missing: no AI actions (field extraction / prediction, generate content, auto reply) in the action picker.");
const count = rows => { const c = {}; rows.forEach(r => { const s = (A[r.id] || ['NOT RUN'])[0]; c[s] = (c[s] || 0) + 1; }); return c; };
const ORDER = ['PASS', 'FAIL', 'FINDING', 'PARTIAL', 'INCONCLUSIVE', 'BLOCKED', 'SKIPPED', 'MOVED', 'NOT RUN'];
const pills = c => ORDER.filter(k => c[k]).map(k => pill(k + ' ' + c[k], C[k])).join(' ');
const allA4 = groups.flatMap(x => x.rows); const ca4 = count(allA4);
const a4Done = allA4.length - (ca4['NOT RUN'] || 0);
const a4Html = groups.map(G => {
  const c = count(G.rows);
  const body = G.rows.map(r => { const [s, n] = A[r.id] || ['NOT RUN', '']; return `<tr><td><b>${r.id}</b></td><td>${esc(r.sc)}</td><td>${pill(s)}</td><td>${esc(n)}</td></tr>`; });
  return `<details${(c.FAIL || c.FINDING) ? ' open' : ''}><summary><b>${esc(G.title)}</b> <span class="muted">(${G.rows.length})</span> ${pills(c)}</summary>${table(['Id', 'Scenario', 'Result', 'Note'], body, 'rows')}</details>`;
}).join('');

// ---------- A5 / A7 / A1–A3 summaries ----------
const sla = [['PASS', 53, 'SL-01–04, 06–11, 13–16, 18–20, 23–26, 28, 29, 31–37, 39–50 (excl. 38), 52, 53, 55, 56, 58, 59, 61, 63, 64, 66, 67'],
  ['BUG', 10, 'SL-12 (2826), 21 (2852), 22 (2853), 30 (2825), 38 (2833), 51 (2850), 54 (2835), 57 (2834), 60 (2841), 62 (2832)'],
  ['FINDING', 2, 'SL-27, SL-65: recorded, no expected result decides them'], ['API ONLY', 2, 'SL-05, SL-17']];
const nt = [['PASS', 25, 'NT-01–03, 05–15, 17–22, 25, 27–30'], ['BUG', 1, 'NT-24 (2851). Also NDC-2864 agent mails, found while testing NT-30'],
  ['API ONLY', 2, 'NT-04 (not a bug), NT-23'], ['SKIPPED', 2, 'NT-26 (you said ignore), NT-16 (no longer reproduces)']];
const asg = [['A Rules page and form', 'All pass (A-08 toast not seen).'], ['B Criteria', 'All pass (B-06 contact fields gap excluded by you).'],
  ['C Direct form', 'All pass, incl. C-08 screen half (10 Nov).'], ['D Direct runtime', 'D-01..D-14 pass; D-14 web form PASS 11 Nov; email and import channels blocked.'],
  ['E Round robin', 'All pass incl. E-03 settings vs Zoho; E-18 covered by NDC-2838.'], ['F Preferences', 'All pass; F-08 PASS 4 times in a row. F-14 = NDC-2824 (set aside).'],
  ['G Notifications', 'All pass (NT-19 both halves).'], ['H Skills', 'All pass.'], ['I Non-functional', 'I-04 PASS 20/20 within 5 s when staging is calm.'],
  ['Bug rechecks', 'NDC-2811, 2812, 2814, 2821 fixed; 2824 still fails.']];

const zv = [
  ['DIFFERS FROM ZOHO', 6, 'WF-08 E9 pattern ignores a condition · WF-14 Z18 one action per type · B-2 Field Update offers Created By · WF-11 C4 name length only at save · WF-06 F18 ${recordId} empty · WF-13 B2 internal names in Trigger column', 'Parity bugs. Expected result rewritten to Zoho: E9 refused with "Numbers in this pattern do not match…"; up to 10 alerts / tasks / field updates; only 14 editable fields; name box stops at 50; ${Cases.Request Id} = ticket number; labels shown.', 'bad'],
  ['BUG, NO ZOHO EQUIVALENT', 7, 'WF-01 O4 header injection · WF-02 O1 script in Add Comment · WF-03 G4 double save = 2 rules · WF-04 G5 silent overwrite · WF-07 I30 happiness Succeeded while off · B-1 500 when kind not first · B-8 Create Record skips required fields', 'Real bugs; Zoho has no webhook action, or its help is silent. G4/G5 not tried in Zoho (would save rules there).', 'bad'],
  ['TAVI ONLY', 8, 'WF-05 M6 Execution History · WF-09 L1 Test rule · WF-10 F9/F12 webhook / task messages · WF-12 B11 bulk delete · B-4 webhook status · B-6 history menu · B-7 scheduled actions · B-9 round robin by role', 'Zoho has none of these features, so not parity bugs. File only if you want TAVI extras fixed.', 'info'],
  ['WITHDRAWN', 1, 'B-5 action type offered again', 'Zoho does the same (several of each type allowed).', 'grey']];
const tenant = ['Switches: Direct rules OFF (as found), Round robin ON, assignment notices ON.',
  'Restored 12 Nov: Customer Happiness back to the original (no difference), QA AO Dept A private again.',
  'Deleted 12 Nov (your OK): 57 "QA AO WF" rules (55 active) + 1 saved action. Now 53 rules, none active. Also deleted: 3 inactive Java leftovers (QA 2205 / 2206) — rules now equal the 11 Nov baseline. Still there: A4 agent invite "QA AO WF Agent" (pending), portal contact +wfp.',
  '8 old QA workflow rules (4 "QA AS6 WF", 4 "QA 2205"). 41 "QA NDC" and "test workflow" are not ours: leave them.',
  'O1 payload rules in the Recycle Bin.', 'Owner\'s All Tickets view left on Table View.', 'Zoho techsolutionsegypt: clean (12 Nov C3 test: rule, field update, tickets #184–186 and contact deleted; Closing a ticket notification back OFF).'];
const next = ['Your decisions above (A4 agent, NDC-1488). Workflow bugs filed 12 Nov (NDC-2948…2968).', 'A4 leftovers when unblocked: I9 (agent), I29 (you rate in Gmail), J5 / J6 (business hours), A2, O7 editor in Arabic.',
  'A6 Blueprint → A8 Macros → Part B pairs → Part C whole order → final report.'];

const cardsHtml = [['6 of 8', 'Part A features done (A6 Blueprint, A8 Macros left)'], [`${a4Done} of ${allA4.length}`, 'A4 Workflow rows with a status (' + allA4.filter(r => !A[r.id]).length + ' not run)'], [String(filed.length), 'Plane items filed'], [String(['R1','R2','R3','R4','R5','R6','R7','R8','R9'].filter(r => A[r] && A[r][0] === 'FAIL').length), 'old workflow bugs still failing, not filed (B-3 fixed, B-5 withdrawn)'], [String(decide.length), 'items waiting on you'], ['0 of 2', 'Part B and C started']]
  .map(([n, l]) => `<div class="tile"><b>${n}</b><span>${l}</span></div>`).join('');

const css = `:root{--bg:#f6f7f9;--card:#fff;--text:#1c2230;--muted:#5d6678;--line:#e2e5eb;--ok:#1f8a4c;--ok-bg:#e6f5ec;--warn:#a15c00;--warn-bg:#fff3df;--bad:#b42318;--bad-bg:#fdecea;--grey:#4b5563;--grey-bg:#eceff3;--info:#2457d6;--info-bg:#e8eefc}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--grey:#b6bdc9;--grey-bg:#262b35;--info:#7aa2ff;--info-bg:#1b2640}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--grey:#b6bdc9;--grey-bg:#262b35;--info:#7aa2ff;--info-bg:#1b2640}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1150px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:34px 0 12px}
.sub{color:var(--muted);margin:0 0 16px}nav{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px;margin:0 0 16px;font-size:14px}nav a{color:var(--info);text-decoration:none;margin-right:14px;display:inline-block}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.tile b{display:block;font-size:24px}.tile span{color:var(--muted);font-size:13px}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px;margin:6px 0}table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}tr:last-child td{border-bottom:0}
table.rows td:first-child,table.rows td:nth-child(3){white-space:nowrap}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;margin:1px 0}.ok{color:var(--ok);background:var(--ok-bg)}.warn{color:var(--warn);background:var(--warn-bg)}.bad{color:var(--bad);background:var(--bad-bg)}.grey{color:var(--grey);background:var(--grey-bg)}.info{color:var(--info);background:var(--info-bg)}
details{margin:8px 0}summary{cursor:pointer;padding:6px 0}.muted{color:var(--muted)}code{font-size:13px;background:var(--grey-bg);padding:1px 5px;border-radius:4px}
img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:8px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px}.box ul,.box ol{margin:0;padding-left:20px}
.bar{display:flex;height:12px;border-radius:6px;overflow:hidden;background:var(--grey-bg);margin:8px 0 4px}.bar i{display:block}`;
const bar = c => { const n = Object.values(c).reduce((a, b) => a + b, 0); const col = { PASS: 'var(--ok)', FAIL: 'var(--bad)', FINDING: 'var(--warn)', PARTIAL: 'var(--warn)', BLOCKED: 'var(--grey)', SKIPPED: 'var(--grey)', MOVED: 'var(--grey)', 'NOT RUN': 'transparent' }; return `<div class="bar">${ORDER.filter(k => c[k]).map(k => `<i title="${k} ${c[k]}" style="width:${100 * c[k] / n}%;background:${col[k] || 'var(--grey)'}"></i>`).join('')}</div>`; };

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Desk Automation Progress</title><style>${css}</style></head><body><main>
<h1>Desk automation order: progress</h1>
<p class="sub">TAVI Desk vs Zoho Desk on NDC-Staging, from 8 Nov 2026. <b>Last updated: ${UPDATED}.</b> Local report, rebuilt after each step.</p>
<nav><a href="#latest">Latest</a><a href="#plan">Plan</a><a href="#decide">Waiting on you</a><a href="#a4">A4 Workflow</a><a href="#zoho">Bugs vs Zoho</a><a href="#open">Not run / why</a><a href="#filed">Filed</a><a href="#sla">SLA</a><a href="#nt">Notifications</a><a href="#asg">A1–A3</a><a href="#tenant">Tenant</a><a href="#next">Next</a></nav>
<div class="tiles">${cardsHtml}</div>

<h2 id="latest">Latest activity</h2>
${table(['When', 'What'], log.map(l => `<tr><td style="white-space:nowrap">${l[0]}</td><td>${esc(l[1])}</td></tr>`))}

<h2 id="plan">Plan status</h2>
${table(['Part', 'Feature', 'Status', 'Notes'], plan.map(p => `<tr><td>${p[0]}</td><td>${esc(p[1])}</td><td>${pill(p[2])}</td><td>${esc(p[3])}</td></tr>`))}

<h2 id="decide">Waiting on you</h2>
${table(['Item', 'Ask', 'Detail'], decide.map(d => `<tr><td><b>${esc(d[0])}</b></td><td>${pill(d[1], 'warn')}</td><td>${esc(d[2])}</td></tr>`))}

<h2 id="a4">A4 Workflow (${allA4.length} rows: spec 237 + Group P 26 + Group R 11)</h2>
<p>${pills(ca4)}</p>${bar(ca4)}
<p class="muted">Groups with a failure or finding are open. Old bugs B-1..B-9 come from the 14 Oct run and were never filed.</p>
${a4Html}

<h2 id="zoho">Workflow bugs vs Zoho Desk (22 items)</h2>
<p>Each bug was checked in live Zoho Desk (techsolutionsegypt, nothing saved; its rules list is still empty) and Zoho's help pages. Full cards with steps, Zoho expected results and images: <a href="report-workflow-bugs.html">report-workflow-bugs.html</a>. Findings only: <a href="report-workflow-findings.html">report-workflow-findings.html</a>.</p>
${table(['Verdict', 'Count', 'Items', 'Meaning'], zv.map(z => `<tr><td>${pill(z[0], z[4])}</td><td>${z[1]}</td><td>${esc(z[2])}</td><td>${esc(z[3])}</td></tr>`))}

<h2 id="open">A4 rows blocked, skipped, moved or not run — and why</h2>
${table(['Id', 'Scenario', 'Status', 'Why'], allA4.filter(r => ['BLOCKED', 'SKIPPED', 'MOVED', 'NOT RUN'].includes((A[r.id] || ['NOT RUN'])[0])).map(r => { const [st, n] = A[r.id] || ['NOT RUN', 'No reason recorded']; return '<tr><td><b>' + r.id + '</b></td><td>' + esc(r.sc) + '</td><td>' + pill(st) + '</td><td>' + esc(n) + '</td></tr>'; }), 'rows')}
<p class="muted">Partial rows (only one half checked) are listed inside each group above with what is missing.</p>

<h2 id="filed">Filed in Plane (${filed.length})</h2>
${table(['Ticket', 'Case', 'Priority', 'Title', 'Filed'], filed.map(f => `<tr><td><b>${f[0]}</b></td><td>${esc(f[1])}</td><td>${pill(f[2], f[2] === 'High' ? 'bad' : f[2] === 'Medium' ? 'warn' : 'grey')}</td><td>${esc(f[3])}${f[4] === '*' ? `<details><summary class="muted">${missingImgs.length} annotated images</summary><div class="grid">${missingImgs.map(m => `<img loading="lazy" src="evidence/annotated/${m}" alt="${m}">`).join('')}</div></details>` : f[4] ? `<details><summary class="muted">Annotated evidence</summary><img loading="lazy" src="evidence/annotated/${f[4]}" alt="${f[1]} evidence"></details>` : ''}</td><td>${f[5]}</td></tr>`))}
<p class="muted">Bug state, NDC-2811 assignees, Desk, Sprint 15. Earlier assignment bugs NDC-2811..2814, 2821, 2824 not re-filed.</p>

<h2 id="sla">A5 SLA (67 rows, all run)</h2>
${table(['Result', 'Count', 'Rows'], sla.map(r => `<tr><td>${pill(r[0])}</td><td>${r[1]}</td><td>${esc(r[2])}</td></tr>`))}
<h2 id="nt">A7 Notifications (30 rows, all run)</h2>
${table(['Result', 'Count', 'Rows'], nt.map(r => `<tr><td>${pill(r[0])}</td><td>${r[1]}</td><td>${esc(r[2])}</td></tr>`))}
<h2 id="asg">A1–A3 Skills, Direct assignment, Round robin (done)</h2>
${table(['Group', 'Result'], asg.map(a => `<tr><td><b>${esc(a[0])}</b></td><td>${esc(a[1])}</td></tr>`))}

<h2 id="tenant">Left on the tenant</h2>
<div class="box"><ul>${tenant.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
<h2 id="next">Next</h2>
<div class="box"><ol>${next.map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>
<p class="muted" style="margin-top:24px">Sources: PROGRESS.md, ledger.md, a4/, evidence/ in executions/execu_2026-11-08_desk-automation-order. Builder: scripts/build-progress-report.js.</p>
</main></body></html>`;
fs.writeFileSync(D + '/report-progress.html', html);
console.log('A4', allA4.length, JSON.stringify(ca4), 'filed', filed.length);
if (process.env.LIST_NOT_RUN) for (const G of groups) { const n = G.rows.filter(r => !A[r.id]); if (n.length) console.log('\n' + G.title.slice(0, 40) + '\n  ' + n.map(r => r.id + ': ' + r.sc.slice(0, 90)).join('\n  ')); }
