// Second filing batch (25 Nov 2026): one spec + annotated image per finding, built with the 13 Nov builder (annotate-vs-zoho.js).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const UI = 'executions/execu_2026-11-24_desk-bp-regression/evidence/ui/';
const BUILDER = path.join(__dirname, '../../execu_2026-11-08_desk-automation-order/scripts/annotate-vs-zoho.js');
const OUTDIR = path.join(__dirname, '../../execu_2026-11-08_desk-automation-order/evidence/annotated');
const EV = JSON.parse(fs.readFileSync(path.join(RUN, 'evidence/plane-evidence2.json'), 'utf8'));
const ENV = 'staging-desk.taviportal.com (NDC-Staging) · Customer Support · Edge + API';
const DATE = 'TAVI 25 Nov 2026 (11:40 Cairo) · Zoho not checked live';
const ZDATE = 'TAVI 25 Nov 2026 (11:40 Cairo) · Zoho Desk 18 Nov 2026 (live, techegysolutions)';
const P = (img, caption, crop, boxes = [], side) => ({ ...(side ? { side } : {}), img: UI + img, w: 1600, h: 900, caption, crop, boxes });
const base = { leftHead: 'TAVI Desk (what happens)', rightHead: 'Expected', rightLabel: 'Expected', date: DATE, env: ENV };
const specs = {
  'BP-R6': { ...base, leftHead: 'TAVI Desk (left screenshot)', rightHead: 'Zoho Desk (right panel)', rightLabel: 'Zoho', date: ZDATE, label: 'DIFFERS FROM ZOHO', verdict: 'FAIL', out: 'BP-R6-ticket-created-in-middle-status-reset-to-open-vs-zoho.png', ticket: 'Blueprint · EN-13', title: 'A ticket created in a middle status enters at the start state and its status is reset to Open',
    panels: [P('EW-EN13-history.png', `Ticket #${EV.en13.no} "created as Escalated": status pill Open, Steps "Open · Now", Status Open; History "Entered blueprint … at Open" and no line for the status change`, [370, 60, 1230, 840], [{ b: [680, 143, 855, 162], n: 1 }, { b: [388, 548, 520, 572], n: 1 }, { b: [388, 870, 460, 898], n: 1 }, { b: [710, 800, 1030, 826], n: 2 }], 'tavi'),
      P('EW-EN13-zoho.png', 'Zoho ticket #170 created with status Escalated stays Escalated and enters the blueprint at Escalated; #169 created Open enters at Open', [0, 0, 1600, 900], [], 'zoho')],
    rows: [[1, 'Ticket created with Status = Escalated (blueprint Open → Escalated → Closed)', 'Enters the blueprint at Escalated; Status stays Escalated', 'Enters at Open; Status changed to Open', 'DIFFERS'],
      [2, 'History of that ticket', 'Shows where the ticket entered', '"Entered blueprint … at Open"; no line for Escalated → Open', 'DIFFERS']] },
  'BP-R7': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R7-arabic-blueprint-status-names-untranslated.png', ticket: 'Ticket · UX-01', title: 'In Arabic the blueprint progress bar, pill and Steps card show status names in English',
    panels: [P('EW-UX01-arabic-ticket.png', `Ticket #${EV.ux01.no} in Arabic: progress bar "Closed / Escalated / Open", pill "Open / QA BP R …" and Steps card "Open", "Escalated" in English; the list chip and the Status field say "مفتوحة"`, [0, 60, 1600, 840], [{ b: [220, 178, 925, 200], n: 1 }, { b: [745, 142, 920, 162], n: 1 }, { b: [1125, 548, 1215, 652], n: 1 }, { b: [1512, 212, 1580, 240], n: 2 }, { b: [1135, 872, 1212, 898], n: 2 }])],
    rows: [[1, 'Progress bar, blueprint pill and Steps card in Arabic', 'Status names translated (as in the list and the Status field)', 'Shown in English: Open, Escalated, Closed', 'BUG'], [2, 'Ticket list chip and Status field on the same page', 'Translated', 'Translated ("مفتوحة") — so the page shows both', 'INFO']] },
  'BP-R8': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R8-api-saves-unknown-business-hours-and-template.png', ticket: 'Blueprint API · ST-05 / ST-07', title: 'A state can be saved with a business-hours set or an escalation email template that does not exist',
    panels: [P('EW-ST05-api.png', 'Unknown business-hours id and unknown template id are saved (201); an unknown owner id in the same kind of request is refused (422)', [0, 0, 1600, 900])],
    rows: [[1, 'State business-hours set = id that does not exist', 'Refused like other unknown ids', 'Saved (201)', 'BUG'], [2, 'Escalation level template = id that does not exist', 'Refused like other unknown ids', 'Saved (201); designer later shows "This email template was deleted"', 'BUG']] },
  'BP-R9': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R9-api-saves-unnamed-transition-and-huge-checklist.png', ticket: 'Blueprint API · CV-06 / API-01', title: 'A transition with no name and a 2,000-item checklist are saved',
    panels: [P('EW-CV06-api.png', 'Empty transition name and a 2,000-item checklist are saved (201); an unknown action kind is refused (422)', [0, 0, 1600, 900])],
    rows: [[1, 'Transition name empty', 'Refused (the designer says "The transition from Open to Escalated needs a name")', 'Saved (201)', 'BUG'], [2, 'Checklist with 2,000 items', 'A sensible limit with a clear message', 'Saved (201)', 'BUG']] },
  'BP-R10': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R10-create-task-unknown-assignee-mode-saved.png', ticket: 'Blueprint API · TF-X1', title: 'Create-task action with an unknown assignee mode is saved and assigns the ticket owner',
    panels: [P('EW-TFX1-api.png', 'assigneeMode "specific" with Agent A is saved; the task goes to the ticket owner (Agent B)', [0, 0, 1600, 900])],
    rows: [[1, 'Save createTask with assigneeMode "specific"', 'Refused: unknown assignee mode (valid: owner, performer, user, team)', 'Saved (201), stored as "specific"', 'BUG'], [2, 'Run the transition', 'n/a once refused', 'Task assigned to the ticket owner (Agent B), not Agent A', 'BUG']] },
  'BP-R11': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R11-history-owner-change-shown-twice.png', ticket: 'Ticket History · RS-01', title: 'One owner change is shown twice in History ("Ticket owner was changed" and "Ticket Owner was updated")',
    panels: [P('EW-RS01-history-plain.png', `Ticket #${EV.rs01.noBlueprint.no} (no blueprint) assigned once: two History lines with the same time, old and new value`, [664, 270, 936, 570], [{ b: [710, 418, 1000, 502], n: 1 }, { b: [710, 520, 1000, 604], n: 1 }])],
    rows: [[1, 'Assign an owner to a ticket once', 'One History line for the owner change', 'Two lines: "Ticket owner was changed" and "Ticket Owner was updated", same time, Old blank → New Customer Experience Specialists 1', 'BUG'], [2, 'Same on a ticket inside a blueprint', 'One line', 'Same two lines (ticket #7635 and #7562)', 'INFO']] },
};
const SPECDIR = path.join(RUN, 'evidence/specs'); fs.mkdirSync(SPECDIR, { recursive: true }); fs.mkdirSync(path.join(RUN, 'evidence/annotated'), { recursive: true });
for (const [k, s] of Object.entries(specs)) {
  const f = path.join(SPECDIR, k + '.json'); fs.writeFileSync(f, JSON.stringify({ key: k, ...s }, null, 1));
  console.log(execFileSync('node', [BUILDER, f]).toString().trim());
  fs.copyFileSync(path.join(OUTDIR, s.out), path.join(RUN, 'evidence/annotated', s.out));
}
