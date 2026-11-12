// Writes one annotation spec per Workflow Rules Plane item and renders it with annotate-wf.js into evidence/annotated/.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const E = 'executions/execu_2026-11-08_desk-automation-order/evidence/';
const ENV = 'staging-desk.taviportal.com (NDC-Staging) · owner account · Edge';
const Z = 'Zoho Desk techsolutionsegypt (live, nothing saved)';
const tv = (img, caption, crop, boxes, w = 1440, h = 900) => ({ side: 'tavi', img: E + img, w, h, caption, crop, boxes });
const zo = (img, caption, crop, boxes, w = 1600, h = 900) => ({ side: 'zoho', img: E + img, w, h, caption, crop, boxes });
const one = (img, caption, crop, boxes, w = 1440, h = 900) => ({ img: E + img, w, h, caption, crop, boxes });
const noZ = { rightLabel: 'Expected', leftHead: 'TAVI Desk (screenshot)', rightHead: 'Expected' };
const specs = [
  { key: 'D-01', out: 'WF-E9-pattern-leaves-out-condition-vs-zoho.png', ticket: 'Workflow Rules · E9', title: 'A criteria pattern that leaves out a condition is accepted; the condition is ignored', date: 'TAVI 12 Nov 2026 · Zoho 12 Nov 2026', env: ENV + ' · ' + Z,
    panels: [tv('a4-bugs/E9-unused-condition-accepted.png', 'TAVI: 3 conditions, pattern "( 1 and 2 )" accepted — condition 3 is not used', [290, 380, 1010, 330], [{ b: [305, 620, 1205, 662], n: 1 }, { b: [415, 676, 555, 698], n: 1 }]),
      zo('a4-bugs/E9-zoho-pattern-must-use-all-numbers.png', 'Zoho: pattern that does not use every condition is refused', [0, 0, 1100, 220], [], 1100, 220)],
    rows: [[1, 'Pattern that leaves out condition 3', 'Refused: "Numbers in this pattern do not match with the numbers used in the Criteria Editor". The rule cannot be saved.', 'Accepted and saved; condition 3 stays on screen but is silently ignored.', 'DIFFERS']] },
  { key: 'D-02', out: 'WF-Z18-one-action-per-type-vs-zoho.png', ticket: 'Workflow Rules · Z18', title: 'A rule can have only one Field Update (per delay)', date: 'TAVI 12 Nov 2026 · Zoho 12 Nov 2026', env: ENV + ' · ' + Z,
    panels: [tv('raw/api-d02-two-field-updates.png', 'TAVI: two instant Field Updates refused by the rules API (the editor uses the same API)', [0, 0, 1440, 430], [{ b: [22, 230, 1418, 280], n: 1 }], 1440, 600),
      zo('raw/zoho-field-update-dialog.png', 'Zoho: Field Update dialog has "+" to set more fields; up to 10 field updates per rule', [400, 98, 930, 580], [{ b: [1272, 424, 1312, 464], n: 1 }])],
    rows: [[1, 'Two Field Updates in one rule', 'Allowed: up to 10 field updates, 10 alerts and 10 tasks per rule; one Field Update can set several fields.', '400 "A rule can have only one \'FieldUpdate\' action with the same delay." (two Tasks are now allowed).', 'DIFFERS']] },
  { key: 'D-03', out: 'WF-B2-field-update-created-by-vs-zoho.png', ticket: 'Workflow Rules · F7', title: 'The rules API accepts a Field Update on the system field Created By', date: 'TAVI 12 Nov 2026 · Zoho 12 Nov 2026', env: ENV + ' · ' + Z,
    panels: [tv('raw/api-d03-created-by.png', 'TAVI: API saves a Field Update on created_by; ticket_number is refused', [0, 0, 1440, 420], [{ b: [22, 90, 1418, 175], n: 1 }], 1440, 600),
      tv('raw/ev-d03-created-by.png', 'TAVI editor: "Created" not offered (No results found)', [300, 700, 300, 160], [{ b: [318, 740, 565, 850], n: 2 }]),
      zo('a4-bugs/B-2-zoho-field-update-only-editable-fields.png', 'Zoho: Field Update lists only editable fields', [440, 430, 400, 280], [{ b: [460, 500, 810, 700], n: 1 }])],
    rows: [[1, 'Field Update on Created By', 'Not possible: only the 14 editable ticket fields are offered.', 'The API saves it (HTTP 201). Ticket Number is correctly refused (422 read-only).', 'DIFFERS'],
      [2, 'Rule editor', 'Not offered.', 'Not offered either (correct) — only the API lets it through.', 'INFO']] },
  { key: 'D-04', out: 'WF-C4-name-length-only-at-save-vs-zoho.png', ticket: 'Workflow Rules · C4 / C7', title: 'Rule name length is only checked when you save', date: 'TAVI 12 Nov 2026 · Zoho 12 Nov 2026 (box maxlength read live)', env: ENV + ' · ' + Z,
    panels: [one('raw/ev-d04-name-length.png', 'TAVI: a 253-character name is typed without limit; the error appears only at save', [160, 60, 1280, 840], [{ b: [195, 70, 1215, 100], n: 1 }, { b: [995, 790, 1418, 878], n: 1 }])],
    rightLabel: 'Zoho', leftHead: 'TAVI Desk (screenshot)', rightHead: 'Zoho Desk',
    rows: [[1, 'Typing a long rule name', 'The Rule Name box stops typing at 50 characters (maxlength 50), so no error at save. Description has no limit.', 'No limit while typing; at save "The length of \'Name\' must be 200 characters or fewer. You entered 253 characters." Description: refused above 2000 only at save.', 'DIFFERS']] },
  { key: 'D-05', out: 'WF-F18-recordid-moduleid-empty.png', ticket: 'Workflow Rules · F18', title: '${recordId} and ${moduleId} come out empty', date: 'TAVI 12 Nov 2026 · Zoho help article', env: ENV,
    panels: [one('raw/ev-d05-ticket.png', 'TAVI ticket #3160: Field Update "R[${recordId}] M[${moduleId}] S[${subject}]" produced "R[] M[] S[QA AO WF EV5 ticket]"', [664, 60, 776, 260], [{ b: [680, 255, 900, 282], n: 1 }])],
    rightLabel: 'Zoho', leftHead: 'TAVI Desk (screenshot)', rightHead: 'Zoho Desk (help: email templates / placeholders)',
    rows: [[1, 'Placeholders for the record ID and module', '${Cases.Request Id} gives the ticket number; placeholders are filled with the ticket\'s values.', '${recordId} and ${moduleId} are empty although the editor help says they are always available; ${subject} works.', 'DIFFERS']] },
  { key: 'D-06', out: 'WF-B2-trigger-column-internal-names.png', ticket: 'Workflow Rules · B2', title: 'Rules list shows internal field names in the Trigger column', date: 'TAVI 12 Nov 2026', env: ENV,
    panels: [one('a4-bugs/B2-trigger-column-internal-names.png', 'TAVI rules list: "Field Changed: qa_ndc_related_branch", "owner", "status"', [290, 230, 1110, 670], [{ b: [800, 590, 905, 676], n: 1 }, { b: [800, 270, 905, 335], n: 1 }])],
    rightLabel: 'Zoho', leftHead: 'TAVI Desk (screenshot)', rightHead: 'Zoho Desk',
    rows: [[1, 'Trigger column', 'Field labels everywhere in a rule ("QA NDC Related Branch", "Ticket Owner", "Status"); internal names are never shown.', 'Internal names: qa_ndc_related_branch, owner, status, due_date and "1 days before". Same in Arabic.', 'DIFFERS']] },
  { key: 'D-08', out: 'WF-O4-webhook-header-injection.png', ticket: 'Workflow Rules · O4', title: 'Webhook header value with a line break adds an extra header', label: 'SECURITY', date: 'TAVI 12 Nov 2026 13:43 UTC', env: ENV + ' · receiver webhook.site', ...noZ,
    panels: [one('raw/api-d08-webhook-headers.png', 'One configured header "X-QA: a\\r\\nInjected: 1" arrived as two headers', [0, 0, 1440, 460], [{ b: [22, 90, 1418, 140], n: 1 }, { b: [22, 225, 420, 248], n: 2 }], 1440, 600)],
    rows: [[1, 'Header value with a line break', 'Refused at save ("Header values can\'t contain line breaks"); reserved headers like Host refused too.', 'Saved.', 'BUG'], [2, 'What the receiver gets', 'Only X-QA.', 'x-qa: a AND injected: 1 — an extra header was injected. Dispatch: Succeeded.', 'BUG']] },
  { key: 'D-09', out: 'WF-O1-add-comment-script-runs-in-editor.png', ticket: 'Workflow Rules · O1', title: 'Script saved in an Add Comment action runs when an admin opens the rule', label: 'SECURITY', date: 'TAVI 11–12 Nov 2026', env: ENV, ...noZ,
    panels: [one('a4-bugs/O1-editor-runs-script.png', 'Rule "QA AO WF O1cm" opened in the editor: the comment body <img src=x onerror=…> renders as an image and its script runs', [370, 530, 500, 410], [{ b: [522, 830, 600, 880], n: 1 }], 1600, 1000)],
    rows: [[1, 'Add Comment body with HTML', 'Shown as plain text; no script runs anywhere.', 'Rendered as HTML in the editor; the onerror script runs (window.__xss set). List, history and ticket comment are safe.', 'BUG']] },
  { key: 'D-10', out: 'WF-G4-double-save-two-rules.png', ticket: 'Workflow Rules · G4', title: 'Double-clicking Save & Activate creates two identical rules', date: 'TAVI 12 Nov 2026 15:55', env: ENV, ...noZ,
    panels: [one('raw/ev-d10-two-rules.png', 'After one double-click on Save & Activate: two identical active rules "QA AO WF EV10 double save"', [290, 140, 1110, 260], [{ b: [300, 275, 1390, 380], n: 1 }])],
    rows: [[1, 'Double-click Save & Activate', 'One rule; the button is disabled while saving.', 'Two identical active rules created at the same minute.', 'BUG']] },
  { key: 'D-11', out: 'WF-G5-save-overwrites-other-change.png', ticket: 'Workflow Rules · G5', title: 'Saving a rule silently overwrites a change made by someone else', date: 'TAVI 12 Nov 2026', env: ENV, ...noZ,
    panels: [one('a4-bugs/G5-save-no-conflict-warning.png', 'Rules list after admin A saved: the rename made meanwhile in another tab is gone, no warning was shown', [290, 60, 1110, 360], [])],
    rows: [[1, 'Rule renamed in tab 2 while open in tab 1, then tab 1 saves', 'Tab 1 is told the rule changed and asked to reload; nothing is lost.', 'Save succeeds with no warning; the rename is lost (name back to the old one). The save carries no version, so the server cannot detect it.', 'BUG']] },
  { key: 'D-12', out: 'WF-I30-happiness-email-succeeded-while-off.png', ticket: 'Workflow Rules · I30', title: '"Send happiness email" says Succeeded while ratings are off', date: 'TAVI 12 Nov 2026 15:43', env: ENV, ...noZ,
    panels: [one('raw/api-d12-happiness-off.png', 'Customer Happiness is_enabled:false, yet the action is logged Succeeded', [0, 0, 1440, 330], [{ b: [22, 90, 260, 140], n: 1 }, { b: [22, 215, 620, 280], n: 1 }], 1440, 600),
      one('raw/ev-d12-executions.png', 'Execution History: rule fired, 1 action run, no reason', [290, 225, 1110, 160], [{ b: [300, 330, 1390, 380], n: 1 }])],
    rows: [[1, 'Send happiness email while ratings are off', 'Nothing sent and the run says "skipped: ratings are off" (the editor itself says nothing is sent while ratings are off).', 'SendHappinessEmail: Succeeded, with no reason; nothing in the ticket history.', 'BUG']] },
  { key: 'D-13', out: 'WF-API-500-value-key-order.png', ticket: 'Records API · API-T3', title: '500 error when "kind" is not the first key of a field value', date: 'TAVI 12 Nov 2026', env: ENV + ' · API', ...noZ,
    panels: [one('raw/api-d13-key-order.png', 'Same field value, keys in a different order: 500 vs 201', [0, 0, 1440, 470], [{ b: [22, 175, 1418, 225], n: 1 }, { b: [22, 360, 1418, 410], n: 2 }], 1440, 600)],
    rows: [[1, '"value" before "kind"', 'Accepted (JSON key order must not matter).', 'HTTP 500 INTERNAL_ERROR "An unexpected error occurred".', 'BUG'], [2, '"kind" first', 'Accepted.', 'HTTP 201 created.', 'INFO']] },
  { key: 'D-14', out: 'WF-I25-create-record-skips-required-fields.png', ticket: 'Workflow Rules · I25', title: 'Create Record action skips required fields and leaves the record without an owner', date: 'TAVI 12 Nov 2026 15:43', env: ENV, ...noZ,
    panels: [one('raw/ev-d14-call.png', 'Call created by rule "QA AO WF EV14": no Subject, Call Owner Unassigned, Created By "Unknown user"; the run says Succeeded', [260, 60, 920, 600], [{ b: [575, 70, 870, 125], n: 1 }, { b: [280, 385, 540, 440], n: 2 }])],
    rows: [[1, 'Required Subject left out of the Create Record action', 'The rule cannot be saved, or the run fails with a clear reason.', 'Call created with no Subject; Execution History: CreateRecord Succeeded.', 'BUG'], [2, 'Owner of the new record', 'A real owner (the rule owner or a chosen user).', 'Call Owner Unassigned; Created By "Unknown user".', 'BUG']] },
];
fs.mkdirSync(path.join(RUN, 'evidence/specs'), { recursive: true });
const out = {};
for (const s of specs) {
  const spec = { verdict: s.rows.some(r => r[4] === 'DIFFERS') ? 'FAIL' : 'FAIL', label: s.label || (s.rows.some(r => r[4] === 'DIFFERS') ? 'DIFFERS FROM ZOHO' : 'BUG'), ...s };
  const f = path.join(RUN, 'evidence/specs', s.key + '.json'); fs.writeFileSync(f, JSON.stringify(spec, null, 1));
  try { execFileSync('node', [path.join(__dirname, 'annotate-wf.js'), f], { stdio: 'pipe' }); out[s.key] = s.out; } catch (e) { out[s.key] = 'ERR ' + String(e.stderr || e.message).slice(0, 200); }
}
fs.writeFileSync(path.join(RUN, 'evidence/specs/wf-images.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
