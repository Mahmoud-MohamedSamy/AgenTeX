// Specs for the new findings seen during the 17 Nov findings retest (published 18 Nov). Renders each with annotate.js.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname; const ENV = 'NDC-Staging · staging-desk · owner · Edge';
const specs = {
  N1: { out: 'N1-execution-history-no-link.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '18 Nov 2026',
    title: 'Workflow Rules | Execution History cannot be reached from the app; only by typing its address',
    env: ENV + ' · 18 Nov 2026 ~07:55 UTC',
    panels: [
      { img: 'wf-nav-execution-history.png', caption: 'Setup › Automation › Workflow Rules: only "New Rule", tabs and filters; no history link', crop: [60, 60, 1360, 520],
        boxes: [{ b: [280, 72, 1400, 120], n: 1, kind: 'FAIL' }, { b: [280, 140, 890, 215], n: 2, kind: 'FAIL' }] },
      { img: 'wf-executions-page.png', caption: 'Execution History at /settings/workflow-executions (typed); no Setup menu item highlighted', crop: [60, 60, 1360, 520],
        boxes: [{ b: [280, 72, 800, 120], n: 3, kind: 'INFO' }, { b: [62, 196, 266, 560], n: 4, kind: 'FAIL' }] }],
    rows: [
      [1, 'Workflow Rules page header', 'A way to open the run history', 'Only "New Rule"', 'FAIL'],
      [2, 'Tabs, filters, a rule\'s own page', 'History tab or link', 'All / Active / Inactive tabs and filters only; the rule page has no link either', 'FAIL'],
      [3, 'Execution History page', 'Reachable from the UI', 'Works only at the typed address /settings/workflow-executions', 'INFO'],
      [4, 'Setup menu, Automation section', 'Menu item', 'No Execution History item; the app code registers the page but nothing links to it', 'FAIL']] },
  N2: { out: 'N2-api-tag-other-dept-silent.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '17 Nov 2026',
    title: 'Workflow Rules | A rule saved through the API with another department\'s tag: the tag is silently not applied, and the run says Succeeded',
    env: ENV + ' (API) · rule QA RT21 WF F03 (On Edit, QA AO Dept A) · 17 Nov ~16:07 UTC · data deleted after',
    panels: [{ img: 'N2-api-card.png', caption: 'API requests and results', crop: [0, 0, 1600, 400],
      boxes: [{ b: [36, 214, 1564, 272], n: 1, kind: 'FAIL' }, { b: [36, 282, 1564, 340], n: 2, kind: 'FAIL' }, { b: [36, 350, 1564, 387], n: 3, kind: 'FAIL' }] }],
    rows: [
      [1, 'Save a rule with another department\'s tag (API)', 'Refused (422), as the editor only offers the department\'s tags', '200, stored', 'FAIL'],
      [2, 'Rule runs on a QA AO Dept A ticket', 'Tag applied, or the action fails with a reason', 'Tag silently not applied', 'FAIL'],
      [3, 'Execution History', 'Shows that the tag was not added', 'Add Tags "Succeeded", the dropped tag id still listed under Target', 'FAIL']] },
  N3: { out: 'N3-contract-coverage-other-plan.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '17 Nov 2026',
    title: 'Contracts | After a department-only change, coverage counts the other department\'s plan as active',
    env: ENV + ' (API) · contracts QA RT21 TK F06 1/2 · 17 Nov 16:03-16:04 UTC · goes with F06 · data deleted after',
    panels: [{ img: 'F06-2-api-card.png', caption: 'API requests and results', crop: [0, 0, 1600, 540],
      boxes: [{ b: [36, 167, 1564, 225], n: 1, kind: 'FAIL' }, { b: [36, 282, 1564, 340], n: 2, kind: 'FAIL' }, { b: [36, 397, 1564, 455], n: 3, kind: 'PASS' }, { b: [36, 465, 1564, 523], n: 4, kind: 'INFO' }] }],
    rows: [
      [1, 'Change only the department (A → B)', 'Refused, or the plan cleared', '200; Dept B contract keeps Dept A\'s plan (F06)', 'FAIL'],
      [2, 'Coverage of the Dept B contract', 'No plan of Dept A in force', 'Dept A\'s plan reported active (r20 showed "no plan")', 'FAIL'],
      [3, 'Control: put plan A on a Dept B contract', 'Refused', '422 SUPPORT_PLAN_OTHER_DEPARTMENT', 'PASS'],
      [4, 'Zoho Desk', 'Reference', 'Refuses a department change (r20 live check, not rechecked today)', 'INFO']] },
  N4: { out: 'N4-clone-owner-form-vs-saved.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '17 Nov 2026',
    title: 'Tickets | Clone form shows Ticket Owner "Unassigned", but the saved clone is owned by the current user',
    env: ENV + ' · source ticket in QA RT19 SLA Dept (the owner account is not an agent there), owner another agent · 17 Nov 17:57 Cairo · data deleted after',
    panels: [
      { img: 'F13-A-2-clone-form.png', caption: '⋮ › Clone: form shows Ticket Owner "Unassigned"', crop: [418, 440, 1000, 440],
        boxes: [{ b: [1000, 806, 1412, 850], n: 1, kind: 'INFO' }] },
      { img: 'F13-A-3-after-save.png', caption: 'After Save: #5081 owned by ndc-staging-owner (current user)', crop: [370, 60, 900, 560],
        boxes: [{ b: [380, 528, 650, 590], n: 2, kind: 'FAIL' }] }],
    rows: [
      [1, 'Ticket Owner on the clone form', 'What will be saved', '"Unassigned"', 'INFO'],
      [2, 'Owner of the saved clone', 'Same as the form (Unassigned)', 'ndc-staging-owner, the user who cloned (the request sends no owner)', 'FAIL'],
      [3, 'Zoho Desk (live 17 Nov)', 'Reference', 'Clone keeps the source ticket\'s owner (see F13)', 'INFO']] },
  N5: { out: 'N5-disable-dept-dialog-wording.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '17 Nov 2026',
    title: 'Departments | The disable dialog says tickets are kept, but they are moved to the "Transfer to" department',
    env: ENV + ' · Setup › Departments › QA RT21 BP Dept B › disable · 17 Nov ~16:00 UTC · data deleted after',
    panels: [{ img: 'F07-1-disable-dialog.png', caption: 'Disable dialog', crop: [300, 150, 1000, 520],
      boxes: [{ b: [646, 340, 1004, 400], n: 1, kind: 'FAIL' }, { b: [646, 414, 1004, 456], n: 2, kind: 'FAIL' }] }],
    rows: [
      [1, '"Its tickets, history and configuration are kept"', 'Says the tickets move to the chosen department', 'After "Transfer and Disable" the ticket moved to the chosen department (F07 fixed) - the dialog does not say so', 'FAIL'],
      [2, '"Choose an active department to transfer them to"', 'Names what is transferred', 'Talks only about agents and channels, not tickets', 'FAIL']] },
  N6: { out: 'N6-unknown-sender.png', priority: 'low', verdict: 'FAIL', label: 'NEW BUG', date: '17 Nov 2026',
    title: 'Tickets | The first conversation of a ticket created without a contact shows "Unknown sender"',
    env: ENV + ' · tickets created by the owner (API and Clone), no contact · 17 Nov 2026 · data deleted after',
    panels: [
      { img: 'F04-1-before.png', caption: '#4997 created through the API (agent view)', crop: [664, 60, 936, 340], boxes: [{ b: [680, 300, 1060, 340], n: 1, kind: 'FAIL' }] },
      { img: 'F13-A-3-after-save.png', caption: '#5081 created from the Clone form (owner view)', crop: [664, 60, 936, 340], boxes: [{ b: [680, 206, 1010, 246], n: 2, kind: 'FAIL' }] }],
    rows: [
      [1, 'Sender of the first message, ticket made through the API', 'The agent who created it (or no sender line)', '"Unknown sender" with a "US" avatar', 'FAIL'],
      [2, 'Same, ticket made from the UI (Clone)', 'The agent who created it', '"Unknown sender"', 'FAIL']] },
};
for (const [id, s] of Object.entries(specs)) { const f = path.join(D, id + '.json'); fs.writeFileSync(f, JSON.stringify({ ticket: id, ...s }, null, 1)); console.log(execFileSync('node', [path.join(D, '..', 'annotate.js'), f]).toString().trim()); }
