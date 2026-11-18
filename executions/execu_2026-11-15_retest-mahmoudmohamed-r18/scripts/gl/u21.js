const KEY='fw1.a7a7a7a7000000000000000000000004.gkxGnPIdxB-5AMEUoQ_I-9ln4DohCkbr60n37-iJ_54'; const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/';
const c2=await ctx.browser().newContext({viewport:{width:1600,height:900}}); const p=await c2.newPage(); const out={}; const net=[];
p.on('response',r=>{ if(/web-forms\/public/.test(r.url())) net.push(r.request().method()+' '+r.url().replace(/public\/[^/?]+/,'public/<k>').replace(/^https:\/\/[^/]+/,'').split('?')[0]+' '+r.status()); });
for (const [k,u] of [['iframe','https://staging-crm.taviportal.com/embed/feedback/index.html?key='+KEY+'&mode=frame'],['hosted','https://staging-crm.taviportal.com/embed/feedback/f/'+KEY]]) {
await p.goto(u,{waitUntil:'networkidle',timeout:90000}).catch(()=>{}); await p.waitForTimeout(6000);
out[k]=await p.evaluate(()=>({text:document.body.innerText.slice(0,400), sw:document.documentElement.scrollWidth, dir:document.documentElement.dir}));
await p.screenshot({path:R+'3004-'+(k==='iframe'?'1':'2')+'-disabled-'+k+'.png'});
}
out.net=net; await c2.close(); return out;
