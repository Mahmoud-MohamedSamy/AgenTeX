async (page) => { const X = globalThis.__IDS; const R = {};
  try { await openCreate(X.mid, X.lid); await typeIn('qa_vr_text', 'BAD-m4'); await save(); await sleep(1500);
    R.msg = (await wrap('qa_vr_text').innerText()).replace(/\s+/g, ' ').slice(0, 120);
    R.aria = await page.evaluate(() => { const w = document.querySelector('[data-rule-field="qa_vr_text"]'); const i = w && w.querySelector('input'); return i && { invalid: i.getAttribute('aria-invalid'), describedby: i.getAttribute('aria-describedby'), alerts: [...document.querySelectorAll('[role=alert],[aria-live]')].map(e => e.innerText.slice(0, 50)).filter(Boolean).slice(0, 4), focused: (document.activeElement.closest('[data-rule-field]') || {}).getAttribute?.('data-rule-field') }; });
    await page.screenshot({ path: EV + 'desk-M4-refused.png' });
  } catch (e) { R.err = String(e.message).slice(0, 200); } return R; }
