async (page) => { const X = globalThis.__IDS; const R = {}; const net = []; const h = r => { if (/blueprint-transitions\/|verify/.test(r.url()) && r.request().method() === 'POST') net.push(r.url().split('/').slice(-2).join('/') + ' ' + r.status() + ' ' + (r.request().postData() || '').slice(0, 120)); }; page.on('response', h);
  try {
    await page.goto(HOST + '/modules/' + X.mid + '/records/' + X.rec, { waitUntil: 'domcontentloaded' }); await sleep(15000);
    await page.getByRole('button', { name: 'QA to Reject' }).first().click(); await sleep(3000); await page.screenshot({ path: EV + 'desk-G18-open.png' }); R.req = await page.getByText(/required/i).allInnerTexts();
    const label = page.getByText(/^required$/i).first(); const lb = await label.boundingBox(); R.lb = lb;
    await page.mouse.click(lb.x - 40, lb.y + 40); await sleep(500); await page.keyboard.type(X.val, { delay: 50 }); await page.keyboard.press('Tab'); await sleep(2500);
    R.panel = ((await bodyText()).match(/QA to Reject Moves.{0,250}/) || [''])[0];
    await page.screenshot({ path: EV + 'desk-G18-typed.png' });
    const run = page.getByRole('button', { name: /^Run/ }).last(); R.runEnabled = await run.isEnabled(); await run.click({ timeout: 5000 }).catch(e => R.runErr = e.message.slice(0, 80)); await sleep(4000);
    R.after = ((await bodyText()).match(/(cannot start with BAD.{0,40}|QA VR1112 BP \/ \w+|went wrong.{0,60}|could not.{0,60})/g) || []).slice(0, 5);
    await page.screenshot({ path: EV + 'desk-G18-after.png' });
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  page.off('response', h); R.net = net; return R; }
