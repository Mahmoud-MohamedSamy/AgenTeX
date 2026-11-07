const st = {}; const reqs = [];
page.on('request', r => { const u = r.url(); if (/api\/v1/.test(u) && /records/.test(u) && r.method() !== 'OPTIONS') reqs.push(decodeURIComponent(u.replace(/^.*api\/v1/, '')).slice(0, 400)); });
const total = async () => ((await text()).match(/Total Records\s*([\d,]+)/) || [])[1];
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 70; i++) { await sleep(3000); const t = await text(); if (/Total Records/.test(t) && /Subject/.test(t)) break; } await sleep(3000);
await page.getByRole('button', { name: 'My Leads, 51 records' }).first().click(); await sleep(8000);
for (const opt of ['With any Tasks', 'Without any Tasks']) {
  await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(2500);
  const rel = page.locator('text=FILTER BY RELATED MODULES').locator('xpath=following::*[normalize-space(text())="Tasks"][1]');
  if (!(await page.locator('select').filter({ hasText: 'With any Tasks' }).count())) { await rel.click(); await sleep(1500); }
  await page.locator('select').filter({ hasText: 'With any Tasks' }).selectOption({ label: opt }); await sleep(1000);
  const ap = page.getByRole('button', { name: /^Apply/ }); st['applyBtn_' + opt] = await ap.count(); if (await ap.count()) await ap.last().click(); await sleep(7000);
  st[opt] = { total: await total(), rows: (await page.locator('table tbody tr').allInnerTexts()).map(x => x.split('\t').map(s => s.trim()).filter(Boolean)[0]).slice(0, 12) };
  await shot(`1819-d-${opt.replace(/\s+/g, '-')}.png`);
  const clr = page.getByRole('button', { name: /Clear( all)?|Reset/ }); st['clear_' + opt] = await clr.count();
  // reset: reopen panel and clear
  await page.getByRole('button', { name: 'Filter', exact: true }).click().catch(() => {}); await sleep(1500);
  const c2 = page.getByRole('button', { name: /Clear/ }); if (await c2.count()) { await c2.first().click(); await sleep(1000); } const ap2 = page.getByRole('button', { name: /^Apply/ }); if (await ap2.count()) await ap2.last().click(); await sleep(6000);
  st['after_clear_' + opt] = await total();
}
st.reqs = [...new Set(reqs)].slice(-8); return st;
