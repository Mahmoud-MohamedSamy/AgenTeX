// Builds screenshots/annotated/NDC-2275-retest-PARTIAL.png, plane-draft.json/html and report.html. Posts nothing.
const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const b64=f=>'data:image/png;base64,'+fs.readFileSync(path.join(RUN,f)).toString('base64');
const IMG='screenshots/annotated/NDC-2275-retest-PARTIAL.png';
const ENV='staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; owner, agents Mahmoud Samy (A2) and Dev Team 2 (A3) signed in, Test User 1 (A1) offline · QA AS6 Dept A / Dept B, team QA AS6 Team A';

// [check, expected, now, result]
const FIX=[
 ['New Ticket form, Ticket Owner cleared (the failing step)','Round robin assigns','Form sends owner null; #1660 → A2 by rule "QA RT15 2275 seq", trigger "A new ticket"','PASS'],
 ['API create, owner null / source "api" with no owner','Round robin assigns','#1439 → A2, #1440 → A3','PASS'],
 ['Web form, real iframe submission (GEN-13)','Same rule assigns','#1668 → A3 by the rule; no matching rule: #1669 Unassigned','PASS'],
 ['Form with owner left as shown; ticket created with an owner','Owner kept, round robin does not act','#1662 stays with the signed-in agent; #1442 stays A1','PASS'],
 ['Pool offline at create','Waits Unassigned, not given to the creator','#1444 Unassigned','PASS'],
];
const RR=[
 ['Sequential, 3 agents, 6 tickets on create','A1, A2, A3, A1, A2, A3','A1, A2, A3, A1, A2, A3','PASS'],
 ['A1 offline, 4 tickets','A2, A3, A2, A3; A1 SKIPPED','A2, A3, A2, A3; History shows "Test User 1 (SKIPPED)" when A1\'s turn was passed (#1661)','PASS'],
 ['Load based (open tickets A2 88, A3 74)','Fewest open first','A3, A3, A3, A3','PASS'],
 ['Skill added on create + skill round robin','Same event','#1469 got skill QA AS6 sk2 → A2 (holds the skill)','PASS'],
 ['Two round robin rules match','First in the list acts','A2, A2; second rule (A3) never used','PASS'],
 ['Threshold over limit; agent threshold overrides; switch off keeps the row','Backlog; override; row kept, not used','Waits; A2 = 200 got A2, A2, A2; row kept and ticket waits','PASS'],
 ['Assign backlogs','Assigned within 1 minute of room appearing','Next backlog ticket to A2 in 34 s (oldest first, #1345)','PASS'],
 ['Assign tickets on closure','Next backlog ticket to the closer at once','A2 at threshold closes #1687 → waiting #1689 to A2 in 1.8 s, trigger backlog','PASS'],
 ['Both backlog options off','Stays unassigned','A2 closes #1688, A2\'s open count 159 → 158, #1690 still waiting after 20 s','PASS'],
 ['Incoming mode "backlog first"','Unassigned at create, assigned by the run','#1664 Unassigned at 4 s, A2 at about 110 s, trigger backlog (run limit raised to 50 so older waiting QA tickets would not hold it up)','PASS'],
];
const ORD=[
 ['Direct + round robin both match','Direct only','#1457 → A1, no round robin entry; A1 is offline and still assigned','PASS'],
 ['Direct: preset owner; Mark as Unassigned','Owner kept; next direct rule not used','#1458 stays A3; #1464 Unassigned','PASS'],
 ['Direct moves to Dept A unassigned, Dept A round robin','Assigned in the same event','#1461 → A2, entries "direct" then "round robin", trigger "moved"','PASS'],
 ['Direct rule on Ticket Update','Unowned assigned, owned kept','Unowned → A2 after the update; owned stays A3','PASS'],
 ['Direct to team','Team, no owner; members told once','#1460 team QA AS6 Team A; A2 and A3 one team notice each','PASS'],
 ['EO-2 workflow "owner is A1" after direct rule','Fires in the same event','#1509 direct A1, then the workflow set A3','PASS'],
 ['EO-3 workflow sets owner, round robin also matches','Round robin leaves it','#1510 A3, no round robin entry','PASS'],
 ['EO-4/5 direct A2, then workflow A3','History both; only A3 notified','#1511 History A2 then A3; A3 notified, A2 not','PASS'],
 ['Direct master switch off / on (rules stay listed)','Off: no action. On: acts. Audit entry','#1455 Unassigned; #1456 → A2; both changes in the Audit Log','PASS'],
 ['Speed (NF-4)','Owner within 5 s','Direct: at first read. Round robin: 0.7 to 2.0 s after the create returned, 8 tickets','PASS'],
];
const FAILS=[
 ['NF-3: 20 tickets created at the same moment, pool of 2, each with room for 5, 5 runs','5, 5 and 10 waiting, every run','Run 1: 6, 5, 9 · run 2: 5, 5, 10 · run 3: 5, 5, 10 · run 4: 5, 6, 9 · run 5: 5, 5, 10. One agent went one over the threshold in 2 of 5 runs. No ticket had two assignment entries','FAIL'],
 ['GEN-13: import with rules on','"import (rules on) is assigned by the same matching rule"','The Assign step has no rule to choose, only "Trigger automation and process management". No-owner rows go to the importer, box ticked or not: #1681, #1682, #1683, #1684','DECISION'],
];
const ALL=[...FIX,...RR,...ORD,...FAILS];
const count=k=>ALL.filter(r=>r[3]===k).length;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const tag=r=>r==='PASS'?'#137333':r==='FAIL'?'#c5221f':'#b06000';
const table=rows=>`<table class="t"><tr><th>Check</th><th>Expected (ticket)</th><th>Now</th><th>Result</th></tr>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td style="color:${tag(r[3])};font-weight:700">${r[3]}</td></tr>`).join('')}</table>`;
const NOTES=[
 'A plain API create with no owner and no source now goes to its creator (#1441). The 6 Nov fix note said it would stay unassigned; NDC-2813 changed this on 8 Nov and says so.',
 'Round robin assigns just after the create returns, so the create response has no owner yet. NF-4\'s 5-second target is met, but NF-4 also says nobody sees the ticket unassigned first.',
 'History still shows the owner change twice ("Ticket Owner was updated" and "Ticket owner was changed"), as marked in the last retest.',
];
const NOTRUN=[
 'Tickets arriving by email: left out for now, as agreed.',
 '30-day rule: tickets cannot be aged on staging.',
 'Not repeated today, passed on 6–7 Nov: rule form validation, criteria operators and fields, agent removed from a rule, Arabic, keyboard names, stale save, conversion of old rules, department alerts.',
];
const li=a=>'<ul>'+a.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>';
const plain=rows=>'<ul>'+rows.map(r=>`<li>${esc(r[0])} → ${esc(r[2])} [${r[3]}]</li>`).join('')+'</ul>';
const comment=`<p><strong>Retest PARTIAL — 8 Nov 2026</strong></p><p>Environment: ${esc(ENV)}<br>Method: API and screen</p>
<p>The fix works: round robin now assigns tickets on create. Two items are still open: the threshold can be exceeded by one when tickets arrive at the same moment (NF-3), and import has no way to run assignment rules (GEN-13).</p>
<p><strong>Checked: round robin on create</strong></p>${plain(FIX)}<p><strong>Checked: round robin</strong></p>${plain(RR)}<p><strong>Checked: direct rules and execution order</strong></p>${plain(ORD)}
<p><strong>Still failing</strong></p><ul><li>${esc(FAILS[0][0])}: expected ${esc(FAILS[0][1])}; actual ${esc(FAILS[0][2])}.</li></ul>
<p><strong>To decide</strong></p><ul><li>${esc(FAILS[1][0])}: the requirement says ${esc(FAILS[1][1])}; actual ${esc(FAILS[1][2])}. The 6 Nov fix note says the importer rule is intended.</li></ul>
<p><strong>Notes</strong></p>${li(NOTES)}<p><strong>Not run</strong></p>${li(NOTRUN)}<p>Evidence: ${path.basename(IMG)} (attached)</p>`;
const CLEAN={tickets:'About 190 tickets named "QA RT15 2275 …" (ids in ledger.md), then their Recycle Bin entries',rules:'21 assignment rules and 3 workflows named "QA RT15 2275 …"',files:'Saved sign-in files out/owner.json, a2.json, a3.json'};
const draft={note:'DRAFT ONLY. Nothing posted.',item:'NDC-2275',current_state:'Ready For Test',proposed_state:'Bug',comment_html:comment,attach:IMG,cleanup:CLEAN};
fs.writeFileSync(path.join(RUN,'plane-draft.json'),JSON.stringify(draft,null,1));

const CSS=`body{font:14px/1.5 system-ui,"Segoe UI",Roboto,sans-serif;background:#f6f7f9;color:#1d2330;margin:0}.wrap{max-width:1180px;margin:auto;padding:22px}.box{background:#fff;border:1px solid #e2e5ea;border-radius:10px;padding:16px 20px;margin:14px 0}
table.t{border-collapse:collapse;width:100%;font-size:13px}table.t th{background:#eef0f4;text-align:left}table.t td,table.t th{border:1px solid #dfe2e7;padding:6px 9px;vertical-align:top}.warn{color:#b00;font-weight:600}img.ev{width:100%;border:1px solid #ccc;border-radius:6px}.meta td{padding:3px 14px 3px 0}.meta td:first-child{color:#5d6677}h2{margin:6px 0 10px;font-size:17px}`;

(async()=>{
 const bx=(n,l,t,w,h,sc,side='r')=>`<div style="position:absolute;left:${l*sc}px;top:${t*sc}px;width:${w*sc}px;height:${h*sc}px;border:3px solid #e01e1e;border-radius:4px"></div><div style="position:absolute;left:${(side==='r'?l+w:l)*sc-(side==='r'?2:26)}px;top:${t*sc-13}px;background:#e01e1e;color:#fff;font:700 14px/24px system-ui;width:24px;height:24px;border-radius:50%;text-align:center">${n}</div>`;
 const panel=(title,f,W,Hh,boxes,sc)=>`<div style="flex:1"><div style="font-weight:600;margin:0 0 6px">${title}</div><div style="position:relative;width:${W*sc}px;height:${Hh*sc}px;overflow:hidden;border:1px solid #bbb;border-radius:6px"><img src="${b64(f)}" style="width:${W*sc}px;display:block">${boxes}</div></div>`;
 const sc=.53;
 const html=`<!doctype html><meta charset=utf-8><style>${CSS}body{background:#fff;width:2630px}.wrap{max-width:none;padding:20px 24px}</style><div class=wrap>
 <div style="background:#b06000;color:#fff;padding:12px 18px;border-radius:8px;font-size:20px;font-weight:700">NDC-2275 retest: PARTIAL · 8 Nov 2026 · NDC-Staging</div>
 <div style="display:flex;gap:18px;margin:14px 0">
 ${panel('Create Ticket form, owner cleared','screenshots/raw/2275-skipped-form.png',1600,1000,bx(1,1106,746,303,38,sc),sc)}
 ${panel('The saved ticket, History','screenshots/raw/2275-skipped-history.png',1600,1000,bx(2,380,450,180,55,sc)+bx(3,706,282,300,192,sc)+bx(4,712,434,272,20,sc,'l'),sc)}
 ${panel('Desk import, Assign step','screenshots/raw/imp-s3.png',1600,1000,bx(5,430,232,740,60,sc),sc)}
 </div>
 <p style="margin:4px 0 10px"><b>1</b> Owner cleared, sent as null. <b>2</b> Saved owner is the round robin agent, not the creator. <b>3</b> History: rule type, rule, method, trigger "A new ticket". <b>4</b> Offline agent listed as SKIPPED. <b>5</b> Import offers no assignment rule to choose.</p>
 ${table([...FIX.slice(0,3),RR[0],RR[1],ORD[0],ORD[6],ORD[7],RR[6],RR[7],...FAILS])}
 <p style="color:#5d6677;margin-top:8px">${count('PASS')} checks passed, ${count('FAIL')} failed, ${count('DECISION')} to decide; this image shows the main ones, the rest are in the comment. A1 Test User 1, A2 Mahmoud Samy, A3 Dev Team 2. Zoho was not compared in this retest.</p></div>`;
 const b=await chromium.launch({headless:true,channel:'msedge'});const pg=await b.newPage({viewport:{width:2630,height:900}});await pg.setContent(html,{waitUntil:'load'});await pg.waitForTimeout(500);
 fs.mkdirSync(path.join(RUN,'screenshots/annotated'),{recursive:true});await pg.screenshot({path:path.join(RUN,IMG),fullPage:true});await b.close();
 const img=b64(IMG);
 fs.writeFileSync(path.join(RUN,'plane-draft.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Plane draft NDC-2275</title><style>${CSS}</style></head><body><div class=wrap>
 <h1 style="margin:0 0 4px">Plane draft: NDC-2275 retest</h1><p class=warn>Draft only. Nothing is posted until you approve.</p>
 <div class=box><table class=meta><tr><td>Ticket</td><td><b>NDC-2275</b> Assignment Rules: Direct Assignment and Round Robin (requirements)</td></tr><tr><td>State</td><td>Ready For Test → <b>Bug</b> (proposed, your call)</td></tr><tr><td>Attachment</td><td>${path.basename(IMG)}</td></tr></table></div>
 <div class=box><h2>Comment, exactly as it would be posted</h2>${comment}</div>
 <div class=box><h2>Attached image</h2><a href="${img}" target="_blank"><img class=ev src="${img}" alt="NDC-2275 evidence"></a></div>
 <div class=box><h2>Cleanup after posting</h2>${li(Object.values(CLEAN))}<p>The Direct Assignment master switch stays OFF as I found it (another run turned it off at 14:42 UTC).</p></div></div></body></html>`);
 fs.writeFileSync(path.join(RUN,'report.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>NDC-2275 retest</title><style>${CSS}</style></head><body><div class=wrap>
 <h1 style="margin:0 0 4px">NDC-2275 retest: PARTIAL</h1><p>8 Nov 2026 · ${esc(ENV)}</p>
 <div class=box><b>${count('PASS')} passed, ${count('FAIL')} failed, ${count('DECISION')} to decide.</b> The bug the ticket came back for is fixed: round robin assigns on create from the form, the API and a real web form.</div>
 <div class=box><h2>Open items</h2>${table(FAILS)}</div>
 <div class=box><h2>Round robin on create</h2>${table(FIX)}</div><div class=box><h2>Round robin</h2>${table(RR)}</div><div class=box><h2>Direct rules and execution order</h2>${table(ORD)}</div>
 <div class=box><h2>Notes</h2>${li([...NOTES,'Import review: a file with a Ticket Owner the import could not match showed "Rows with errors 0" and "0 of 3 rows have errors" above a list with 1 error (Row 4, "No eligible user matches"). Whether the name should have matched was not checked.'])}</div>
 <div class=box><h2>Not run</h2>${li(NOTRUN)}</div>
 <div class=box><h2>How the run touched the tenant</h2>${li(['Direct Assignment master switch: found OFF, switched ON for two short windows for the direct rule tests, back OFF (checked). All other direct rules were inactive, and my rules match only "RT15…" subjects.','Dept A Round Robin Preferences: changed during tests, restored and compared with the saved copy: identical.','The backlog tests also assigned older QA tickets that were waiting in Dept A, such as #1345, to A2 and A3.','A3\'s sign-in was ended during the run, probably by the other run using that account. I did not sign in again; concurrency runs 2 to 5 used "offline agents allowed" so both agents stayed eligible. Run 1 had A2 and A3 online.','A sixth concurrency run hit a staging connection reset and is not counted.'])}</div>
 <div class=box><h2>Evidence</h2><a href="${img}" target="_blank"><img class=ev src="${img}" alt="NDC-2275 evidence"></a></div></div></body></html>`);
 console.log(JSON.stringify({pass:count('PASS'),fail:count('FAIL'),decision:count('DECISION')}));
})().catch(e=>{console.error(e);process.exit(1)});
