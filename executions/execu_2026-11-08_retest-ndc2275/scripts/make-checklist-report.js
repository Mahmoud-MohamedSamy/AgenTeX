// Builds report-checklist-2026-11-10.html (self-contained) from out/e18-cl1.json, cl2 notes and out/e18-cl3.json + screenshots/raw/cl-*.png
const fs=require('fs'),path=require('path');const B=path.join(__dirname,'..');const RAW=path.join(B,'screenshots/raw');
const J=f=>{try{return JSON.parse(fs.readFileSync(path.join(B,'out',f),'utf8'))}catch(e){return {}}};
const C1=J('e18-cl1.json'),C2=J('e18-cl2.json'),C3=J('e18-cl3.json');
const img=(f,cap)=>{const p=path.join(RAW,f);if(!fs.existsSync(p))return `<p class="miss">Screenshot ${f} not captured.</p>`;return `<figure><img loading="lazy" src="data:image/png;base64,${fs.readFileSync(p).toString('base64')}" alt="${cap}"><figcaption>${cap}</figcaption></figure>`;};
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const cases=require(path.join(B,'out','checklist-verdicts.js'))({C1,C2,C3,img,esc});
const count=v=>cases.filter(c=>c.v===v).length;const V=['PASS','FAIL','BLOCKED','INFO'];
const badge=v=>`<span class="b ${v.toLowerCase()}">${v}</span>`;
const html=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Checklist Run Report</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mute:#5d6676;--line:#e2e5ea;--pass:#1f7a3f;--passb:#e5f4ea;--fail:#b42318;--failb:#fdecea;--blk:#8a5a00;--blkb:#fff4dc;--info:#2d5bd7;--infob:#e8eefc;--chip:#eef0f3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#14171c;--card:#1c2027;--ink:#e6e9ee;--mute:#a1a9b5;--line:#2c323b;--pass:#6fd394;--passb:#173323;--fail:#ff8a7a;--failb:#3a1d1a;--blk:#f3c062;--blkb:#3a2e14;--info:#8fb0ff;--infob:#1c2a4a;--chip:#262b33}}
:root[data-theme="dark"]{--bg:#14171c;--card:#1c2027;--ink:#e6e9ee;--mute:#a1a9b5;--line:#2c323b;--pass:#6fd394;--passb:#173323;--fail:#ff8a7a;--failb:#3a1d1a;--blk:#f3c062;--blkb:#3a2e14;--info:#8fb0ff;--infob:#1c2a4a;--chip:#262b33}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:20px 16px 60px}h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}h3{font-size:15px;margin:0}
.sub{color:var(--mute);font-size:13.5px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:16px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px}.card .n{font-size:26px;font-weight:700}
table{width:100%;border-collapse:collapse;font-size:13.5px;background:var(--card)}th,td{text-align:left;border-bottom:1px solid var(--line);padding:7px 9px;vertical-align:top}th{color:var(--mute);font-weight:600}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:10px}
.b{display:inline-block;font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap}.pass{background:var(--passb);color:var(--pass)}.fail{background:var(--failb);color:var(--fail)}.blocked{background:var(--blkb);color:var(--blk)}.info{background:var(--infob);color:var(--info)}
section.case{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:12px 0}section.case header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:6px}
code{background:var(--chip);padding:1px 5px;border-radius:4px;font-size:12.5px;word-break:break-all}ul{margin:6px 0;padding-left:20px}
figure{margin:10px 0}figure img{max-width:100%;border:1px solid var(--line);border-radius:6px}figcaption{color:var(--mute);font-size:12.5px}
details summary{cursor:pointer;color:var(--info);font-size:13.5px}.miss{color:var(--mute);font-style:italic}.note{border-left:3px solid var(--line);padding:4px 10px;color:var(--mute);font-size:13.5px}
</style></head><body><div class="wrap">
<h1>Manual checklist run: Email channel and 30-day rule</h1>
<div class="sub">Run by Claude on 10 Nov 2026, 09:30–15:10 UTC · staging-desk.taviportal.com (NDC-Staging, account ndc-staging-owner) · source: manual-checklist-email-e18.html (16 sections, 38 steps)</div>
<div class="cards">${V.map(v=>`<div class="card"><div class="n">${count(v)}</div>${badge(v)}</div>`).join('')}<div class="card"><div class="n">${cases.length}</div><span class="sub">sections</span></div></div>
<p class="note">Emails from the customer side (Gmail and mmohamed@anyware.software) were sent by the user; Claude did the TAVI side (agent replies, checks, screenshots). EM-09 used a temporary mail.tm inbox. Every test ticket was deleted and purged afterwards.</p>
<h2>Summary</h2><div class="tw"><table><thead><tr><th>Case</th><th>Title</th><th>Result</th><th>Key finding</th></tr></thead><tbody>
${cases.map(c=>`<tr><td><a href="#${c.id}">${c.id}</a></td><td>${esc(c.t)}</td><td>${badge(c.v)}</td><td>${c.k}</td></tr>`).join('')}</tbody></table></div>
<h2>Bugs and open points</h2>${require(path.join(B,'out','checklist-bugs.js'))({C1,C2,C3,esc})}
<h2>Case details</h2>
${cases.map(c=>`<section class="case" id="${c.id}"><header><h3>${c.id} · ${esc(c.t)}</h3>${badge(c.v)}</header>${c.d}</section>`).join('')}
<h2>How it was run</h2><ul>
<li>One owner sign-in for the whole run (the user signed out of the same account first).</li>
<li>Settings, rules, preferences and ticket moves were made through the same API calls the Setup pages use; replies were written and sent in the ticket page itself.</li>
<li>Screenshots were taken in a headless Edge browser at 1600×1000.</li>
<li>Email addresses in logs are masked; no passwords or tokens are in this report.</li></ul>
</div></body></html>`;
const out=path.join(B,'report-checklist-2026-11-10.html');fs.writeFileSync(out,html);console.log(out,Math.round(html.length/1024)+'KB');
