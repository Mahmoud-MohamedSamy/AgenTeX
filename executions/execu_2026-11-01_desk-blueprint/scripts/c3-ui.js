// C3 TAVI designer: name/description inputs' maxlength, and what a typed 70-char name keeps. Read only (nothing saved).
// One browser context from UI_STATE, saved back after. Usage: UI_STATE=... node c3-ui.js
const path = require('path'), fs = require('fs');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const OUT = path.resolve(__dirname, '../evidence/raw');
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  try {
    await pg.goto('https://staging-desk.taviportal.com/settings/automation/blueprints/new', { waitUntil: 'domcontentloaded', timeout: 120000 });
    for (let i = 0; i < 90; i++) { await pg.waitForTimeout(1000); if (/Add State/i.test(await pg.innerText('body').catch(() => ''))) break; }
    await pg.waitForTimeout(3000);
    const inputs = await pg.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]),textarea')].filter(e => e.getBoundingClientRect().width > 0)
      .map(e => ({ t: e.type, ph: e.placeholder, aria: e.getAttribute('aria-label'), ml: e.maxLength, v: e.value, top: e.getBoundingClientRect().top | 0, left: e.getBoundingClientRect().left | 0 })));
    console.log('inputs', JSON.stringify(inputs));
    fs.writeFileSync(path.join(OUT, 'c3-ui.json'), JSON.stringify({ inputs }, null, 1));
    await pg.screenshot({ path: path.join(OUT, 'c3-ui-new.png') });
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
