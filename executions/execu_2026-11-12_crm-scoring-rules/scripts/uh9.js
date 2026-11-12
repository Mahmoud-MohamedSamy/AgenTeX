async (page, ctx) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.goto('https://staging-crm.taviportal.com/settings/automation/scoring-rules?module=841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
 await page.getByRole('button',{name:/New Scoring Rule/}).first().click(); await page.waitForTimeout(2000); const d=page.getByTestId('scoring-rule-drawer');
 await d.getByLabel(/Rule name/).fill('QA SR1112 H9');
 await d.locator('[aria-label="Field of entry 1"]').first().click(); await page.waitForTimeout(600); await page.keyboard.type('Lead Source'); await page.waitForTimeout(600); await page.locator('[role=option]').filter({hasText:/^Lead Source$/}).first().click(); await page.waitForTimeout(500);
 await d.locator('[aria-label="Condition of entry 1"]').first().click(); await page.locator('[role=option]').filter({hasText:/^is$/}).first().click(); await d.locator('[aria-label="Value of entry 1"]').first().click(); await page.locator('[role=option]').filter({hasText:/web/}).first().click(); await d.locator('[aria-label="Points of entry 1"]').fill('7');
 // expire the session: drop cookies and stored tokens
 await ctx.clearCookies(); await page.evaluate(()=>{try{Object.keys(localStorage).filter(k=>/token|auth|session/i.test(k)).forEach(k=>localStorage.removeItem(k)); sessionStorage.clear();}catch(e){}});
 await d.getByRole('button',{name:/^Create$/}).click(); await page.waitForTimeout(6000);
 out.url=page.url(); const b=(await page.innerText('body')).replace(/\s+/g,' '); out.signIn=/Sign in/.test(b); out.msgs=(b.match(/[^.]{0,60}(session|sign in|expired|log in|Something went wrong|could not)[^.]{0,60}/gi)||[]).slice(0,4); out.drawerOpen=await d.isVisible().catch(()=>false);
 await page.screenshot({path:EV+'uh9-session-expired.png'}); return out; }
