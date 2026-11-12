async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 await page.mouse.click(1380, 359); await page.waitForTimeout(1200);
 await page.getByText('QA SK12 Dept A', { exact: true }).last().click(); await page.waitForTimeout(3500);
 await page.screenshot({ path: E + 'tavi-rr-qa-dept.png' });
 await page.locator('button[aria-label*="Edit"], button:has(svg)').filter({ hasNot: page.locator('text=New Rule') }).count();
 return (await page.innerText('main')).split('Round Robin Rules')[1]?.slice(0, 400); }
