async (page) => { const X = globalThis.__IDS; const R = {}; const net = [];
  const h = r => { if (/blueprint-transitions\/|validation-rules\/verify/.test(r.url()) && r.request().method() === 'POST') net.push(r.url().split('/').slice(-2).join('/') + ' ' + r.status() + ' ' + (r.request().postData() || '').slice(0, 160)); }; page.on('response', h);
  try {
    if (globalThis.__APP === 'desk') { await page.goto(HOST + '/modules/' + X.mid + '/records/' + X.rec, { waitUntil: 'domcontentloaded' }); await sleep(15000); } else await openRec(X.mid, X.rec);
    const b = page.getByRole('button', { name: 'QA to Reject' }).first(); R.btn = await b.count(); await b.click(); await sleep(2500);
    const d = page.locator('[role=dialog]').last(); R.form = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300);
    const inp = d.locator('input[type=text], input:not([type]), textarea').first(); await inp.fill(X.first || 'BAD-bp'); await inp.press('Tab'); await sleep(1500);
    await d.getByRole('button', { name: /execute|move|save|submit|confirm|continue|apply/i }).last().click(); await sleep(3000);
    R.bad = (await page.locator('[role=dialog]').count()) ? (await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ').slice(0, 400) : 'dialog closed';
    await page.screenshot({ path: EV + (globalThis.__APP) + '-G14-bad.png' });
    if (await page.locator('[role=dialog]').count()) { const i2 = page.locator('[role=dialog]').last().locator('input[type=text], input:not([type]), textarea').first(); await i2.fill('fine-bp'); await page.locator('[role=dialog]').last().getByRole('button', { name: /execute|move|save|submit|confirm|continue|apply/i }).last().click(); await sleep(4000); }
    R.good = (await page.locator('[role=dialog]').count()) ? (await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ').slice(0, 300) : 'dialog closed';
    await page.screenshot({ path: EV + (globalThis.__APP) + '-G14-good.png' });
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  page.off('response', h); R.net = net; return R; }
