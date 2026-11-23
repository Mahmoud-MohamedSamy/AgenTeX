// Signed-out browser: open the local test pages (127.0.0.1:5500) that carry each form's "Add it to your website" code,
// check the form renders, fill it, submit, record console errors and the form's API calls. No sign-in, no secrets.
const path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const RAW = path.join(__dirname, '..', 'screenshots', 'raw');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  const out = {};
  for (const app of (process.env.APPS||'desk,crm').split(',')) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } }); const page = await ctx.newPage();
    const R = { console: [], calls: [] }; out[app] = R;
    page.on('console', m => { if (m.type() === 'error') R.console.push(m.text().slice(0, 160)); }); page.on('response', r => { if (r.status() >= 400) (R.bad = R.bad || []).push(r.status() + ' ' + r.url().replace(/fw1[^/?]+/g, '<key>').slice(0, 120)); });
    page.on('response', r => { const u = r.url(); if (/taviportal/.test(u) && !/\.(js|css|png|svg|woff2?)(\?|$)/.test(u)) R.calls.push(r.request().method() + ' ' + u.replace(/^https:\/\/[^/]+/, '').replace(/fw1\.[\w.-]+/g, '<key>').slice(0, 90) + ' → ' + r.status() + ' acao=' + (r.headers()['access-control-allow-origin'] || '-')); });
    await page.goto('http://127.0.0.1:5500/' + app + '.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(12000);
    const frames = page.frames().filter(f => f !== page.mainFrame());
    const root = frames.find(f => /taviportal/.test(f.url())) || page.mainFrame();
    R.where = root === page.mainFrame() ? 'inline' : 'iframe';
    R.text = (await root.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
    R.inputs = await root.locator('input:visible, textarea:visible, select:visible').count();
    await page.screenshot({ path: path.join(RAW, '2751-r1-' + app + '-form.png'), fullPage: true });
    // fill: text-like inputs, then any select with its first real option
    const ins = root.locator('input:visible, textarea:visible');
    for (let i = 0; i < await ins.count(); i++) {
      const el = ins.nth(i); const t = (await el.getAttribute('type')) || 'text'; const nm = ((await el.getAttribute('name')) || '') + ((await el.getAttribute('placeholder')) || '');
      if (/checkbox|radio|file|hidden|submit/.test(t)) continue; const bb = await el.boundingBox().catch(()=>null); const lab = await el.evaluate(e=>{const l=e.closest('label')||e.parentElement;return (l&&l.innerText||'')+' '+(e.getAttribute('aria-hidden')||'')+' '+(e.tabIndex<0?'tab-1':'')}).catch(()=>''); if (!bb || bb.width < 5 || bb.x < 0 || /Leave this field empty|tab-1/i.test(lab)) { (R.skipped=R.skipped||[]).push(nm||lab.slice(0,30)); continue; }
      const v = /mail/i.test(t + nm) ? 'qa.rt22.2751@example.com' : /tel|phone/i.test(t + nm) ? '01002223333' : /number/.test(t) ? '5' : /date/.test(t) ? '2026-11-20' : 'QA RT22 2751 embed ' + app;
      await el.fill(v).catch(() => {});
    }
    const sels = root.locator('select:visible'); for (let i = 0; i < await sels.count(); i++) await sels.nth(i).selectOption({ index: 1 }).catch(() => {});
    const btn = root.getByRole('button', { name: /submit|send|إرسال/i }).first();
    R.submitBtn = await btn.count();
    if (R.submitBtn) { await btn.click().catch(() => {}); for (let w = 0; w < 45; w++) { await page.waitForTimeout(2000); const tx = await root.locator('body').innerText().catch(() => ''); if (!/Sending/.test(tx)) break; } }
    { const at = (await root.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' '); R.after = at.slice(0, 120); R.errors = (at.match(/[^.]{0,60}(required|invalid|valid|must|Enter|Thank)[^.]{0,80}/gi) || []).slice(0, 6); }
    await page.screenshot({ path: path.join(RAW, '2751-r1-' + app + '-after-submit.png'), fullPage: true });
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
