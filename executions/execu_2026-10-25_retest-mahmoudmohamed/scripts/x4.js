// NDC-1819 column widths: min / max in Clip and Wrap modes, header label vs menu icon, then Reset Column Size.
const drag = async (label, dx) => { const h = page.getByRole('separator', { name: 'Resize column: ' + label }); await h.scrollIntoViewIfNeeded(); const b = await h.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); const steps = 30; for (let i = 1; i <= steps; i++) { await page.mouse.move(b.x + b.width / 2 + dx * i / steps, b.y + b.height / 2); await sleep(15); } await page.mouse.up(); await sleep(800); };
const width = async label => Math.round((await page.locator('thead th').filter({ has: page.getByRole('button', { name: 'Column options: ' + label, exact: true }) }).first().boundingBox()).width);
const measure = async (label, colIdx) => page.evaluate(([lbl, idx]) => {
  const th = [...document.querySelectorAll('thead th')].find(t => t.querySelector(`[aria-label="Column options: ${lbl}"]`)); const lab = th.querySelector('.dt-th-label'); const btn = th.querySelector('.dt-th-menu');
  const lr = lab.getBoundingClientRect(), br = btn.getBoundingClientRect(); const labSpan = lab.firstElementChild;
  const cells = [...document.querySelectorAll('tbody tr')].map(r => r.children[idx]).filter(Boolean).slice(0, 4);
  return { thWidth: Math.round(th.getBoundingClientRect().width), labelOverlapsIcon: lr.right > br.left + 1, labelTruncated: labSpan ? labSpan.scrollWidth > lab.clientWidth + 1 : null, labelTextOverflow: getComputedStyle(lab).textOverflow,
    cells: cells.map(c => { const s = getComputedStyle(c); const inner = c.querySelector('*') || c; return { text: c.innerText.trim().slice(0, 30), h: Math.round(c.getBoundingClientRect().height), overflows: c.scrollWidth > c.clientWidth + 1 || inner.scrollWidth > inner.clientWidth + 1, ellipsis: [c, ...c.querySelectorAll('*')].some(e => getComputedStyle(e).textOverflow === 'ellipsis'), title: c.getAttribute('title') || c.querySelector('[title]')?.getAttribute('title') || '' }; }) };
}, [label, colIdx]);
const setMode = async m => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(700); await page.getByText(m, { exact: true }).last().click(); await sleep(1200); await page.keyboard.press('Escape'); await sleep(400); };
const out = {};
for (const mode of ['Clip Text', 'Wrap Text']) {
  await setMode(mode);
  await drag('Due date', -600); out[mode + ' min Due date'] = await measure('Due date', 3); await shot(`1819-05-min-${mode.replace(' ', '')}`);
  await drag('Subject', 2500); out[mode + ' max Subject width'] = await width('Subject'); await drag('Subject', 2500); out[mode + ' max Subject width (2nd drag)'] = await width('Subject');
  await shot(`1819-06-max-${mode.replace(' ', '')}`);
  await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(700); await page.getByText('Reset Column Size', { exact: true }).click(); await sleep(1200); await page.keyboard.press('Escape');
  out[mode + ' after reset'] = { subject: await width('Subject'), due: await width('Due date') };
}
await setMode('Wrap Text');
return done(out);
