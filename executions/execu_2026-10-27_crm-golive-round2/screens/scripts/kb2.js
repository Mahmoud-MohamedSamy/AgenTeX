const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
out.kanban = [];
for (let i = 0; i < 3; i++) {
  await page.goto(B + '/modules/' + D, { waitUntil: 'commit' });
  const t0 = Date.now(); let ms = -1;
  try { await page.waitForFunction(() => /Qualification/.test(document.body.innerText) && /Probability/.test(document.body.innerText), null, { timeout: 60000 }); ms = Date.now() - t0; } catch (e) {}
  out.kanban.push(ms); await sleep(1500);
}
await page.screenshot({ path: RAW + 'kanban-timed.png' });
// delete the QA kanban view
const vs = await api('GET', `/modules/${D}/views?kind=kanban`);
const list = (vs.j && vs.j.data && (vs.j.data.views || vs.j.data)) || [];
out.deleted = [];
for (const v of (Array.isArray(list) ? list : [])) if (/QA R2SC/.test(v.name || '')) out.deleted.push(v.name + ' ' + (await api('DELETE', `/modules/${D}/views/${v.id}`)).s);
