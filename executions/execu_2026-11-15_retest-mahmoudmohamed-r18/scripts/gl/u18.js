const KEY='fw1.a7a7a7a7000000000000000000000004.gkxGnPIdxB-5AMEUoQ_I-9ln4DohCkbr60n37-iJ_54';
const c2=await ctx.browser().newContext({viewport:{width:1600,height:900}}); const p=await c2.newPage();
const net=[]; p.on('response',r=>{ if(/web-forms\/public|embed\/feedback\/f\//.test(r.url())) net.push(r.request().method()+' '+r.url().replace(/(public|f)\/[^/?]+/,'$1/<k>').replace(/^https:\/\/[^/]+/,'')+' '+r.status()); });
const out={};
for (const [k,u] of [['hosted','https://staging-crm.taviportal.com/embed/feedback/f/'+KEY],['iframe','https://staging-crm.taviportal.com/embed/feedback/index.html?key='+KEY+'&mode=frame']]) {
  await p.goto(u,{waitUntil:'domcontentloaded',timeout:90000}); await p.waitForTimeout(9000);
  const info=await p.evaluate(()=>{const f=document.querySelector('form')||document.body; const lab=[...document.querySelectorAll('label')].map(l=>l.innerText.trim()).filter(Boolean); return {htmlDir:document.documentElement.dir, htmlLang:document.documentElement.lang, formDir:getComputedStyle(f).direction, bodyDir:getComputedStyle(document.body).direction, labels:lab.slice(0,10), btns:[...document.querySelectorAll('button')].map(b=>b.innerText.trim()), text:document.body.innerText.slice(0,500)};});
  out[k]=info; await p.screenshot({path:'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/3005-'+(k==='hosted'?'1':'2')+'-ar-'+k+'.png'});
}
out.net=net; await c2.close(); return out;
