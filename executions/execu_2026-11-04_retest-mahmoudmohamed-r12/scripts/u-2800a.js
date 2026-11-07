const o = {};
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Agents/.test(await text())) break; }
await page.getByText('Agents', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Active Agents|Rows per page/i.test(await text())) break; } await sleep(4000);
o.url = page.url(); await shot('2800-a-list.png');
const rows = page.locator('table tbody tr'); o.n = await rows.count();
o.rows = await rows.evaluateAll(trs => trs.map(tr => ({ h: Math.round(tr.getBoundingClientRect().height), cells: [...tr.cells].map(c => c.innerText.replace(/\s+/g, ' ').trim().slice(0, 60)) })));
o.heads = await page.locator('table thead th').evaluateAll(a => a.map(th => th.innerText.trim() + ':' + Math.round(th.getBoundingClientRect().width)));
// word-break check: each Status/Role/Profile cell rendered on how many lines and whether a word is split
o.wrap = await page.locator('table tbody td').evaluateAll(tds => tds.map(td => { const r = document.createRange(); r.selectNodeContents(td); const lines = new Set([...r.getClientRects()].map(x => Math.round(x.top))).size; return lines > 1 ? td.innerText.replace(/\s+/g, ' ').slice(0, 40) + ' [' + lines + ' lines]' : null; }).filter(Boolean).slice(0, 30));
o.pager = await page.getByText(/Rows per page/i).first().boundingBox().catch(() => null);
o.docH = await page.evaluate(() => document.scrollingElement.scrollHeight);
await page.setViewportSize({ width: 1600, height: 900 }); await shot('2800-b-full.png', { fullPage: true });
// tooltip / more on Departments
const more = page.getByText(/\+\d+ more/).first(); o.moreCount = await page.getByText(/\+\d+ more/).count();
if (o.moreCount) { await more.hover(); await sleep(1500); o.tooltip = (await page.locator('[role=tooltip]').innerText().catch(() => '')).slice(0, 300); await shot('2800-c-tooltip.png'); }
return o;
