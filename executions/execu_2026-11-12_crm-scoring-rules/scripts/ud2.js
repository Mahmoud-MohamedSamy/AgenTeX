async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/desk-perm/';
 const out={}; await page.goto('https://staging-desk.taviportal.com/settings/users-control/profiles',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(7000);
 await page.screenshot({path:EV+'d1-profiles.png'}); const main=page.locator('main'); out.page=(await main.innerText().catch(()=>page.innerText('body'))).replace(/\s+/g,' ').slice(0,900);
 const prof=page.getByText(/^Desk Administrator$/).first(); if(await prof.count()){await prof.click(); await page.waitForTimeout(4000); out.afterClickUrl=page.url(); out.after=(await page.innerText('body')).replace(/\s+/g,' ').slice(-1200); await page.screenshot({path:EV+'d2-profile-open.png'});}
 const btns=(await page.getByRole('button').allInnerTexts()).map(s=>s.trim()).filter(s=>s&&s.length<40); out.buttons=btns.slice(-25);
 const links=await page.locator('a[href*="permission"], a[href*="profile"]').evaluateAll(e=>e.map(a=>a.getAttribute('href')+' | '+a.innerText.trim().slice(0,30))); out.links=links.slice(0,15);
 return out; }
