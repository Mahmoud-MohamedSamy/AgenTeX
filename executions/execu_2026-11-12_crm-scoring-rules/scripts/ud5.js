async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/desk-perm/';
 await page.goto('https://staging-desk.taviportal.com/settings/users-control/profiles'); await page.waitForTimeout(7000);
 await page.getByRole('button',{name:'Edit profile'}).first().click(); await page.waitForTimeout(3000);
 const d=page.locator('[role=dialog]').last(); const t=(await d.innerText().catch(()=>'')).replace(/\s+/g,' '); await page.screenshot({path:EV+'d5-edit-profile.png'});
 await page.keyboard.press('Escape'); return {dialog:t.slice(0,800), hasPermission:/permission/i.test(t)}; }
