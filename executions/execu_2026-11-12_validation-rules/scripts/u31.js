async (page) => {
  // D26: date operators and value input in the editor
  const A = globalThis.__APP; const X = globalThis.__IDS; const R = {};
  try {
    await page.goto(HOST + '/settings/modules-and-fields/' + X.mid + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
    await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
    const dd = page.locator('[role=dialog]').last(); const btn = l => dd.getByRole('button', { name: l, exact: true }).first();
    await btn('Layout').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 Layout' }).first().click(); await sleep(900);
    await btn('Field to check').click(); await sleep(700); await page.getByRole('option').filter({ hasText: X.field || 'QA VR1112 date' }).first().click(); await sleep(1200);
    if (!/Condition 1/.test(await dd.innerText())) { await btn('Add condition').click().catch(() => {}); await sleep(800); }
    const t = dd.getByText('is empty', { exact: true }).last();
    await t.scrollIntoViewIfNeeded(); await sleep(500);
    R.opTag = await t.evaluate(e => { const b = e.closest('button,[role=combobox],select'); return e.tagName + ' / ' + (b ? b.tagName + ' role=' + b.getAttribute('role') : 'none'); });
    await t.click(); await sleep(1000);
    const pop = page.locator('[role=listbox], [role=menu], [data-radix-popper-content-wrapper]').last();
    R.ops = ((await pop.innerText().catch(() => '')) || '').split('\n').map(x => x.trim()).filter(Boolean);
    await shot(A + '-D26-date-ops', false);
    const p = page.getByRole('option').filter({ hasText: /before|less than|earlier/i }).first();
    if (await p.count()) { R.picked = (await p.innerText()).trim(); await p.click(); await sleep(900); }
    R.inputs = await dd.evaluate(x => [...x.querySelectorAll('input')].map(i => i.type + ':' + (i.placeholder || '') + ':' + (i.getAttribute('aria-label') || '')).filter(s => s.indexOf('radio') !== 0));
    R.condText = ((await dd.innerText()).replace(/\s+/g, ' ').match(/Condition 1.{0,300}/) || [''])[0];
    await shot(A + '-D26-value', false);
    await btn('Cancel').click().catch(() => {}); await sleep(800);
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  return R;
}
