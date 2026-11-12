async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/';
 const go = async u => { await page.goto('https://staging-desk.taviportal.com' + u, { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000); };
 // Skills page, Dept B, open Preferences
 await go('/settings/customization/skills'); await page.mouse.click(494, 203); await page.waitForTimeout(1200);
 await page.getByText('QA SK12 Dept B', { exact: true }).last().click(); await page.waitForTimeout(3500);
 await page.getByRole('button', { name: /Preferences/ }).first().click(); await page.waitForTimeout(2500);
 await page.screenshot({ path: E + 'tavi-deptB-preferences.png' }); await page.keyboard.press('Escape'); await page.waitForTimeout(800);
 // assignment rules page
 const links = await page.$$eval('a', as => as.map(a => [a.textContent.trim(), a.getAttribute('href')]).filter(x => /assignment/i.test(x.join(' '))));
 return links.slice(0, 10); }
