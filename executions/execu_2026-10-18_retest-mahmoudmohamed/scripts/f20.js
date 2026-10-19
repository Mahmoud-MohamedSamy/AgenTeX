// NDC-1819 item 8: drag columns to their minimum and maximum width; check readability in Clip and Wrap; then Reset Column Size.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
const ts = async label => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900); await page.locator('[role=menu] [role^=menuitem]', { hasText: label }).first().click(); await sleep(1800); };
const drag = async (name, dx) => { const s = page.getByRole('separator', { name: 'Resize column: ' + name }); await s.scrollIntoViewIfNeeded(); const b = await s.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + dx, b.y + b.height / 2, { steps: 15 }); await page.mouse.up(); await sleep(1200); };
// For one column: width, header overflow/overlap, and per-cell readability (lines, clipped, ellipsis, mid-word breaks).
const measure = async name => page.evaluate(name => {
  const ths = [...document.querySelectorAll('main thead th')]; const i = ths.findIndex(t => t.innerText.trim() === name); if (i < 0) return { name, missing: true };
  const th = ths[i]; const hb = th.getBoundingClientRect(); const lab = [...th.querySelectorAll('span,div')].find(e => e.innerText.trim() === name) || th; const lb = lab.getBoundingClientRect();
  const cells = [...document.querySelectorAll('main tbody tr')].slice(0, 5).map(r => r.children[i]).filter(Boolean);
  const c = cells.map(td => { const inner = td.querySelector('a,span,div,p') || td; const cs = getComputedStyle(inner); const lh = parseFloat(cs.lineHeight) || 20;
    return { text: td.innerText.trim().replace(/\n/g, '⏎').slice(0, 40), lines: Math.round(inner.getBoundingClientRect().height / lh), clipped: inner.scrollWidth > inner.clientWidth + 1, ellipsis: cs.textOverflow }; });
  return { name, width: Math.round(hb.width), headerLabelOverflows: lb.right > hb.right + 1 || lab.scrollWidth > lab.clientWidth + 1, headerLabelWidth: Math.round(lb.width), cells: c };
}, name);
const cols = ['Full Name', 'Phone', 'Lead Status', 'Lead Owner', 'Created At', 'Last Activity', 'Company'];
for (const mode of ['Clip Text', 'Wrap Text']) {
  await ts(mode);
  for (const c of cols) await drag(c, -600);
  out[mode + ' MIN'] = []; for (const c of cols) out[mode + ' MIN'].push(await measure(c));
  await page.locator('main thead').scrollIntoViewIfNeeded(); await shot('NDC-1819-f-width-min-' + (mode.startsWith('Clip') ? 'clip' : 'wrap'));
  await ts('Reset Column Size');
}
await ts('Clip Text');
await drag('Full Name', 2500); out['MAX Full Name'] = await measure('Full Name'); out.tableScroll = await page.evaluate(() => { const t = document.querySelector('main table'); const p = t.parentElement; return { tableW: Math.round(t.getBoundingClientRect().width), viewportW: Math.round(p.clientWidth), scrollable: p.scrollWidth > p.clientWidth }; });
await shot('NDC-1819-f-width-max');
await drag('Full Name', 2500); out['MAX Full Name 2nd drag'] = (await measure('Full Name')).width;
await ts('Reset Column Size'); out.afterReset = await page.locator('main thead th').evaluateAll(t => t.map(x => Math.round(x.getBoundingClientRect().width)));
return done(out);
