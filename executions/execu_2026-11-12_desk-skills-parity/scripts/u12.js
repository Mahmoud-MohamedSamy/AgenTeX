async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 const go = async u => { await page.goto('https://staging-desk.taviportal.com' + u, { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000); };
 await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/9722658a-6d26-4f2d-9e0c-5df25994f275');
 if (/login/.test(page.url())) return 'LOGGED OUT';
 await page.screenshot({ path: E + 'tavi-E2-ticket.png' }); await page.mouse.click(342, 128); await page.waitForTimeout(3000); await page.screenshot({ path: E + 'tavi-E2-skills-tab.png' });
 await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/cb0f7d62-5b6e-4e01-b3a1-8e8f8db2ea71');
 await page.mouse.click(342, 128); await page.waitForTimeout(3000); await page.screenshot({ path: E + 'tavi-E3-skills-tab.png' });
 await page.mouse.click(342, 84); await page.waitForTimeout(2000); const l = page.getByText('Skills', { exact: true }).last(); await l.scrollIntoViewIfNeeded().catch(()=>{}); await page.waitForTimeout(800); await page.screenshot({ path: E + 'tavi-E3-field.png' });
 return page.url(); }
