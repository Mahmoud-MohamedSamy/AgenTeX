async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.search(/hosted/i); const ctx=b.slice(Math.max(0,i-400),i+400);
 const lab=page.locator('label').filter({hasText:/hosted/i}).first(); let clicked=false; if(await lab.count()){await lab.scrollIntoViewIfNeeded(); const cb=lab.locator('input[type=checkbox]'); if(await cb.count()){await cb.check(); clicked=true;} else {await lab.click(); clicked=true;}}
 await page.waitForTimeout(1000); await page.screenshot({path:EV+'uw10-hosted.png'}); return {ctx, clicked}; }
