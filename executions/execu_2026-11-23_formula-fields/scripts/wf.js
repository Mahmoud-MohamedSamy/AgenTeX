const path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation'; const RUN = P + '/executions/execu_2026-11-23_formula-fields';
const { chromium } = require(path.join(P, 'node_modules/playwright-core')); const { share } = JSON.parse(fs.readFileSync(RUN + '/out/webform.json', 'utf8'));
(async () => { const b = await chromium.launch({ headless: true, channel: 'msedge' }); const pg = await b.newPage({ viewport: { width: 1400, height: 900 } }); setTimeout(() => process.exit(3), 200000).unref();
  await pg.goto(share, { waitUntil: 'domcontentloaded', timeout: 120000 }); await pg.waitForTimeout(8000);
  const frame = pg.frames().find(f => /feedback/.test(f.url()) && f !== pg.mainFrame()) || pg.mainFrame();
  const inputs = await frame.locator('input, textarea').evaluateAll(xs => xs.map(x => (x.name || x.id || x.placeholder || x.type))); console.log('inputs', inputs);
  const fill = async (re, v) => { const el = frame.locator('input, textarea').filter({ has: frame.locator(':scope') }); const all = frame.locator('input:visible, textarea:visible'); const n = await all.count(); for (let i = 0; i < n; i++) { const a = all.nth(i); const k = [await a.getAttribute('name'), await a.getAttribute('id'), await a.getAttribute('placeholder'), await a.getAttribute('aria-label')].join(' '); if (re.test(k)) { await a.fill(v); return k; } } return null; };
  console.log('subject', await fill(/subject/i, 'QA FX H14 webform')); console.log('name', await fill(/last|name/i, 'QA FX Webform')); console.log('email', await fill(/mail/i, 'qa.fx.webform@example.com'));
  await pg.screenshot({ path: RUN + '/screenshots/raw/H14-webform-filled.png' });
  const btn = frame.getByRole('button', { name: /submit|send/i }).first(); console.log('submit buttons', await btn.count()); if (await btn.count()) { await btn.click(); await pg.waitForTimeout(6000); }
  console.log('after', (await frame.locator('body').innerText()).slice(0, 300).replace(/\n+/g, ' | ')); await pg.screenshot({ path: RUN + '/screenshots/raw/H14-webform-sent.png' }); await b.close(); })();
