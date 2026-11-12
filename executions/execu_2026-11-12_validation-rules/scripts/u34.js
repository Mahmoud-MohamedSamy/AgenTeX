async (page) => {
  // CRM form: E7 (verify on hidden field), H9 (verify while typing + warn on save), M4 (aria on refused save), X2 (warn flow end to end)
  const X = globalThis.__IDS; const R = {}; const calls = [];
  const h = r => { if (/validation-rules\/verify/.test(r.url())) calls.push((r.postData() || '').slice(0, 160)); };
  try {
    await openCreate(X.mid, X.lid); page.on('request', h);
    await typeIn('first_name', 'QA VR1112 ui34');
    // E7: url hidden until pick = Done
    R.E7_urlVisible = await vis('qa_vr_url');
    await typeIn('qa_vr_text', 'e7 text'); await typeIn('qa_vr_phone', '+201001234567'); await sleep(1500);
    R.E7_callsWhileHidden = calls.filter(c => /qa_vr_url/.test(c)).length; R.E7_callsTotal = calls.length;
    R.E7_urlErrText = await wrap('qa_vr_url').innerText().catch(() => 'no wrapper');
    // H9: phone verify while typing
    calls.length = 0; const ph = wrap('qa_vr_phone').locator('input').first(); await ph.fill(''); await ph.pressSequentially('+99912345', { delay: 60 }); await ph.press('Tab'); await sleep(2500);
    R.H9_callsTyping = calls.length; R.H9_phoneMsg = (await wrap('qa_vr_phone').innerText()).replace(/\s+/g, ' ').slice(0, 200);
    // M4: aria on the invalid field
    R.M4_aria = await page.evaluate(() => { const w = document.querySelector('[data-rule-field="qa_vr_phone"]'); const i = w && w.querySelector('input'); if (!i) return null; const ids = (i.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean); return { invalid: i.getAttribute('aria-invalid'), describedby: ids.map(id => { const e = document.getElementById(id); return id + '=' + (e ? e.innerText.slice(0, 80) : 'missing'); }), live: [...w.querySelectorAll('[role=alert],[aria-live]')].map(e => (e.getAttribute('role') || '') + '/' + (e.getAttribute('aria-live') || '') + ':' + e.innerText.slice(0, 60)) }; });
    await page.screenshot({ path: EV + 'crm-H9-verify.png' });
    // fix phone, set note to warn, save -> warn dialog
    await ph.fill('+201001234567'); await ph.press('Tab'); await sleep(1500);
    await typeIn('qa_vr_note', 'please warn me');
    await save(); await sleep(1500);
    R.H9_afterSave = ((await bodyText()).match(/QA H9 note says warn.{0,200}/) || ['no warn text'])[0];
    R.H9_dialog = (await page.locator('[role=alertdialog],[role=dialog]').count()) ? (await page.locator('[role=alertdialog],[role=dialog]').last().innerText()).replace(/\s+/g, ' ').slice(0, 300) : 'no dialog';
    await page.screenshot({ path: EV + 'crm-H9-warn.png' });
    // E7: now pick Done -> url shows -> type bad -> verify
    page.off('request', h);
    return R;
  } catch (e) { R.err = String(e.message).slice(0, 250); page.off('request', h); return R; }
}
