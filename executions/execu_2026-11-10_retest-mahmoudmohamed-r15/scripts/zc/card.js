// node card.js <out.png> <title> <json rows [[label, request, response, tone]]> — narrow 800px card in screenshots/raw
const path=require('path'),fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));const [out,title,rowsF]=process.argv.slice(2);const rows=JSON.parse(fs.readFileSync(rowsF,'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');const C={ok:'#16a34a',bad:'#dc2626',info:'#2563eb'};
const html=`<!doctype html><meta charset=utf-8><body style="margin:0;width:800px;background:#0f172a;color:#e2e8f0;font:15px/1.45 Consolas,monospace;padding:18px 20px;box-sizing:border-box"><div style="font:600 17px 'Segoe UI';margin-bottom:12px">${esc(title)}</div>`+
rows.map((r,i)=>`<div id="r${i+1}" style="margin:8px 0;padding:8px 10px;background:#1e293b;border-left:5px solid ${C[r[3]]||'#64748b'};border-radius:5px"><div style="font:600 14px 'Segoe UI';color:#cbd5e1">${esc(r[0])}</div><div style="color:#93c5fd">${esc(r[1])}</div><div>${esc(r[2])}</div></div>`).join('')+'</body>';
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge',args:['--disable-gpu']});const p=await b.newPage({viewport:{width:800,height:300}});await p.setContent(html);const h=await p.evaluate(()=>document.body.scrollHeight);await p.setViewportSize({width:800,height:h});
const boxes=await p.$$eval('[id^=r]',es=>es.map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.right),Math.round(r.bottom)]}));
await p.screenshot({path:path.join(P,'executions/execu_2026-11-10_retest-mahmoudmohamed-r15/screenshots/raw',out)});await b.close();console.log(out,'h',h,JSON.stringify(boxes));})();
