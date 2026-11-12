async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
  page.on('response', async r => { if (/\/buttons(\?|$)/.test(r.url())) out.btnApi = r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300); });
  await openRec(mid, '2ca6bc00-4cbd-4d73-9f0c-08805e783556'); await sleep(2000);
  out.bar = await page.locator('[data-testid=record-rule-actions]').allInnerTexts(); return out; }
