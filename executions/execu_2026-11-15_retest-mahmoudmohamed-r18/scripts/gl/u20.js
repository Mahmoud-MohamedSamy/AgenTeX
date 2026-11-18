const KEY='fw1.a7a7a7a7000000000000000000000004.gkxGnPIdxB-5AMEUoQ_I-9ln4DohCkbr60n37-iJ_54'; const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/';
const c2=await ctx.browser().newContext({viewport:{width:1600,height:900}}); const p=await c2.newPage(); const out={};
for (const [k,u] of [['hosted','https://staging-crm.taviportal.com/embed/feedback/f/'+KEY],['iframe','https://staging-crm.taviportal.com/embed/feedback/index.html?key='+KEY+'&mode=frame']]) {
await p.goto(u,{waitUntil:'networkidle',timeout:90000}).catch(()=>{}); await p.waitForTimeout(6000);
out[k]=await p.evaluate(()=>{const e=document.elementFromPoint(800,150); return {hit:e&&e.tagName+' '+(e.innerText||'').slice(0,20), sx:scrollX, sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth};});
await p.screenshot({fullPage:true,path:R+'3005-'+(k==='hosted'?'1':'2')+'-ar-'+k+'.png'});
}
await c2.close(); return out;
