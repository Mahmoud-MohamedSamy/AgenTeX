// Sign in to TAVI CRM in a headless Edge and save storage state (password from the Edge export, never printed).
// Usage: node tlogin.js <email> <outState>
require('dns').setDefaultResultOrder('ipv4first');
const path = require('path'), fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const [email, out] = process.argv.slice(2);
const row = fs.readFileSync(path.join(P, 'docs/Credentials/Microsoft Edge Passwords.csv'), 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).map(l => l.split(',')).find(c => c[0] === 'staging-crm.taviportal.com' && c[2] === email);
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 950 } }); const pg = await ctx.newPage();
  await pg.goto('https://staging-crm.taviportal.com/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await pg.waitForSelector('input[type=email]', { timeout: 60000 });
  await pg.fill('input[type=email]', email); await pg.fill('input[type=password]', row.slice(3).join(','));
  const btn = pg.locator('button[type=submit]').first();
  console.log('submit enabled:', await btn.isEnabled().catch(() => 'n/a'));
  await btn.click();
  for (let i = 0; i < 60; i++) {
    await pg.waitForTimeout(1000);
    if (!/\/login/.test(pg.url())) break;
    const t = await pg.innerText('body').catch(() => '');
    if (/too many|429/i.test(t)) { console.log('STOP 429'); process.exit(3); }
    if (/Choose an organization/.test(t)) await pg.click('text=' + (process.env.ORG || 'Wonder Travel')).catch(() => {});
    if (i === 10) console.log('page after 10 s:', t.replace(/\s+/g, ' ').slice(0, 300));
  }
  await pg.waitForTimeout(4000); console.log('url', pg.url(), 'tenant', await pg.evaluate(() => localStorage.getItem('aw_auth_tenant_id')));
  await ctx.storageState({ path: out }); await b.close();
})().catch(e => { console.error('ERR', e.message.split('\n')[0]); process.exit(1); });
