const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', B = 'dbd0c426-8f33-4726-b74f-44d44b396b65';
const stage = async id => ((await api('GET', `/modules/${D}/records/${id}`)).j?.data?.data || []).find(d => d.field === 'stage')?.value?.value ?? null;
await sleep(500);
const colOf = name => page.evaluate(n => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === n); let c = el; for (let k = 0; k < 12; k++) { c = c?.parentElement; if (!c || c.className.includes('flex-[1_0_18rem]')) break; } return c?.innerText.split('\n')[0]; }, name);
const col = name => page.evaluate(n => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === n); let c = h; for (let k = 0; k < 8; k++) { c = c.parentElement; if (c.getBoundingClientRect().height > 300) break; } const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 200 }; }, name);
const out = [];
for (let i = 0; i < 3; i++) {
  for (let k = 0; k < 30; k++) { if (await page.getByText('QA RT 2113 b', { exact: true }).count()) break; await sleep(1000); }
  const b = await page.getByText('QA RT 2113 b', { exact: true }).first().boundingBox(); const t = await col('Unaccounted');
  await page.mouse.move(b.x + 20, b.y + 10); await page.mouse.down(); for (let s = 1; s <= 25; s++) { await page.mouse.move(b.x + 20 + (t.x - b.x - 20) * s / 25, b.y + 10 + (t.y - b.y - 10) * s / 25); await sleep(30); } await sleep(500); await page.mouse.up(); await sleep(2500);
  const dlg = await page.getByRole('dialog').count();
  const r = { dialog: dlg ? await page.getByRole('dialog').innerText().then(x => x.split('\n')[0]) : null, shownIn: await colOf('QA RT 2113 b'), api: await stage(B) };
  if (dlg) { if (i === 0) await shot('2113-02-drop-on-unaccounted'); await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click(); await sleep(2000); r.afterCancel = await colOf('QA RT 2113 b'); }
  out.push(r);
}
await page.setViewportSize({ width: 1280, height: 720 });
return done(out);
