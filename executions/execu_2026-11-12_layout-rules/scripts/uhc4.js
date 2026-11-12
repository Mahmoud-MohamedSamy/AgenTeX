async (page) => {
  const p = page.__hc; const out = {};
  out.forms = (p.__last || '').replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 800);
  const dep = p.locator('#hc-department, select[name=hc-department], [id=hc-department]').first(); out.tag = await dep.evaluate(e => e.tagName);
  if (out.tag === 'SELECT') { out.opts = await dep.evaluate(e => [...e.options].map(o => o.text)); await dep.selectOption({ label: 'Customer Support' }); }
  else { await dep.click(); await p.waitForTimeout(800); out.opts = await p.getByRole('option').allInnerTexts(); await p.getByRole('option', { name: 'Customer Support' }).first().click(); }
  await p.waitForTimeout(4000);
  out.combos = await p.evaluate(() => [...document.querySelectorAll('select, button[role=combobox], [aria-haspopup=listbox]')].map(e => (e.getAttribute('aria-label') || e.name || e.id) + '=' + (e.innerText || e.value || '').trim().slice(0, 40)));
  out.labels = await p.evaluate(() => [...document.querySelectorAll('label')].map(l => l.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 40));
  out.net = p.__net; await p.screenshot({ path: EV + 'desk-hc-cs.png', fullPage: true }); return out;
}
