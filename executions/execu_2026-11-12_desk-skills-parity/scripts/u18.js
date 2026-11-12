async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 await page.getByText('Test User 1', { exact: true }).first().scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
 await page.screenshot({ path: E + 'tavi-rr-rule-pool.png' });
 await page.getByRole('button', { name: 'Cancel' }).last().click(); await page.waitForTimeout(1500);
 const d = page.getByRole('button', { name: /discard|leave/i }); if (await d.count()) await d.first().click();
 return 'ok'; }
