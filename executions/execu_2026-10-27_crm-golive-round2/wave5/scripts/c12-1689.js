const res = {};
await page.goto(H + '/settings/teamspace', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 20; i++) { await sleep(1000); if (await page.locator('text=QA R2W5 TS').count()) break; }
await page.locator('text=QA R2W5 TS').first().click(); await sleep(4000);
const card = await page.locator('text=/^QA R2W5 TS$/').first().boundingBox();
const btns = []; for (const x of await page.$$('main button')) { const bb = await x.boundingBox(); if (bb && Math.abs(bb.y - card.y) < 30 && bb.x > card.x) btns.push({ x: bb.x, y: bb.y, label: (await x.getAttribute('aria-label')) || (await x.innerText()) }); }
res.cardButtons = btns;
await shot('c12-1689-edit');
const del = btns.sort((a, b) => b.x - a.x)[0];
if (del) {
  await page.mouse.click(del.x + 6, del.y + 6); await sleep(1500);
  res.afterClick = (await page.innerText('body')).replace(/\s+/g, ' ').match(/(Delete[^.]{0,200}|Are you sure[^.]{0,200})/)?.[0] || 'nothing visible';
  await shot('c12-1689-confirm');
  const c = page.locator('button', { hasText: /^(Delete|Confirm|Yes, delete|Delete Teamspace)$/ });
  if (await c.count()) { const rq = page.waitForResponse(r => /\/teamspaces\//.test(r.url()) && r.request().method() === 'DELETE', { timeout: 20000 }).catch(() => null); await c.last().click(); const r = await rq; res.deleteCall = r ? r.url().replace(/^.*\/api\/v1/, '') + ' ' + r.status() : 'no DELETE'; await sleep(2500); }
}
res.url = page.url().replace(H, '');
const ts = (await call('GET', '/teamspaces')).j.data.map(t => t.name); res.teamspaces = ts;
return res;
