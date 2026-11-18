// Builds RUN/new-findings.html: the new defects seen during the 17 Nov findings retest, with annotated evidence.
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(R, '../execu_2026-11-01_desk-golive/ticketmenu/report.src.html'), 'utf8').split('</style>')[0].replace(/<title>.*?<\/title>/, '<title>New Findings 17 Nov</title>') + '</style>';
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(R, 'screenshots/annotated', f)).toString('base64');
const F = [
  ['N1', 'Workflow Rules | Execution History cannot be reached from the app', 'Low', 'N1-execution-history-no-link.png',
    'The Execution History page works at /settings/workflow-executions, but nothing in the app links to it: not the Workflow Rules page (only "New Rule", tabs and filters), not a rule\'s own page, and not the Setup menu (the Automation section has no item for it). The app code registers the page, but no menu, button or link points to it. Admins can only open it by typing the address.',
    'Open Setup › Automation › Workflow Rules; look for a way to see past runs. Open a rule; look again. Check the Setup menu.', 'A "Execution History" link on the Workflow Rules page (or a Setup menu item), and a link from each rule to its own runs.'],
  ['N2', 'Workflow Rules | A rule saved through the API with another department\'s tag: the tag is silently not applied, and the run says Succeeded', 'Low', 'N2-api-tag-other-dept-silent.png',
    'The editor now offers only the rule\'s department tags (NDC-3058 fixed). The API still accepts another department\'s tag id (200). When the rule runs, that tag is not put on the ticket, but Execution History shows Add Tags "Succeeded" and still lists the dropped tag id under Target.',
    'PATCH a Desk rule limited to QA AO Dept A with Add Tags = Customer Support\'s "QA WF tag A". Edit a QA AO Dept A ticket so the rule runs. Read the ticket tags and the run.', 'The API refuses a tag of another department (422, like the editor), or the run shows the action as failed with the reason.'],
  ['N3', 'Contracts | After a department-only change, coverage counts the other department\'s plan as active', 'Low', 'N3-contract-coverage-other-plan.png',
    'Goes with F06 (department-only change accepted). After changing only a contract\'s department from Dept A to Dept B, the coverage check reports Dept A\'s support plan as active on the Dept B contract. In round 20 the same check said "no plan". Moving department and plan together, and refusing plan A on a Dept B contract, both work.',
    'Create a contract in Dept A with a Dept A plan. Change only its department to Dept B. Read GET /desk/sla/contracts/{id}/coverage.', 'The department-only change is refused (as in Zoho), or the plan is cleared and coverage shows no plan.'],
  ['N4', 'Tickets | Clone form shows Ticket Owner "Unassigned", but the saved clone is owned by the current user', 'Low', 'N4-clone-owner-form-vs-saved.png',
    'Cloning a ticket from a department where the current user is not an agent shows Ticket Owner "Unassigned" on the form. Saving without touching it creates the clone owned by the current user (the request sends no owner). What the form shows is not what is saved. Related to F13 (Zoho\'s Clone keeps the source owner, seen live 17 Nov).',
    'Open a ticket of QA RT19 SLA Dept owned by another agent, as the owner account (not an agent of that department). ⋮ › Clone. Look at Ticket Owner. Save. Look at the owner of the new ticket.', 'The saved owner matches the form. Matching Zoho, the clone keeps the source owner.'],
  ['N5', 'Departments | The disable dialog says tickets are kept, but they are moved to the "Transfer to" department', 'Low', 'N5-disable-dept-dialog-wording.png',
    'F07 is fixed: "Transfer and Disable" now moves the department\'s tickets to the chosen department. The dialog does not say so. It says "Its tickets, history and configuration are kept", and the transfer line mentions only agents and channels.',
    'Setup › Departments › ⋮ › disable a department that has tickets. Read the dialog.', 'The dialog says how many tickets will move to the chosen department.'],
  ['N6', 'Tickets | The first conversation of a ticket created without a contact shows "Unknown sender"', 'Low', 'N6-unknown-sender.png',
    'Tickets created by an agent with no contact (through the API, and from the Clone form) show the first message from "Unknown sender" with a "US" avatar.',
    'Create a ticket with no contact (API or Clone form). Open it and look at the Conversation tab.', 'The agent who created the ticket is shown as the sender, or no sender line is shown.'],
];
const html = css + `
<div class="wrap">
<header>
  <div class="eyebrow">New findings · seen during the 17 Nov findings retest · published 18 Nov 2026</div>
  <h1>Six new defects, none filed yet</h1>
  <p class="meta">TAVI NDC-Staging (staging-desk), Edge + API, owner account. Found while retesting the 17 Nov findings (report "Findings Retest 17 Nov"), N1 checked again on 18 Nov. Test data was deleted after. None of these is in Plane.</p>
  <div class="strip">
    <div class="stat fail"><b>${F.length}</b><span>new defects (all Low)</span></div>
    <div class="stat info"><b>2</b><span>dropped after checking</span></div>
  </div>
</header>
<section>
  <h2>Summary</h2>
  <div class="tbl"><table><thead><tr><th>Id</th><th>Finding</th><th>Sev</th></tr></thead><tbody>
  ${F.map(f => `<tr><td>${f[0]}</td><td>${f[1]}</td><td>${f[2]}</td></tr>`).join('\n  ')}
  </tbody></table></div>
</section>
<section>
  <h2>Findings</h2>
  ${F.map(f => `<article class="finding"><div class="head"><span class="id">${f[0]}</span><h3>${f[1]}</h3><span class="pill fail">Bug · ${f[2]}</span></div>
    <p>${f[4]}</p><p><b>Steps:</b> ${f[5]}</p><p><b>Expected:</b> ${f[6]}</p>
    <figure><img src="${img(f[3])}" alt="${f[0]} annotated evidence"><figcaption>${f[0]} · ${f[3]}</figcaption></figure></article>`).join('\n  ')}
</section>
<section>
  <h2>Dropped after checking</h2>
  <ul>
    <li><b>Execution History list shows rule ids instead of names:</b> already part of F15 (still failing), not a separate defect.</li>
    <li><b>CRM Recycle Bin search ignores the q= parameter:</b> the Recycle Bin page has no search box and never sends q (it uses Filters); q is simply not a supported API parameter. Not a defect.</li>
  </ul>
</section>
</div>`;
fs.writeFileSync(path.join(R, 'new-findings.html'), html); console.log('new-findings', html.length);
