const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', A = '95503f26-c7b3-4564-91a1-aca6b497fb1a', B = 'dbd0c426-8f33-4726-b74f-44d44b396b65';
const stage = async id => ((await api('GET', `/modules/${D}/records/${id}`)).j?.data?.data || []).find(d => d.field === 'stage')?.value?.value ?? null;
await page.setViewportSize({ width: 2200, height: 900 }); await page.reload({ waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (t.includes('Unaccounted') && t.includes('QA RT 2113 a') && t.includes('QA RT 2113 b')) break; } await sleep(2000);
const colOf = name => page.evaluate(n => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === n); let c = el; for (let k = 0; k < 12; k++) { c = c.parentElement; if (c.className.includes('flex-[1_0_18rem]')) break; } return c.innerText.split('\n')[0]; }, name);
const col = name => page.evaluate(n => { const h = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === n); let c = h; for (let k = 0; k < 8; k++) { c = c.parentElement; if (c.getBoundingClientRect().height > 300) break; } const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 200 }; }, name);
const drag = async (cardName, toCol) => { const b = await page.getByText(cardName, { exact: true }).first().boundingBox(); const t = await col(toCol); await page.mouse.move(b.x + 20, b.y + 10); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(b.x + 20 + (t.x - b.x - 20) * i / 25, b.y + 10 + (t.y - b.y - 10) * i / 25); await sleep(30); } await sleep(500); await page.mouse.up(); await sleep(2500); };
const dlg = () => page.evaluate(() => document.querySelector('[role=dialog]')?.innerText.split('\n').slice(0, 3).join(' / ') || null);
const out = {};
await drag('QA RT 2113 b', 'Unaccounted');
out.b1 = { dialog: await dlg(), shownIn: await colOf('QA RT 2113 b'), apiStage: await stage(B) }; await shot('2113-02-drop-on-unaccounted');
if (out.b1.dialog) { await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click(); await sleep(2000); out.b1after = { shownIn: await colOf('QA RT 2113 b'), apiStage: await stage(B) }; }
await drag('QA RT 2113 a', 'Proposal');
out.a1 = { dialog: await dlg(), shownIn: await colOf('QA RT 2113 a'), apiStage: await stage(A) }; await shot('2113-03-unaccounted-to-proposal');
if (out.a1.dialog) { await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click(); await sleep(1500); }
await page.setViewportSize({ width: 1280, height: 720 });
return done(out);
