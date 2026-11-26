const fs = require('fs'), path = require('path');
const DL = 'C:/Users/Dell/Downloads'; const kf = fs.readdirSync(DL).filter(f => /^secret-key-\d+\.csv$/.test(f)).sort().pop();
const KEY = fs.readFileSync(path.join(DL, kf), 'utf8').trim().split(/\r?\n/)[1].split(',')[3].replace(/"/g, '').trim();
const B = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';
const ID = '4f0d00a1-752b-463e-8736-d3aa648796f9';
const html = ['Retest 24 Nov 2026: Propose changes was turned on for all 134 setup areas that allow it (deployed as Tia v6), and Tia was asked once per area, as the Owner, to prepare a setup change ("add a new one named QA TIA PA &lt;area&gt; … prepare it as a setup change card"). Every card was rejected; nothing was created.',
 'Result: only 1 area out of 134 gave a Setup change card: CRM → Workflow rules.',
 '66 areas answered "I couldn\'t build this. Here\'s what is missing: … You can finish it yourself on this page: …". Many links point to the wrong page, e.g. Omnichannel Bots and Brands → /settings/automation/sla, Analytics Report folders → /settings/organization/email-templates, most Analytics areas → "/".',
 '19 areas were refused with the 4-recipe message (assignment_by_lead_source, approval_above_amount, task_on_lead_created, sla_by_priority); 33 said the area is not supported through the assistant; 10 asked for more details; 5 gave the "speak with one of our team" or "not responding" reply.',
 'Per-area table: TIA Retest Report (claude.ai artifact) and executions/execu_2026-11-24_tia-retest/out/pa-final.json in the QA repository.'].map(t => `<p>${t}</p>`).join('');
(async () => { const r = await fetch(`${B}/work-items/${ID}/comments/`, { method: 'POST', headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ comment_html: html }) }); console.log('NDC-3250 comment', r.status); })();
