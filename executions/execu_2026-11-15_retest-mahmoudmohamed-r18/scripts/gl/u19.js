const KEY='fw1.a7a7a7a7000000000000000000000004.gkxGnPIdxB-5AMEUoQ_I-9ln4DohCkbr60n37-iJ_54';
const c2=await ctx.browser().newContext({viewport:{width:1600,height:900}}); const p=await c2.newPage();
await p.goto('https://staging-crm.taviportal.com/embed/feedback/f/'+KEY,{waitUntil:'networkidle',timeout:90000}).catch(()=>{}); await p.waitForTimeout(8000);
const info=await p.evaluate(()=>{const ls=[...document.querySelectorAll('label,button,form,input')].slice(0,12).map(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return [e.tagName,(e.innerText||'').slice(0,20),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),cs.opacity,cs.visibility,cs.color]}); return {ls, sh:document.documentElement.scrollHeight, iframes:document.querySelectorAll('iframe').length};});
await p.screenshot({path:'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-15_retest-mahmoudmohamed-r18/screenshots/raw/3005-1-ar-hosted.png', fullPage:true});
await c2.close(); return info;
