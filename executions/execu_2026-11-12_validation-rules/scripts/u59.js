async (page) => { const R = {}; const net = []; const h = r => { if (/blueprint-transitions\/|verify/.test(r.url()) && r.request().method() === 'POST') net.push(r.url().split('/').slice(-2).join('/') + ' ' + r.status()); }; page.on('response', h);
  try {
    await page.mouse.click(778, 710); await sleep(500); await page.keyboard.type('BAD-bp', { delay: 50 }); await page.keyboard.press('Tab'); await sleep(2500);
    R.panel = ((await bodyText()).match(/QA to Reject Moves.{0,250}/) || [''])[0];
    await page.getByRole('button', { name: 'Run', exact: true }).last().click(); await sleep(4000);
    R.after = ((await bodyText()).match(/(cannot start with BAD.{0,40}|QA VR1112 BP \/ \w+|Something went wrong.{0,60}|could not.{0,60})/g) || []).slice(0, 5);
    await page.screenshot({ path: EV + 'desk-G18-bad.png' });
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  page.off('response', h); R.net = net; return R; }
