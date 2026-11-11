// Renders evidence/raw/agent-prefs-api.json as a 1600x1000 PNG (API responses seen by the Desk Agent).
const path=require('path'),fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const R=path.join(__dirname,'..');const o=JSON.parse(fs.readFileSync(R+'/evidence/raw/agent-prefs-api.json','utf8'));const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const row=(k,c)=>`<div class="r"><div class="h"><span class="s ${c.status<300?'ok':'no'}">${c.status}</span> ${esc(c.req)}</div><pre>${esc(c.body)}</pre></div>`;
const html=`<html><body style="margin:0;background:#0f172a;color:#e2e8f0;font:16px Consolas,monospace;width:1600px;height:1000px;padding:24px;box-sizing:border-box">
<style>.r{margin:0 0 18px;border:1px solid #334155;border-radius:8px;padding:12px;background:#111827}.h{font-weight:bold;margin-bottom:8px}.s{padding:2px 8px;border-radius:6px;margin-right:8px}.ok{background:#16a34a}.no{background:#dc2626}pre{white-space:pre-wrap;margin:0;color:#cbd5e1}</style>
<div style="font:bold 20px system-ui;margin-bottom:6px">API as "Customer Experience Specialists 2" — profile Desk Agent (no "desk:assignment:manage")</div>
<div style="font:14px system-ui;color:#94a3b8;margin-bottom:16px">NDC-Staging, ${esc(o.when)} · department QA AS6 Dept A</div>
${row('rules',o.rules)}${row('prefs',o.prefs)}${row('w',o.prefsWrite)}${row('ta',o.teamAssignment)}</body></html>`;
(async()=>{const b=await chromium.launch({channel:'msedge'});const pg=await b.newPage({viewport:{width:1600,height:1000}});const hf=R+'/evidence/raw/agent-prefs-api.html';fs.writeFileSync(hf,html);await pg.goto(require('url').pathToFileURL(hf).href);await pg.waitForTimeout(500);await pg.screenshot({path:R+'/evidence/raw/agent-prefs-api.png'});await b.close();console.log('ok');})();
