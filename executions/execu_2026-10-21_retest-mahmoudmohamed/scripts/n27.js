const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const src = page.getByText('QA RT rollup', { exact: true }).first(); await src.scrollIntoViewIfNeeded(); const sb = await src.boundingBox();
const tgt = page.locator('main').getByText('Phone Permission', { exact: true }).first(); const tb = await tgt.boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); await sleep(200);
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + 20 + (tb.x + 30 - sb.x - 20) * i / 25, sb.y + 8 + (tb.y + 10 - sb.y - 8) * i / 25); await sleep(40); }
await sleep(300); await page.mouse.up(); await sleep(2000);
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 120) + ' → ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 500)); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click();
for (let i = 0; i < 20; i++) { await sleep(1500); if (!/Saving/.test(await page.locator('body').innerText())) break; }
page.off('response', f);
await shot('1444-10-save-from-unused');
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
return done({ sb, tb, resp, inLayout: JSON.stringify(lay.views).includes('6a570979'), mod: lay.lastModifiedAt, toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
