const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', B = 'dbd0c426-8f33-4726-b74f-44d44b396b65';
const stage = async id => ((await api('GET', `/modules/${D}/records/${id}`)).j?.data?.data || []).find(d => d.field === 'stage')?.value?.value ?? null;
const fld = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.apiName === 'stage');
const pip = await api('GET', `/modules/${D}/pipelines`);
const out = { stageOpts: JSON.stringify(fld?.datatypeOptions || fld?.config || {}).slice(0, 500), pipelines: pip.s + ' ' + pip.t.slice(0, 600) };
await page.setViewportSize({ width: 2200, height: 900 }); await sleep(1500);
for (let k = 0; k < 60; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (t.includes('QA RT 2113 b') && t.includes('Unaccounted')) break; }
out.qualHint = await page.evaluate(() => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Qualification'); let c = h; for (let k = 0; k < 8; k++) { c = c.parentElement; if (c.getAttribute('title')) return c.getAttribute('title'); } return h?.closest('[title]')?.getAttribute('title') || null; });
const col = name => page.evaluate(n => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === n); let c = h; for (let k = 0; k < 8; k++) { c = c.parentElement; if (c.getBoundingClientRect().height > 300) break; } const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 200 }; }, name);
const b = await page.getByText('QA RT 2113 b', { exact: true }).first().boundingBox(); const t = await col('Unaccounted');
await page.mouse.move(b.x + 20, b.y + 10); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(b.x + 20 + (t.x - b.x - 20) * i / 25, b.y + 10 + (t.y - b.y - 10) * i / 25); await sleep(30); } await sleep(500); await page.mouse.up(); await sleep(2500);
const d = page.getByRole('dialog');
if (await d.count()) {
  await d.getByLabel('Amount').fill('1').catch(() => {});
  await d.locator('input[type=date]').fill('2026-10-25').catch(() => {});
  const sel = d.getByText('Select...', { exact: true }); if (await sel.count()) { await sel.click(); await sleep(800); await page.getByRole('option').first().click().catch(() => {}); await sleep(500); }
  await shot('2113-05-verify-filled');
  await d.getByRole('button', { name: 'Save and close' }).click().catch(e => out.saveErr = String(e).slice(0, 100)); await sleep(3000);
}
out.bAfterSave = await stage(B);
await shot('2113-06-after-save');
await page.setViewportSize({ width: 1280, height: 720 });
return done(out);
