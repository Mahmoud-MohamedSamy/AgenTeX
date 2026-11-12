async (page, ctx) => {
  const { p } = globalThis.__hc;
  await p.goto('https://staging-crm.taviportal.com/help/<hc-key from out/.hchome>/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const labels = await p.locator('label').allInnerTexts();
  const combos = await p.locator('select, button[role=combobox]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.name || e.id || '').slice(0, 40)));
  await p.screenshot({ path: EV + 'desk-hc-form.png', fullPage: true });
  return { url: p.url(), labels: labels.map(s => s.trim()).filter(Boolean).slice(0, 40), combos };
}
