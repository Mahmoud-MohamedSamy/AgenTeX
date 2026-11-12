async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 await page.mouse.click(1162,390); await page.waitForTimeout(800); await page.mouse.click(1162,328); await page.waitForTimeout(800);
 await page.screenshot({path:EV+'uw6a.png'});
 const ls=page.locator('div').filter({has:page.getByText(/^Lead Source$/)}).filter({has:page.locator('button')}); const box=await ls.last().boundingBox(); if(box){await page.mouse.click(box.x+box.width-30, box.y+box.height/2);} await page.waitForTimeout(1000);
 await page.screenshot({path:EV+'uw6-build.png'}); const b=(await page.innerText('body')).replace(/\s+/g,' '); const i=b.indexOf('Full Name'); return b.slice(i,i+500); }
