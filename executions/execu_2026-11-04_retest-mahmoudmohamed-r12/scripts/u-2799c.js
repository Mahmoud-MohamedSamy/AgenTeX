const o = {}; const net = [];
page.on('response', async r => { const u = r.url(); if (/records\?/.test(u) && /blueprint/.test(decodeURIComponent(u))) { let n = ''; try { const j = await r.json(); n = j.meta?.total_count ?? j.meta?.total ?? (j.data?.records || j.data || []).length; } catch (e) {} net.push(r.status() + ' n=' + n + ' ' + decodeURIComponent(u).replace(/^.*filters=/, '').slice(0, 220)); } });
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/All Tickets/.test(await text())) break; } await sleep(4000);
await page.getByText(/All Tickets \(/).first().click(); await sleep(2500);
o.viewMenu = ((await text()).match(/(Active Blueprint Tickets|All Transitions|My Transitions|My Team Transitions|Unassigned Transitions)/g) || []);
await shot('2799-e-views.png');
for (const v of ['Active Blueprint Tickets', 'All Transitions', 'My Transitions', 'My Team Transitions', 'Unassigned Transitions']) {
  const el = page.getByText(v, { exact: true }).first(); if (!(await el.count())) { o[v] = 'missing'; continue; }
  await el.click(); await sleep(6000); const t = await text(); o[v] = (t.match(new RegExp(v.replace(/ /g, '\\s*') + '\\s*\\((\\d+)\\)')) || [])[1] || (t.match(/\((\d+)\)/) || [])[1];
  if (v === 'Active Blueprint Tickets') await shot('2799-f-active-bp.png');
  await page.getByText(new RegExp(v + ' \\(')).first().click().catch(() => {}); await sleep(1500);
}
o.net = net.slice(0, 8);
return o;
