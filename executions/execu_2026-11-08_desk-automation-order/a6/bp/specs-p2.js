// Writes the four annotate specs for BP-P2-1..4 and builds the images.
const fs = require('fs'); const { execFileSync } = require('child_process');
const ENV = 'TAVI: staging-desk.taviportal.com, org Anyware, owner, QA WF Dept R (QA records, deleted after) · Zoho: Zoho Desk Enterprise trial, Setup › Blueprint (read only)';
const base = { label: 'BUG', verdict: 'FAIL', date: '2 Nov 2026', env: ENV };
const S = {
  'P2-1': { ...base, out: 'BP-P2-1-vs-zoho.png', ticket: 'BP-P2-1', taviHead: 'TAVI Desk (API log, designer)', zohoHead: 'Zoho Desk (State Level SLA)',
    title: 'The API saves a state warning that is not before the time limit; live tickets lose the warning',
    panels: [
      { img: 'P2-1-api.png', caption: 'TAVI API: warning = limit, warning > limit and warning without a limit all saved (201); live ticket gets no warning time', crop: [0, 0, 1600, 490], boxes: [] },
      { img: 'zoho-state-sla-escalation.png', caption: 'Zoho: SLA time is picked from lists; escalation is set Before / On Time / After that time', crop: [1130, 160, 470, 320], boxes: [{ b: [1140, 255, 1445, 305], n: 1 }, { b: [1155, 390, 1250, 432], n: 1 }] },
      { img: 'P2-1-ui.png', caption: 'TAVI designer of the saved blueprint: only when opened does it say "1 issue to fix before publishing"', crop: [300, 110, 1300, 260], boxes: [{ b: [312, 124, 1228, 182], n: 2 }, { b: [1254, 268, 1586, 352], n: 2 }] }],
    rows: [
      [1, 'Saving a warning that is not before the time limit', 'Time and escalation come from fixed choices (Before / On Time / After the SLA time), so a warning after the limit cannot be set.', 'POST blueprint with warning 120 min and limit 120, warning 120 and limit 60, or a warning and no limit: all answer 201 Created and are saved as sent. The designer would block the same values.', 'BUG'],
      [2, 'A live blueprint with that state', 'Not possible to save.', 'The blueprint can be made active and tickets enter it. The ticket gets the due time but warning_due_at is null, so the warning actions never run. The designer shows the problem only when someone opens it.', 'BUG']] },
  'P2-2': { ...base, out: 'BP-P2-2-vs-zoho.png', ticket: 'BP-P2-2', taviHead: 'TAVI Desk (API log, designer)', zohoHead: 'Zoho Desk (State Level SLA)',
    title: 'The API saves a negative state time limit; the designer shows "No limit" and tickets get no timer',
    panels: [
      { img: 'P2-2-api.png', caption: 'TAVI API: slaMinutes -1 saved (201); live ticket has no due time', crop: [0, 0, 1600, 490], boxes: [] },
      { img: 'zoho-state-sla-escalation.png', caption: 'Zoho: the state SLA time is picked from a list of positive values', crop: [1130, 160, 470, 320], boxes: [{ b: [1140, 255, 1445, 305], n: 1 }] },
      { img: 'P2-2-ui.png', caption: 'TAVI designer of the saved blueprint: Time limit shows "No limit", no issue banner', crop: [300, 60, 1300, 560], boxes: [{ b: [1254, 268, 1586, 326], n: 2 }] }],
    rows: [
      [1, 'Saving a negative time limit', 'The SLA time is chosen from a list, so a negative or zero time cannot be entered.', 'POST blueprint with slaMinutes -1 answers 201 Created and stores -1 (0 is stored too). Decimals and text are refused, so only the sign check is missing.', 'BUG'],
      [2, 'What the admin and the ticket see', 'Not possible to save.', 'The blueprint can be made active; tickets enter with no due time. The designer shows "No limit" with no error, so the saved -1 is hidden.', 'BUG']] },
  'P2-3': { ...base, out: 'BP-P2-3-vs-zoho.png', ticket: 'BP-P2-3', taviHead: 'TAVI Desk (API log, designer)', zohoHead: 'Zoho Desk (Add Transition panel)',
    title: 'The API saves an automatic move that points at a transition from another state; it never runs',
    panels: [
      { img: 'P2-3-api.png', caption: 'TAVI API: auto-move on Open pointing at Escalated → Closed saved (201) and never scheduled; the same mistake in the reply trigger is refused', crop: [0, 0, 1600, 720], boxes: [] },
      { img: 'zoho-auto-transition-rating.png', caption: 'Zoho: Auto Transition is a switch on the transition itself', crop: [1130, 320, 470, 380], boxes: [{ b: [1140, 335, 1500, 420], n: 1 }] },
      { img: 'P2-3-ui.png', caption: 'TAVI designer of the saved blueprint: Open shows a "5m" timer, no issue banner, no auto-move setting in the panel', crop: [300, 60, 1300, 560], boxes: [{ b: [486, 544, 524, 568], n: 2 }, { b: [1254, 240, 1586, 330], n: 2 }] }],
    rows: [
      [1, 'Automatic move set to a transition that starts at another state', 'Auto Transition is switched on inside the transition, so it always belongs to the state that transition starts from.', "State Open with autoTransitionId \"esc2\" (Escalated → Closed) answers 201 Created and is saved. The same mistake in \"When the customer replies\" is refused: \"'esc2' is not a transition out of this state\".", 'BUG'],
      [2, 'A ticket in that state', 'Not possible to save.', 'The blueprint can be made active; the ticket enters at Open, auto_due_at stays null and after 100 s (move set to 1 minute) it is still at Open. The designer shows a "5m" timer on Open as if it works.', 'BUG']] },
  'P2-4': { ...base, out: 'BP-P2-4-vs-zoho.png', ticket: 'BP-P2-4', taviHead: 'TAVI Desk (API log, ticket #1067)', zohoHead: 'Zoho Desk (ticket #101 in a blueprint)',
    title: 'A workflow rule can change Status on a ticket the blueprint controls; the ticket closes and leaves the blueprint',
    panels: [
      { img: 'P2-4-api.png', caption: 'TAVI API: rule saved; direct Status change refused (422); after a transition the rule closes the ticket and it leaves the blueprint', crop: [0, 0, 1600, 560], boxes: [] },
      { img: 'zoho-ticket-in-blueprint.png', caption: 'Zoho: Status shows a lock while the blueprint controls it; the blueprint strip shows the current state', crop: [0, 0, 1600, 1000], boxes: [{ b: [352, 420, 436, 468], n: 2 }, { b: [652, 916, 1600, 972], n: 3 }] },
      { img: 'P2-4-ui.png', caption: 'TAVI ticket #1067 after the transition: Status Closed, no Steps card, "Reopen ticket"', crop: [0, 56, 1600, 944], boxes: [{ b: [386, 538, 472, 572], n: 3 }, { b: [1180, 108, 1232, 130], n: 3 }, { b: [1436, 954, 1584, 990], n: 3 }] }],
    rows: [
      [1, 'Workflow rule that updates Status', 'Status is locked while a blueprint controls the ticket; only its transitions change it.', 'A rule (On Edit, Field Update Status = Closed) is saved with no warning that Status is controlled by a blueprint.', 'BUG'],
      [2, 'Changing Status directly', 'Locked (lock icon on Status).', 'Refused: PATCH status → 422 "Governed picklist field can only change via blueprint transition execution."', 'SAME'],
      [3, 'After running a transition', 'The ticket stays in the blueprint at the new state.', 'Transition Open → Escalated runs, then the rule sets Status to Closed: ticket #1067 is Closed and has left the blueprint (no Steps card, "Reopen ticket"). The blueprint lock is bypassed through normal admin setup.', 'BUG']] } };
for (const [k, s] of Object.entries(S)) {
  const f = `spec-${k}.json`; fs.writeFileSync(f, JSON.stringify(s, null, 1));
  console.log(execFileSync('node', ['annotate-vs-zoho.js', f], { encoding: 'utf8' }).trim());
}
