async (page) => {
  // continue on the open CRM form: M4 on a refused save, then X2 warn flow end to end
  const R = {};
  const aria = f => page.evaluate(f => { const w = document.querySelector(`[data-rule-field="${f}"]`); const i = w && w.querySelector('input'); if (!i) return null; const ids = (i.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); return { invalid: i.getAttribute('aria-invalid'), describedby: ids.map(id => { const e = document.getElementById(id); return id + '=' + (e ? e.innerText.slice(0, 80) : 'missing'); }), alerts: [...document.querySelectorAll('[role=alert],[aria-live=assertive],[aria-live=polite]')].map(e => (e.getAttribute('role') || e.getAttribute('aria-live')) + ':' + e.innerText.slice(0, 60)).filter(s => s.length > 8).slice(0, 5), focused: document.activeElement && (document.activeElement.closest('[data-rule-field]') || {}).getAttribute?.('data-rule-field') }; }, f);
  try {
    const back = page.getByRole('button', { name: 'Go back' }); if (await back.count()) { await back.first().click(); await sleep(1000); }
    await typeIn('qa_vr_note', 'fine note');
    const ph = wrap('qa_vr_phone').locator('input').first(); await ph.fill('+99955555'); await ph.press('Tab'); await sleep(1500);
    await save(); await sleep(1500);
    R.M4_refused = await aria('qa_vr_phone'); R.M4_msg = (await wrap('qa_vr_phone').innerText()).replace(/\s+/g, ' ').slice(0, 120);
    await page.screenshot({ path: EV + 'crm-M4-refused.png' });
    // X2
    await ph.fill('+201001234567'); await ph.press('Tab'); await sleep(1200);
    await pick('qa_vr_pick', 'Reject'); await typeIn('qa_vr_pct', '20');
    await save(); await sleep(1500);
    const dlg = page.locator('[role=alertdialog],[role=dialog]').last();
    R.X2_dialog = (await dlg.count()) ? (await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 300) : 'no dialog';
    await page.screenshot({ path: EV + 'crm-X2-warn.png' });
    const any = page.getByRole('button', { name: 'Save anyway' }); if (await any.count()) { await any.first().click(); await sleep(5000); }
    R.X2_url = page.url(); R.X2_after = (await bodyText()).slice(0, 200);
    await page.screenshot({ path: EV + 'crm-X2-saved.png' });
  } catch (e) { R.err = String(e.message).slice(0, 250); }
  return R;
}
