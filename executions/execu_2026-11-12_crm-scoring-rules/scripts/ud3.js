async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/desk-perm/';
 const out={}; await page.goto('https://staging-desk.taviportal.com/settings/users-control/profiles',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 const t0=(await page.innerText('body')).replace(/\s+/g,' '); out.signedIn=!/Sign in Desk Email/.test(t0); if(!out.signedIn) return out;
 await page.screenshot({path:EV+'d1-profiles.png'}); const i=t0.indexOf('Profiles Manage'); out.page=t0.slice(i,i+700);
 const prof=page.getByText(/^Desk Agent$/).first(); out.found=await prof.count(); if(out.found){await prof.click(); await page.waitForTimeout(4000); out.afterUrl=page.url(); const t=(await page.innerText('body')).replace(/\s+/g,' '); out.after=t.slice(t.indexOf('Desk Agent'),t.indexOf('Desk Agent')+1200); await page.screenshot({path:EV+'d2-profile-open.png'});
  const pl=page.getByRole('link',{name:/permission/i}).or(page.getByRole('button',{name:/permission/i})); out.permControls=await pl.allInnerTexts(); if(await pl.count()){await pl.first().click(); await page.waitForTimeout(5000); out.permUrl=page.url(); out.permText=(await page.innerText('body')).replace(/\s+/g,' ').slice(0,300); await page.screenshot({path:EV+'d3-permissions-click.png'});}}
 return out; }
