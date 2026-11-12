async (page) => { const X = globalThis.__IDS; const R = {};
  try {
    await openCreate(X.mid, X.lid); await typeIn('first_name', 'QA VR1112 X6 user'); await save(); await sleep(1500);
    R.userBlocked = ((await bodyText()).match(/QA X6 ml is required/) || ['not blocked'])[0];
    const t0 = Date.now();
    await page.goto(HOST + '/settings/modules-and-fields/' + X.mid + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(4000);
    await page.getByPlaceholder(/search rules/i).first().fill('X6'); await sleep(1200);
    const row = page.locator('tbody tr').filter({ hasText: 'X6 broken' }).first(); R.found = await row.count();
    await row.getByRole('switch').first().click(); await sleep(2500); R.toast = ((await bodyText()).match(/(turned off|disabled|deactivated|updated|saved)[^.]{0,80}/i) || [''])[0];
    R.switchNow = await row.getByRole('switch').first().getAttribute('aria-checked'); R.adminSeconds = Math.round((Date.now() - t0) / 1000);
    await page.screenshot({ path: EV + 'crm-X6-off.png' });
    await openCreate(X.mid, X.lid); await typeIn('first_name', 'QA VR1112 X6 user'); await save(); await sleep(3000);
    R.userAfter = page.url().includes('/records/new') ? 'still on form: ' + ((await bodyText()).match(/QA X6[^.]{0,60}/) || [''])[0] : 'saved ' + page.url().split('/').pop();
  } catch (e) { R.err = String(e.message).slice(0, 250); }
  return R; }
