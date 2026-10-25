// NDC-2280: long view name on Manage custom views.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LS = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const NAME = 'QA RT ' + 'x'.repeat(110);
const r = await api('POST', `/modules/${L}/views`, { name: NAME, kind: 'list', visibility: 'private', layout_id: LS, settings: { criteria: { conditions: [] } } });
const out = { create: r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 160)) };
await page.setViewportSize({ width: 1280, height: 984 });
await page.goto(H + `/modules/${L}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 120; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (/\d records/.test(t) && !/Loading Leads/.test(t)) break; }
const vb = page.getByRole('button', { name: /Custom views|Choose a view|views/i }).first(); await vb.click(); await sleep(1200);
await page.getByText('Manage custom views', { exact: true }).first().click(); await sleep(1500);
for (let k = 0; k < 60; k++) { await sleep(1000); if ((await txt()).includes('xxxxxxxxxx')) break; }
await sleep(1500); out.url = page.url().replace(H, '');
out.m = await page.evaluate(() => { const td = [...document.querySelectorAll('td, [role=cell]')].find(c => c.innerText.includes('xxxxxxxxxx')); const tbl = td?.closest('table, [role=table], [role=grid]'); const wrap = tbl?.parentElement; const ths = [...(tbl?.querySelectorAll('th, [role=columnheader]') || [])].map(h => { const r = h.getBoundingClientRect(); return h.innerText.trim() + ' ' + Math.round(r.left) + '-' + Math.round(r.right); }); const span = [td, ...td.querySelectorAll('*')].find(e => getComputedStyle(e).textOverflow === 'ellipsis'); return { cellW: Math.round(td.getBoundingClientRect().width), ths, tableRight: Math.round(tbl.getBoundingClientRect().right), viewport: innerWidth, hScroll: wrap.scrollWidth > wrap.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth + 1, ellipsis: !!span, truncated: span ? span.scrollWidth > span.clientWidth : null, title: (td.getAttribute('title') || td.querySelector('[title]')?.getAttribute('title') || '').length }; });
await shot('2280-01-manage');
const cell = page.getByText(/QA RT x{10}/).first(); await cell.hover(); await sleep(1500);
out.tooltip = await page.evaluate(() => { const t = document.querySelector('[role=tooltip]'); return t ? t.innerText.length + ' chars: ' + t.innerText.slice(0, 30) : null; });
await shot('2280-02-hover');
return done(out);
