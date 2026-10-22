const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const src = page.locator('aside, nav, [class*=sidebar], div').getByText('QA RT rollup', { exact: true }).first();
await src.scrollIntoViewIfNeeded(); await sleep(800);
const sb = await src.boundingBox();
const tgt = page.getByText('Single Line Permission', { exact: true }).nth(0); await tgt.scrollIntoViewIfNeeded().catch(() => {}); const tb = await tgt.boundingBox();
await page.mouse.move(sb.x + 30, sb.y + 8); await page.mouse.down(); await sleep(250);
await page.mouse.move(sb.x + 40, sb.y + 12); await sleep(100);
for (let i = 1; i <= 30; i++) { await page.mouse.move(sb.x + 40 + (tb.x + 60 - sb.x - 40) * i / 30, sb.y + 12 + (tb.y + 8 - sb.y - 12) * i / 30); await sleep(35); }
await sleep(400); await page.mouse.up(); await sleep(2000);
const enabled = await page.getByRole('button', { name: 'Save', exact: true }).isEnabled();
await shot('1444-10-placed');
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 120) + ' → ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 500)); }; page.on('response', f);
if (enabled) { await page.getByRole('button', { name: 'Save', exact: true }).click(); for (let i = 0; i < 20; i++) { await sleep(1500); if (!/Saving/.test(await page.locator('body').innerText())) break; } }
page.off('response', f);
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.name === 'FieldPermissions');
await shot('1444-11-after-save');
return done({ sb, tb, enabled, resp, inLayout: JSON.stringify(lay.views).includes('6a570979'), mod: lay.lastModifiedAt });
