async (page, ctx) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const fs=require('fs'); const link=fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/out/wf-link.txt','utf8').trim();
 const anon=await ctx.browser().newContext({viewport:{width:900,height:900}}); const p=await anon.newPage(); const st=[]; p.on('response',r=>{if(/embed|f\//.test(r.url()))st.push(r.status()+' '+r.url().replace(/f\/[^/?]+/,'f/<key>').slice(0,90));});
 await p.goto(link,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(8000); await p.screenshot({path:EV+'uw14-hosted.png'});
 const out={title:await p.title(), body:(await p.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,300), frames:p.frames().length, inputs:await p.locator('input').count(), st:st.slice(0,6)}; await anon.close(); return out; }
