const q = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=50';
const out = {};
for (let i = 0; i < 4; i++) {
  const r = await api('GET', '/audit/recycle-bin/items?' + q);
  out.status = r.s; const t = r.t;
  out.hasWQ = /154f23c9-5f77-46fa-a02f-da9aa5c5687a|QA RT del-list/.test(r.t + JSON.stringify(r.j || {}));
  out.hasList = /ad0d3273-e254-4814-9598-10feacb4296e|QA RT del-wq/.test(r.t + JSON.stringify(r.j || {}));
  if (out.hasWQ && out.hasList) break; await sleep(15000);
}
const r = await api('GET', '/audit/recycle-bin/items?' + q);
const items = arr(r.j && r.j.data) .length ? arr(r.j.data) : arr(r.j && r.j.data && r.j.data.items);
out.n = items.length; out.top = items.slice(0, 4).map(x => JSON.stringify(x).slice(0, 300));
const rec = await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/154f23c9-5f77-46fa-a02f-da9aa5c5687a');
out.wqRecordAfterDelete = rec.s + ' ' + rec.t.slice(0, 160);
await go('/settings/data/recycle-bin', 9000); await shot('NDC-1821-recycle-bin-after');
out.ui = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 900);
return done(out);
