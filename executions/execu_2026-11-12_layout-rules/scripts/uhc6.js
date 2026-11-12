async (page) => {
  const p = page.__hc; const home = '__HOME__'.replace(/\/$/, ''); const out = {}; p.__net = [];
  await p.goto(home + '/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
  const choose = async (id, val) => { await p.locator('#' + id).click(); await p.waitForTimeout(700); await p.getByRole('option', { name: val, exact: true }).first().click(); await p.waitForTimeout(2500); };
  await choose('hc-department', 'Customer Support');
  out.combos0 = await p.evaluate(() => [...document.querySelectorAll('button[role=combobox], [aria-haspopup=listbox]')].map(e => e.id + '=' + e.innerText.trim().slice(0, 30)));
  const ft = out.combos0.find(c => /form/i.test(c)); if (ft) { const id = ft.split('=')[0]; await p.locator('#' + id).click(); await p.waitForTimeout(700); out.formOpts = await p.getByRole('option').allInnerTexts(); await p.getByRole('option', { name: 'QA LR1112 HC form' }).first().click(); await p.waitForTimeout(4000); }
  const state = async () => p.evaluate(() => { const o = {}; for (const el of document.querySelectorAll('[id^=hc-]')) { const id = el.id; if (!/qa_lr/.test(id)) continue; const r = el.getBoundingClientRect(); o[id.replace('hc-', '')] = (r.height > 0 ? 'shown' : 'hidden') + (el.getAttribute('aria-required') === 'true' || el.required ? '+req' : ''); } return o; });
  out.labels = await p.evaluate(() => [...document.querySelectorAll('label')].map(l => l.innerText.trim()).filter(t => /QA|LR|type|note|tier|order|filter/i.test(t)));
  out.ids = await p.evaluate(() => [...document.querySelectorAll('[id^=hc-]')].map(e => e.id).filter(i => /qa_lr/.test(i)));
  out.s0 = await state(); await p.screenshot({ path: EV + 'desk-G17-0.png', fullPage: true });
  out.formNet = p.__net; return out;
}
