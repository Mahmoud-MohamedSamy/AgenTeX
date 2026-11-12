async (page) => { const R = {}; const net = []; const h = r => { if (/blueprint-transitions\/|verify/.test(r.url()) && r.request().method() === 'POST') net.push(r.url().split('/').slice(-2).join('/') + ' ' + r.status()); }; page.on('response', h);
  try {
    const panel = page.locator('div').filter({ hasText: /^QA to Reject\s*Moves the ticket to Reject/ }).last();
    const inp = page.locator('input[type=text], textarea').filter({ hasNot: page.locator('[disabled]') });
    const box = page.getByText('Moves the ticket to Reject').locator('xpath=ancestor::div[.//input or .//textarea][1]');
    const i = box.locator('input, textarea').first(); await i.fill('BAD-bp'); await i.press('Tab'); await sleep(2000);
    R.afterType = ((await box.innerText()).replace(/\s+/g, ' ')).slice(0, 300);
    const run = box.getByRole('button').filter({ hasNotText: /cancel/i }).last(); R.runBtn = (await run.innerText()).trim(); await run.click(); await sleep(4000);
    R.after = ((await bodyText()).match(/(QA BP text[^.]{0,80}|cannot start with BAD[^.]{0,40}|Moved[^.]{0,60}|QA VR1112 BP \/ \w+)/g) || []).slice(0, 5);
    await page.screenshot({ path: EV + 'desk-G18-bad.png' });
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  page.off('response', h); R.net = net; return R; }
