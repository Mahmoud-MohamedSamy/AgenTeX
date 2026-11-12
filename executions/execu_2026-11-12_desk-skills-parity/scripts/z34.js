async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/zoho/';
 const f = page.frames().find(x => /ShowHomePage/.test(x.url()));
 await f.locator('[title="Skill Preferences"]').first().click(); await page.waitForTimeout(3000);
 await page.screenshot({ path: E + 'zoho-skill-preferences.png' }); return 'ok'; }
