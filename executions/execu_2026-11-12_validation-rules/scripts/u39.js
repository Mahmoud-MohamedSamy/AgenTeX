async (page, ctx) => {
  // I8: editor open, session ends (cookies + storage cleared), then Save
  const X = globalThis.__IDS; const R = {};
  try {
    await page.goto(HOST + '/settings/modules-and-fields/' + X.mid + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
    await page.getByPlaceholder(/search rules/i).first().fill('I8 session'); await sleep(1200);
    await page.locator('tbody tr').filter({ hasText: 'I8 session' }).first().getByRole('button').first().click(); await sleep(2500);
    const d = page.locator('[role=dialog]').last(); await d.locator('textarea').first().fill('changed after session ended');
    R.storageKeys = await page.evaluate(() => Object.keys(localStorage).filter(k => /tok|auth|session|user/i.test(k)));
    await ctx.clearCookies(); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    const resp = []; const h = r => { if (/validation-rules/.test(r.url()) && r.request().method() !== 'GET') resp.push(r.request().method() + ' ' + r.status()); }; page.on('response', h);
    await d.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(5000); page.off('response', h);
    R.calls = resp; R.url = page.url(); R.dialogStill = await page.locator('[role=dialog]').count();
    R.text = ((await bodyText()).match(/(sign in|session|expired|log in|unauthori[sz]ed|error|could not)[^.]{0,120}/i) || ['no message'])[0];
    await page.screenshot({ path: EV + 'crm-I8-expired.png' });
  } catch (e) { R.err = String(e.message).slice(0, 250); }
  return R;
}
