async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LID = '9f0069ec-a4a0-4f50-8342-44c1af1be1f5'; const R = {};
  const allMsgs = async () => page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].map(w => [w.getAttribute('data-rule-field'), w.innerText.replace(/\s+/g, ' ')]).filter(([f, t]) => /QA (R1|R4|E2|E6|C1)|must|cannot|required/i.test(t)));
  await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui E11');
  await typeIn('qa_vr_text', 'BAD-ui'); await save(); R.first = await allMsgs();
  await typeIn('qa_vr_text', 'GOOD-ui'); R.afterFix = await allMsgs();
  const reqs = []; page.on('response', r => { if (/\/records/.test(r.url()) && r.request().method() !== 'GET') reqs.push(r.status() + ' ' + r.request().method()); });
  await save(); R.afterSave = await allMsgs(); R.url = page.url().replace(HOST, ''); R.reqs = reqs; R.toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast],[role=status],[role=alert]')].map(e => e.innerText.replace(/\s+/g, ' ')).filter(Boolean));
  await shot('crm-E11-after-fix');
  // E2: top placement alone
  await openCreate(MID, LID); await typeIn('first_name', 'QA VR1112 ui E2'); await typeIn('qa_vr_phone', '+201001234567'); await typeIn('qa_vr_email', 'x@bad.com'); await save();
  R.E2_url = page.url().includes('/new'); R.E2_field = await page.evaluate(() => document.querySelector('[data-rule-field="qa_vr_email"]').innerText.replace(/\s+/g, ' '));
  R.E2_where = await page.evaluate(() => { const els = [...document.querySelectorAll('body *')].filter(e => e.childElementCount === 0 && /QA E2 no bad\.com emails/.test(e.textContent)); return els.map(e => { const r = e.getBoundingClientRect(); return { tag: e.tagName, y: Math.round(r.y), x: Math.round(r.x), h: r.height, parent: e.parentElement.className.slice(0, 80) }; }); });
  await page.evaluate(() => window.scrollTo(0, 0)); await sleep(500); await shot('crm-E2-top', false);
  return R;
}
