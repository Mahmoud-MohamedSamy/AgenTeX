async (page) => {
  const p = page.__hc; const out = {};
  const choose = async (id, val) => { await p.locator('#' + id).click(); await p.waitForTimeout(700); out['opts_' + id] = await p.getByRole('option').allInnerTexts(); await p.getByRole('option', { name: val, exact: true }).first().click(); await p.waitForTimeout(2500); };
  const state = async () => p.evaluate(() => { const o = {}; for (const el of document.querySelectorAll('[id^=hc-qa_lr]')) { const lab = document.querySelector('label[for="' + el.id + '"]'); o[el.id.replace('hc-', '')] = (el.getBoundingClientRect().height > 0 ? 'shown' : 'hidden') + ((lab && /\*/.test(lab.innerText)) || el.required || el.getAttribute('aria-required') === 'true' ? '+req' : ''); } return o; });
  await choose('hc-qa_lr_type', 'Refund'); out.refund = await state(); await p.screenshot({ path: EV + 'desk-G17-refund.png', fullPage: true });
  await choose('hc-qa_lr_tier', 'Gold'); out.gold = await state();
  // G19: while type=Refund the filter field is hidden by the rule: is it or its options anywhere in the DOM?
  out.filterInDom = await p.evaluate(() => /qa_lr_filter|QA LR1112 filter/.test(document.documentElement.outerHTML));
  out.formResponseHasFilterOptions = /"qa_lr_filter"[^}]*"options":\["X"/.test(p.__last || '') ? 'yes (form definition sends X/Y/Z/W)' : (/qa_lr_filter/.test(p.__last || '') ? 'field listed' : 'no');
  await choose('hc-qa_lr_type', 'Question'); out.question = await state();
  await choose('hc-qa_lr_type', 'Refund');
  // submit without note
  const fill = async (sel, v) => { const i = p.locator(sel).first(); if (await i.count()) await i.fill(v); };
  await fill('#hc-contact\.last_name, input[name="contact.last_name"]', 'QA LR1112 HC'); await fill('#hc-email, input[type=email]', 'qa.lr1112.hc@example.com'); await fill('#hc-subject, input[name=subject]', 'QA LR1112 HC G17');
  out.inputs = await p.evaluate(() => [...document.querySelectorAll('input,textarea')].filter(i => i.type !== 'hidden').map(i => (i.id || i.name) + '=' + (i.value ? 'set' : '')));
  await p.getByRole('button', { name: /submit/i }).last().click(); await p.waitForTimeout(4000);
  out.afterSubmitNoNote = { path: new URL(p.url()).pathname.split('/').slice(-2).join('/'), errors: await p.evaluate(() => [...document.querySelectorAll('[role=alert], [aria-invalid=true], .text-red-600, [class*=error]')].map(e => (e.innerText || e.id).trim()).filter(Boolean).slice(0, 6)) };
  await p.screenshot({ path: EV + 'desk-G17-submit-nonote.png', fullPage: true });
  return out;
}
