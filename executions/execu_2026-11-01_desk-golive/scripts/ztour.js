// Read-only Zoho Desk tour: page loads + text only, never clicks Save/Delete. Headed Edge (setup does not render headless).
const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const OUT = P + '/executions/execu_2026-11-01_desk-golive/baseline/zoho'; const Z = 'https://desk.zoho.com/agent/techsolutionsegypt/haytham-mohamed';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const routes = JSON.parse(process.argv[3]);
(async () => {
  const b = await chromium.launch({ headless: false, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, storageState: process.argv[2] }); const page = await ctx.newPage();
  const res = [];
  for (const r of routes) { const o = { r };
    try { await page.goto(r.startsWith('http') ? r : Z + r, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(Number(process.env.WAIT || 25000));
      let t = await page.innerText('body').catch(() => '');
      for (const f of page.frames()) { if (f === page.mainFrame()) continue; const ft = await f.innerText('body').catch(() => ''); if (ft) t += '\n[FRAME ' + f.url().slice(0, 60) + ']\n' + ft; }
      o.url = page.url(); o.text = t.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').slice(0, 20000);
      const n = r.replace(/[^a-z0-9]+/gi, '_').slice(0, 60); await page.screenshot({ path: OUT + '/' + n + '.png' }).catch(() => {}); o.shot = n + '.png';
    } catch (e) { o.err = String(e.message).slice(0, 150); }
    res.push(o); }
  fs.writeFileSync(OUT + '/' + process.argv[4] + '.json', JSON.stringify(res, null, 1)); console.log('saved', res.map(x => x.r + ':' + (x.err ? 'ERR' : (x.text || '').length)).join(' '));
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
