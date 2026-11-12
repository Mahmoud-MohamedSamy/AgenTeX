async (page, ctx) => {
  const { p } = globalThis.__hc;
  const sel = p.locator('#hc-department, [name=hc-department], select').first();
  const tag = await sel.evaluate(e => e.tagName);
  let opts = [];
  if (tag === 'SELECT') { opts = await sel.locator('option').allInnerTexts(); await sel.selectOption({ label: 'Customer Support' }).catch(() => {}); }
  else { await sel.click(); await p.waitForTimeout(800); opts = await p.getByRole('option').allInnerTexts(); await p.getByRole('option', { name: 'Customer Support' }).first().click(); }
  await p.waitForTimeout(4000);
  const labels = (await p.locator('label').allInnerTexts()).map(s => s.trim()).filter(Boolean);
  const layoutSel = await p.locator('select, button[role=combobox]').evaluateAll(es => es.map(e => (e.id || e.getAttribute('aria-label') || '') + ':' + (e.tagName === 'SELECT' ? [...e.options].map(o => o.text).join('|') : e.innerText).slice(0, 200)));
  await p.screenshot({ path: EV + 'desk-hc-form-cs.png', fullPage: true });
  return { opts: opts.slice(0, 20), labels: labels.slice(0, 40), layoutSel };
}
