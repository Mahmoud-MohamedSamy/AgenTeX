const o = {};
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Agents/.test(await text())) break; }
await page.getByText('Agents', { exact: true }).first().click(); for (let i = 0; i < 40; i++) { await sleep(3000); if (/Active Agents/i.test(await text()) && (await page.locator('table tbody tr').count()) > 3) break; } await sleep(3000);
const measure = async tag => { const rows = await page.locator('table tbody tr').evaluateAll(trs => trs.map(tr => Math.round(tr.getBoundingClientRect().height)));
  const split = await page.locator('table tbody td').evaluateAll(tds => tds.map(td => { const t = td.innerText.trim(); const el = td.querySelector('span,div,p') || td; const lh = parseFloat(getComputedStyle(el).lineHeight) || 20; return { t: t.slice(0, 30), lines: Math.round(td.getBoundingClientRect().height / lh) }; }).filter(x => /^(active|Desk Administrator|Desk Supervisor|Desk Agent|Manager|CEO)$/.test(x.t)).map(x => x.t + ':' + (x.lines <= 2 ? 'ok' : x.lines)));
  const pager = await page.getByText(/Rows per page/i).first().boundingBox().catch(() => null);
  return { rowH: [Math.min(...rows), Math.max(...rows)], nRows: rows.length, pagerY: pager && Math.round(pager.y), viewportH: page.viewportSize().height, splitSample: [...new Set(split)].slice(0, 8) }; };
await page.setViewportSize({ width: 1272, height: 866 }); await sleep(2000); o.w1272 = await measure(); await shot('2800-d-1272.png');
await page.setViewportSize({ width: 1024, height: 768 }); await sleep(2000); o.w1024 = await measure(); await shot('2800-e-1024.png');
const big = page.getByText(/\+30 more/).first(); if (await big.count()) { await big.hover(); await sleep(1500); o.tip30 = (await page.locator('[role=tooltip]').innerText().catch(() => '')).split(',').length; }
return o;
