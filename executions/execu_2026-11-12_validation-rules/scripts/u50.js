async (page) => { const X = globalThis.__IDS; const R = {};
  const ctx2 = await page.context().browser().newContext({ viewport: { width: 1200, height: 900 } }); const p = await ctx2.newPage();
  const net = []; p.on('response', r => { if (/web-forms\/public/.test(r.url())) net.push(r.request().method() + ' ' + r.url().replace(/public\/[^/]+/, 'public/<key>') + ' ' + r.status()); });
  try {
    for (const [name, text] of [['QA VR1112 G12 bad', 'BAD-webform'], ['QA VR1112 G12 ok', 'fine-webform']]) {
      await p.goto('https://staging-crm.taviportal.com/embed/feedback/index.html?key=' + encodeURIComponent(X.key) + '&mode=frame', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
      const inputs = p.locator('input[type=text], input:not([type])'); const n = await inputs.count(); R['inputs_' + text] = n;
      if (n >= 2) { await inputs.nth(0).fill(name); await inputs.nth(1).fill(text); }
      await p.getByRole('button', { name: /submit|send/i }).first().click().catch(e => R.clickErr = String(e.message).slice(0, 100)); await p.waitForTimeout(5000);
      R['after_' + text] = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300);
      await p.screenshot({ path: EV + 'crm-G12-' + text + '.png' });
    }
  } catch (e) { R.err = String(e.message).slice(0, 200); }
  R.net = net; await ctx2.close(); return R; }
