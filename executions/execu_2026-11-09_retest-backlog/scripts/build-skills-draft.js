const fs=require('fs'),path=require('path');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog';
const title='Ticket page | No Skills tab to see and associate skills on a ticket (Zoho Desk has one)';
const desc='<h2>Summary</h2><p>The ticket page has no Skills tab. In Zoho Desk the side rail of a ticket has a Skills icon that opens a Skills panel: it lists the skills on the ticket (or "No skills yet") and has <strong>+ Associate Skills</strong>, with the text "Associate skills with this ticket to automatically assign it to agents who possess those skills". In TAVI Desk the side rail has no Skills icon; skills show only as the plain "Skills" field under Case Information.</p><h2>Steps</h2><ol><li>Sign in to Desk staging and open any ticket (for example #1767 or #955).</li><li>Look at the icons in the side rail next to Ticket Properties.</li><li>Scroll Ticket Properties to Case Information.</li></ol><h2>Expected (as in Zoho Desk)</h2><ul><li>A Skills icon in the ticket side rail.</li><li>The Skills panel lists the skills on the ticket, or "No skills yet".</li><li>"+ Associate Skills" adds skills to this ticket from the panel, so skill-based assignment can use them.</li></ul><h2>Actual</h2><ul><li>The side rail has no Skills icon (ticket #955 shows only Ticket Properties and AI assist).</li><li>Skills appear only as the "Skills" field under Case Information ("-" when empty).</li><li>No Associate Skills action on the ticket page.</li></ul><h2>Environment</h2><ul><li>staging-desk.taviportal.com, 9 Nov 2026, Edge.</li><li>Seen on two tenants: ndc-staging-owner (ticket #1767) and Anyware (ticket #955).</li><li>Zoho Desk reference: ticket #100, 9 Nov 2026.</li></ul><h2>Related</h2><ul><li>NDC-2752 (Done): Desk Skills missing functions; gap 7 covered recalculating and assigning one ticket.</li><li>NDC-2805: Desk Skills follow-ups (does not cover this).</li></ul><h2>Evidence</h2><ul><li><strong>ticket-skills-tab-vs-zoho.png</strong>: TAVI (left) vs Zoho (right), numbered to match.</li></ul>';
fs.writeFileSync(R+'/skills-draft.json',JSON.stringify({title,priority:'medium',state:'Backlog',assignee:'MahmoudMohamed',module:'Desk',label:'Assignment Rules',relates:['NDC-2752','NDC-2805'],attachment:'evidence/annotated/ticket-skills-tab-vs-zoho.png',description_html:desc},null,1));
const img='data:image/png;base64,'+fs.readFileSync(R+'/evidence/annotated/ticket-skills-tab-vs-zoho.png').toString('base64');
const e=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Ticket Skills Draft</title><style>
:root{--bg:#f6f7f9;--fg:#1c2330;--card:#fff;--mut:#5b6573;--bd:#dfe3e8;--warn:#fff4e5;--warnb:#f0b35a}
@media (prefers-color-scheme:dark){:root{--bg:#14171c;--fg:#e6e9ee;--card:#1d2128;--mut:#9aa3af;--bd:#2f3540;--warn:#3a2c14;--warnb:#a8742a}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,Segoe UI,sans-serif}main{max-width:1100px;margin:0 auto;padding:24px 16px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:18px 20px;margin:14px 0}h1{font-size:22px;margin:0 0 4px}.mut{color:var(--mut)}
.banner{background:var(--warn);border:1px solid var(--warnb);border-radius:10px;padding:12px 16px}table{border-collapse:collapse;width:100%}td{border-top:1px solid var(--bd);padding:7px 8px;vertical-align:top}td:first-child{width:150px;color:var(--mut)}
img{max-width:100%;border:1px solid var(--bd);border-radius:6px}.desc h2{font-size:16px;margin:16px 0 4px}</style></head><body><main>
<h1>Draft bug: no Skills tab on the ticket page</h1><div class="mut">Built 9 Nov 2026 from your two screenshots, plus a check on staging</div>
<div class="banner" style="margin-top:14px"><strong>Not posted.</strong> Nothing has been sent to Plane. Say "post it" or tell me what to change.</div>
<div class="card"><table>
<tr><td>Title</td><td><strong>${e(title)}</strong></td></tr>
<tr><td>Project / state</td><td>NDC · Backlog</td></tr><tr><td>Priority</td><td>Medium (proposed)</td></tr>
<tr><td>Assignee</td><td>MahmoudMohamed (proposed; same as NDC-2752)</td></tr><tr><td>Module / label</td><td>Desk · Assignment Rules (proposed)</td></tr>
<tr><td>Relates to</td><td>NDC-2752 (Done), NDC-2805 (Backlog)</td></tr><tr><td>Attachment</td><td>ticket-skills-tab-vs-zoho.png</td></tr>
<tr><td>Duplicate check</td><td>Plane search "Skills": NDC-2821, 2805, 2752, 1978. None covers a Skills tab on the ticket page.</td></tr></table></div>
<div class="card desc"><h2 style="margin-top:0">Description (as it will appear)</h2>${desc}</div>
<div class="card"><h2 style="margin-top:0;font-size:16px">Attached image</h2><img src="${img}" alt="TAVI vs Zoho ticket skills panel"></div>
</main></body></html>`;
fs.writeFileSync(R+'/skills-draft.html',html);console.log('ok');
