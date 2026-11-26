// Writes one spec per Plane draft and builds the annotated image with the 13 Nov builder (annotate-vs-zoho.js).
// Images land in executions/execu_2026-11-08_desk-automation-order/evidence/annotated/ (builder default) and are copied to this run's evidence/annotated/.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const UI = 'executions/execu_2026-11-24_desk-bp-regression/evidence/ui/';
const BUILDER = path.join(__dirname, '../../execu_2026-11-08_desk-automation-order/scripts/annotate-vs-zoho.js');
const OUTDIR = path.join(__dirname, '../../execu_2026-11-08_desk-automation-order/evidence/annotated');
const EV = JSON.parse(fs.readFileSync(path.join(RUN, 'evidence/plane-evidence.json'), 'utf8'));
const ENV = 'staging-desk.taviportal.com (NDC-Staging) · Customer Support · Edge + API';
const DATE = 'TAVI 24 Nov 2026 (17:01 Cairo) · Zoho not checked live';
const P = (img, caption, crop, boxes = []) => ({ img: UI + img, w: 1600, h: 900, caption, crop, boxes });
const base = { leftHead: 'TAVI Desk (what happens)', rightHead: 'Expected', rightLabel: 'Expected', date: DATE, env: ENV };
const specs = {
  'BP-R1': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R1-transition-form-skips-field-checks.png', ticket: 'Blueprint · TU-06 / TU-12 / TU-18', title: 'A value typed in a transition form skips the field\'s own checks (text length, pick-list option, contact exists)',
    panels: [P('EV1-history.png', `Ticket #${EV.bug1.no}, History after transition "QA go": Category changed blank → "zzz-not-an-option" (not an option); Ticket Information shows Category = zzz-not-an-option`, [370, 300, 1230, 560], [{ b: [710, 495, 1100, 565], n: 2 }, { b: [380, 778, 640, 818], n: 2 }]),
      P('EV1-api.png', 'Same values: the normal edit refuses all three (422), the transition saves all three (200)', [0, 0, 1600, 900], [])],
    rows: [[1, 'Text field (max 255) gets 400 characters', 'Refused: "QA NDC TKT/PNR NO is too long: 400 characters, the maximum is 255." (as in a normal edit)', `Saved through the transition (${EV.bug1.stored.pnrLength} characters stored)`, 'BUG'],
      [2, 'Category gets "zzz-not-an-option"', 'Refused: "Category: \'zzz-not-an-option\' is not one of the allowed values"', 'Saved; shown in Ticket Information and History', 'BUG'],
      [3, 'Contact gets an id of no contact', 'Refused: "Contact: no record exists with id …"', 'Saved (contact_id = id of nothing)', 'BUG']] },
  'BP-R2': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R2-api-error-shows-dotnet-type-names.png', ticket: 'Blueprint API · API-07', title: 'A blueprint body of the wrong shape returns internal .NET type names',
    panels: [P('EV2-api.png', 'POST /modules/{tickets}/blueprints with requiredFor.comment as a list: the message names MetadataEngine.Modules.Records.Application.Blueprint.RequiredForRule and the parser position', [0, 0, 1600, 900], [])],
    rows: [[1, 'Wrong shape for "requiredFor"', 'A readable message naming the field (like the owner-id case fixed in NDC-3069)', 'The JSON value could not be converted to MetadataEngine…RequiredForRule. Path: $.transitions[0]… | BytePositionInLine: 696', 'BUG']] },
  'BP-R3': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R3-owner-without-edit-access-told-not-owner.png', ticket: 'Blueprint · E2E-01', title: 'A named transition owner who cannot edit the ticket is told "You are not an owner of this transition"',
    panels: [P('EV3-ticket-as-agent-A.png', `Agent A (named owner of "QA Approve") opens ticket #${EV.bug3.no} owned by Agent B: read-only banner, "No transitions you can run", Steps card says only owners can run it`, [664, 60, 936, 360], [{ b: [1230, 163, 1428, 190], n: 1 }, { b: [680, 222, 1584, 264], n: 1 }]),
      P('EV3-api.png', 'Through the API: edit refused (PERMISSION_DENIED), no transitions offered, run → BLUEPRINT_NOT_OWNER "You are not an owner of this transition"', [0, 0, 1600, 900], [])],
    rows: [[1, 'Agent A is the named owner of "QA Approve"; ticket owned by Agent B', 'Refusal names the real reason ("You can\'t change this ticket, so you can\'t run QA Approve"); the designer warns that a Desk Agent owner can\'t act on colleagues\' tickets', 'Run refused with "You are not an owner of this transition" although A is the owner', 'BUG'],
      [2, 'Same ticket unassigned', 'A runs the step', 'A runs the step (200)', 'INFO']] },
  'BP-R4': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R4-workflow-log-fired-when-status-skipped.png', ticket: 'Workflow Rules · IN-01', title: 'Execution history says "Fired" when a status change was skipped because the ticket is in a blueprint',
    panels: [P('EV4-api.png', `Rule "${EV.bug4.ruleName}" sets Status = Closed on edit; ticket #${EV.bug4.no} is in a blueprint: every execution "Fired", status stays ${EV.bug4.statusAfter}`, [0, 0, 1600, 900], [])],
    rows: [[1, 'Rule sets Status on a ticket the blueprint controls', 'Status unchanged (correct) and the execution shows the field update was skipped because a blueprint controls Status', `Status unchanged (${EV.bug4.statusAfter}); executions logged as ${[...new Set(EV.bug4.executions.map(e => e.outcome))].join(', ')} ×${EV.bug4.executions.length} with no skip note`, 'BUG']] },
  'BP-R5': { ...base, label: 'BUG', verdict: 'FAIL', out: 'BP-R5-other-department-owner-not-agent-saved.png', ticket: 'Blueprint · TB-12', title: 'A transition owner listed under another department is saved even though they are not an agent of that department',
    panels: [P('EV5-api.png', 'Owner of "QA Review" = Tech, agent Test User 1 (not a Tech agent): saved; ticket shared to Tech at Full; Test User 1 is offered nothing and gets BLUEPRINT_NOT_OWNER', [0, 0, 1600, 900], [])],
    rows: [[1, 'Save the transition', 'Refused or warned: "Test User 1 is not an agent of Tech" (unknown and view-only owners are already refused)', 'Saved (201), no warning', 'BUG'],
      [2, 'Ticket enters the state; Test User 1 opens it', 'n/a once the save is refused', 'Ticket shared with Tech (Full), but Test User 1 never sees the step', 'BUG']] },
};
const SPECDIR = path.join(RUN, 'evidence/specs'); fs.mkdirSync(SPECDIR, { recursive: true }); fs.mkdirSync(path.join(RUN, 'evidence/annotated'), { recursive: true });
for (const [k, s] of Object.entries(specs)) {
  const f = path.join(SPECDIR, k + '.json'); fs.writeFileSync(f, JSON.stringify({ key: k, ...s }, null, 1));
  console.log(execFileSync('node', [BUILDER, f]).toString().trim());
  fs.copyFileSync(path.join(OUTDIR, s.out), path.join(RUN, 'evidence/annotated', s.out));
}
