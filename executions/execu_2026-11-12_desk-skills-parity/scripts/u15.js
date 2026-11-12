async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 await page.getByText('Round Robin', { exact: true }).first().click(); await page.waitForTimeout(3000);
 // department picker
 const combo = page.locator('button', { hasText: /Customer Support|Department|Sales|QA/ }).first();
 const dd = await page.getByText('Department', { exact: true }).count();
 await page.screenshot({ path: E + 'tavi-rr-tab.png' }); return { dd }; }
