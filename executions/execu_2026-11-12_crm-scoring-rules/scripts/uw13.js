async (page, ctx) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const fs=require('fs'); const link=fs.readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/out/wf-link.txt','utf8').trim();
 const anon=await ctx.browser().newContext({viewport:{width:900,height:900}}); const p=await anon.newPage(); const out={};
 await p.goto(link,{waitUntil:'domcontentloaded'}); await p.waitForTimeout(6000); out.form=(await p.innerText('body')).replace(/\s+/g,' ').slice(0,300);
 const fr=p.frames().find(f=>/f\//.test(f.url()))||p.mainFrame(); 
 const name=fr.locator('input').first(); await name.fill('QA SR1112 WF visitor');
 const sel=fr.locator('select'); if(await sel.count()){out.opts=await sel.first().locator('option').allInnerTexts(); await sel.first().selectOption({label:'web'}).catch(async()=>{await sel.first().selectOption('web');});}
 await p.screenshot({path:EV+'uw13-form-filled.png'});
 await fr.getByRole('button',{name:/^Send$/}).click(); await p.waitForTimeout(6000); out.after=(await p.innerText('body')).replace(/\s+/g,' ').slice(0,300); await p.screenshot({path:EV+'uw13-form-sent.png'}); await anon.close(); return out; }
