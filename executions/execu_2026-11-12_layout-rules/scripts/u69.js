async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  R.rowCtrls = await page.locator('tr', { hasText: 'QA LR1112 basic' }).first().evaluate(tr => [...tr.querySelectorAll('button,[role=switch],input')].map(b => (b.getAttribute('role') || b.tagName) + ':' + (b.getAttribute('aria-label') || b.getAttribute('title') || b.innerText || '').trim()));
  await page.locator('tr', { hasText: 'QA LR1112 basic' }).locator('button').nth(1).click(); await sleep(4000);
  R.editorUnnamed = await page.evaluate(() => [...document.querySelector('main').querySelectorAll('button')].filter(b => b.getBoundingClientRect().height > 0 && !(b.getAttribute('aria-label') || b.innerText.trim())).length);
  R.moveNames = await page.evaluate(() => [...document.querySelectorAll('button[aria-label]')].map(b => b.getAttribute('aria-label')).filter(n => /condition|action|row/i.test(n)).slice(0, 8));
  // keyboard: tab through editor, record focus visibility
  await page.locator('input[placeholder^="e.g."]').focus(); const foc = []; for (let k = 0; k < 25; k++) { await page.keyboard.press('Tab'); foc.push(await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.getAttribute('aria-label') || a.innerText || a.tagName).trim().slice(0, 20) + (cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' ? '' : '(no ring)'); })); } R.tabSeq = foc;
  await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {});
  // M5 on form
  await openCreate(mid, lid); await pick('qa_lr_type', 'Refund');
  R.M5 = await page.evaluate(() => { const w = document.querySelector('[data-rule-field=qa_lr_order]'); const c = w.querySelector('input'); const h = document.querySelector('[data-rule-field=qa_lr_reason]'); const hc = h && h.querySelector('input'); return { ariaReq: c.getAttribute('aria-required'), required: c.required, hiddenTabbable: hc ? (hc.offsetParent !== null) : 'no input' }; });
  return R; }
