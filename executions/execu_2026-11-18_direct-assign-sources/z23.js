await page.getByText(/^Round Robin$/).first().click(); await page.waitForTimeout(12000);
out.url = page.url();
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-rr.png' });
