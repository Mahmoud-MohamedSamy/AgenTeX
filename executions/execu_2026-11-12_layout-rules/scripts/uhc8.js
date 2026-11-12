async (page) => {
  const p = page.__hc; const home = '__HOME__'.replace(/\/$/, ''); const out = {};
  await p.goto(home + '/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const choose = async (id, val) => { await p.locator('#' + id).click(); await p.waitForTimeout(700); await p.getByRole('option', { name: val, exact: true }).first().click(); await p.waitForTimeout(3000); };
  await choose('hc-department', 'Customer Support'); await choose('hc-form-type', 'QA LR1112 HC form');
  out.state = await p.evaluate(() => { const o = {}; for (const el of document.querySelectorAll('[id^=hc-qa_lr]')) o[el.id.replace('hc-', '')] = el.getBoundingClientRect().height > 0 ? 'shown' : 'hidden'; return o; });
  out.labels = await p.evaluate(() => [...document.querySelectorAll('label')].map(l => l.innerText.trim()).filter(t => /QA LR1112/.test(t)));
  await p.screenshot({ path: EV + 'desk-G18-hc.png', fullPage: true }); return out;
}
