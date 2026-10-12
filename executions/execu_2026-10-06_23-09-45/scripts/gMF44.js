// Read-only: Tickets layout builder → Subject → ADVANCED → Fill from "Another field on this form" → list offered fields. Nothing saved.
await step('MF44', async () => {
  const TL = (await defLayout(M.tickets)).id; await builder(M.tickets, TL);
  await fieldMenu('Subject'); await props('ADVANCED'); await sleep(500);
  const sel = page.locator('select').filter({ has: page.locator('option', { hasText: /auto-fill/i }) }).last();
  await sel.selectOption('record_field'); await sleep(900);
  const lists = await page.locator('select').evaluateAll(es => es.map(e => [...e.options].map(o => o.text)));
  const fieldList = lists.find(l => /Choose a field/i.test(l[0] || '')) || [];
  const box = await page.locator('select').filter({ has: page.locator('option', { hasText: /Choose a field/i }) }).last().boundingBox();
  const s = await shot('MF44-autofill-field-list');
  const canvas = await page.evaluate(() => [...document.querySelectorAll('label, span, div')].filter(e => e.children.length === 0 && /^(Contact Name|Status|Priority|Email|Phone|Description|Channel)\*?$/.test(e.textContent.trim())).map(e => e.textContent.trim()).slice(0, 8));
  await page.getByRole('button', { name: /^Cancel$/ }).last().click().catch(() => { }); await sleep(600);
  await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(() => { }); await sleep(800);
  const disc = page.getByRole('button', { name: /Discard|Leave|Yes/ }).last(); if (await disc.count()) await disc.click().catch(() => { });
  rec('MF44', 'INFO', `"Another field on this form" offers: ${JSON.stringify(fieldList)}; fields on the Tickets form include ${JSON.stringify(canvas)}; select box at ${JSON.stringify(box)}`, { shot: s });
});
return done();
