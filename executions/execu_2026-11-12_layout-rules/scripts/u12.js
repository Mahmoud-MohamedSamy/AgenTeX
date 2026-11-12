async (page) => {
  const R = {};
  await page.getByText('Standard', { exact: true }).first().click(); await sleep(800);
  await page.getByRole('option', { name: 'QA LR1112 Layout' }).first().click().catch(async () => { await page.getByText('QA LR1112 Layout', { exact: true }).last().click(); }); await sleep(1500);
  await page.getByText('Choose the field the rule is about').first().click(); await sleep(1200);
  R.opts = await page.getByRole('option').evaluateAll(es => es.map(e => ((e.getAttribute('aria-disabled') === 'true' ? '[x] ' : '') + e.innerText.replace(/\s+/g, ' ').trim()).slice(0, 90)));
  await shot('crm-C6-primary-picker', false);
  return { n: R.opts.length, qa: R.opts.filter(s => /QA LR1112/.test(s)), sampleDisabled: R.opts.filter(s => s.startsWith('[x]')).slice(0, 12), enabled: R.opts.filter(s => !s.startsWith('[x]')).slice(0, 40) };
}
