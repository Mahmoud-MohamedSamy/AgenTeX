await page.goto('https://crm.zoho.com/crm/org943261092/tab/Leads', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1500); if ((await page.innerText('body').catch(() => '')).length > 500) break; } await sleep(4000);
await page.mouse.click(1000, 700); await sleep(500);
await page.keyboard.press('Slash'); await sleep(1500);
out.active = await page.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { tag: a.tagName, ph: a.placeholder, aria: a.getAttribute('aria-label'), id: a.id, cls: String(a.className).slice(0, 60), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }; });
await page.screenshot({ path: RAW + 'z-slash.png' });
await page.keyboard.press('Escape');
