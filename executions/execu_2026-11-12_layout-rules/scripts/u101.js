async (page, ctx) => { const R = {}; const share = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules/out/webform.json', 'utf8')).share;
  const p = await ctx.newPage(); const net = []; p.on('response', async r => { if (r.request().method() === 'POST') net.push(r.status() + ' ' + r.url().replace(/fw1\.[A-Za-z0-9._-]+/, '<key>').slice(-80) + ' :: ' + (await r.text().catch(() => '')).replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 300)); });
  await p.goto(share, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R.labels = (await p.locator('label').allInnerTexts()).slice(0, 10);
  const fill = async (lab, v) => { const i = p.getByLabel(lab, { exact: false }).first(); if (await i.count()) await i.fill(v); else R['miss_' + lab] = 1; };
  await fill('Subject', 'QA LR1112 G14 webform'); await fill('Last Name', 'QA LR1112 G14'); await fill('Email', 'qa.lr1112.g14@example.com');
  const sel = p.getByLabel('QA LR1112 type').first(); R.selTag = await sel.evaluate(e => e.tagName).catch(() => 'none'); if (R.selTag === 'SELECT') await sel.selectOption('Refund'); else { await sel.click().catch(() => {}); await p.waitForTimeout(600); await p.getByRole('option', { name: 'Refund' }).first().click().catch(() => { R.typeFail = 1; }); }
  await p.waitForTimeout(1000); R.orderVisible = await p.getByLabel('QA LR1112 order').first().isVisible().catch(() => false);
  await p.getByRole('button', { name: /Submit|Send/i }).first().click(); await p.waitForTimeout(5000);
  R.after = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); R.net = net.slice(-3); await p.screenshot({ path: EV + 'desk-G14.png', fullPage: true }); await p.close(); return R; }
