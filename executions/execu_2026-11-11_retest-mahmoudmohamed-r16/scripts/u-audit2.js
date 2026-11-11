await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/RECENT ACTIVITY/.test(await text())) break; } await sleep(4000);
for (let k = 0; k < 25; k++) { const t = await text(); if (/3:20 PM/.test(t)) break; await page.mouse.move(900, 600); await page.mouse.wheel(0, 2500); await sleep(1500); }
const t = await text(); const m = t.match(/[^\n]*\n[^\n]*(18 Contacts|data export|audit log)[^\n]*/gi); log(m);
const el = page.getByText(/18 Contacts/).first(); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, -200); await sleep(1000); }
await shot('2846-audit-export-rows.png');
