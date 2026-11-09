const o = {};
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'commit', timeout: 45000 }).catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1000); const t = await txt().catch(() => ''); if (/RECENT ACTIVITY/.test(t) && t.length > 1500) break; } await sleep(2000);
let loc = page.getByText(/time zone/i).first();
for (let k = 0; k < 25 && !(await loc.count()); k++) { await page.mouse.move(900, 600); await page.mouse.wheel(0, 2500); await sleep(1500); const more = page.getByRole('button', { name: /load more|show more/i }); if (await more.count()) { await more.first().click().catch(() => {}); await sleep(2500); } loc = page.getByText(/time zone/i).first(); }
o.found = await loc.count();
if (o.found) { await loc.scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, -200); await sleep(1500);
  o.lines = (await page.getByText(/time zone/i).allInnerTexts()).slice(0, 6);
  const box = await loc.boundingBox(); o.box = box;
  await page.screenshot({ path: SHOT + '/bugs/W1-B4-1-audit-list.png' }); }
return done(o);
