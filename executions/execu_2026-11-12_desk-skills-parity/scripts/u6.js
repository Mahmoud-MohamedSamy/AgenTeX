async (page) => { await page.getByRole('button', { name: 'Cancel' }).first().click().catch(()=>{}); await page.waitForTimeout(2000);
 const d = page.getByRole('button', { name: /discard|leave/i }); if (await d.count()) await d.first().click();
 await page.goto('https://staging-desk.taviportal.com/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/79975bb2-56bc-4bc3-8f95-b6134e6411af', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 const tabs = await page.$$eval('[role=tab], button[aria-label]', es => es.map(e => e.getAttribute('aria-label') || e.textContent.trim()).filter(t => t && t.length < 40));
 await page.screenshot({ path: 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/fff57c37-234b-467e-81bd-7fd70c127144/scratchpad/t-ticket.png' });
 const t = await page.innerText('body'); const i = t.indexOf('Skills'); return { tabs: tabs.slice(0, 40), around: i>=0 ? t.slice(Math.max(0,i-200), i+300) : null }; }
