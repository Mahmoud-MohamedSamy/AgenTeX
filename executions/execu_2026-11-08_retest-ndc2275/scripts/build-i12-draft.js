const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
const title='Assignment Rules | Round robin threshold counts the agent\'s tickets in every department and On Hold tickets';
const d=`<h3>Summary</h3>
<p>The round robin thresholds (Department wise threshold and Agent level threshold) count an agent's open tickets in <strong>every department</strong>, and count <strong>On Hold</strong> tickets too. The help text says "Maximum number of open tickets an agent <em>in the department</em> can handle at any given time". Zoho Desk, with the same help text, counts only the agent's Open tickets in the department of the rule. As a result, an agent who works in several departments is treated as full and new tickets wait in the backlog although the agent is under the limit in that department.</p>
<h3>Steps to Reproduce</h3>
<ol>
<li>Pick an agent who has open tickets in more than one department (NDC-Staging: Test User 1 has 6 open in QA AS6 Dept B and 82 in all departments).</li>
<li>Setup › Assignment Rules › Round Robin, department QA AS6 Dept B: add a round robin rule on Ticket Create with this agent in the pool.</li>
<li>Round Robin Preferences: turn on Department wise threshold and set it to 7 (one more than the agent's open tickets in Dept B). Allow offline agents if the agent isn't signed in.</li>
<li>Create a ticket in Dept B that matches the rule, with no owner.</li>
</ol>
<h3>Expected Result</h3>
<p>The agent has 6 open tickets in Dept B, under the threshold of 7, so the ticket is assigned to the agent, as the help text says and as Zoho Desk does. On Hold tickets don't count towards the threshold.</p>
<h3>Actual Result</h3>
<ul>
<li>The ticket waits Unassigned in the backlog (#1758, 9 Nov). It is assigned only when the threshold is above the agent's open tickets in <strong>all</strong> departments (threshold 83 → #1759 assigned to Test User 1).</li>
<li>On Hold tickets are counted too (7 Nov: with one of the agent's tickets On Hold, a threshold equal to the count including it sends the ticket to the backlog). Closed tickets are not counted.</li>
<li>The same happens with the Agent level threshold (7 Nov, rule "QA AS6 F14 threshold": Dept A 60 + Dept B 6 → 66 counted).</li>
</ul>
<h3>Zoho Desk (checked live, 9 Nov)</h3>
<ul>
<li>Department wise threshold 2; the agent had 1 open ticket in the department and 2 in another department (Marketing): the new ticket was assigned by the rule (#108).</li>
<li>Control: once the agent had 2 open tickets in the department, the next ticket waited Unassigned (#109).</li>
<li>With one of the two set On Hold, the next ticket was assigned (#110): On Hold is not counted.</li>
</ul>
<h3>Environment</h3>
<p>staging-desk.taviportal.com, tenant NDC-Staging, owner account, Edge; Zoho Desk test account (techsolutionsegypt), department Haytham Mohamed. Test data was removed after the checks.</p>
<p>Evidence: I12-threshold-counts-all-departments-vs-zoho.png (attached)</p>`;
const j={note:'DRAFT ONLY. Nothing posted.',name:title,priority:'medium',state:'Bug',label:'Assignment Rules',module:'Desk',cycle:'Sprint 15',assignees:'same three as NDC-2811..2814, NDC-2821',relates:['NDC-2275','NDC-1978'],description_html:d,attach:'screenshots/annotated/I12-threshold-counts-all-departments-vs-zoho.png'};
fs.writeFileSync(path.join(RUN,'plane-draft-I12.json'),JSON.stringify(j,null,1));
const img='data:image/png;base64,'+fs.readFileSync(path.join(RUN,j.attach)).toString('base64');
fs.writeFileSync(path.join(RUN,'plane-draft-I12.html'),`<!doctype html><meta charset="utf-8"><title>I-12 bug draft</title><style>body{font:15px/1.55 Segoe UI,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#111}.box{border:1px solid #ccc;border-radius:8px;padding:16px;margin:12px 0}.m{color:#555;font-size:13px}img{max-width:100%;border:1px solid #ddd}h3{margin:18px 0 6px}</style>
<h2>Plane draft: new bug (I-12)</h2><p class="m">DRAFT ONLY, not posted.</p><div class="box"><p><strong>${title}</strong></p><p class="m">Priority: Medium · State: Bug · Label: Assignment Rules · Module: Desk · Cycle: Sprint 15 · Assignees: same three as NDC-2811..2814 and NDC-2821 · Relates to NDC-2275, NDC-1978</p>${d}</div><h3>Attachment</h3><img src="${img}">`);console.log('ok');
