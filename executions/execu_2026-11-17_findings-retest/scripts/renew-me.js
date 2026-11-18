// Refreshes my own saved sign-in (scratchpad r18-own.json): opens Desk headless WITHOUT the access cookie so the app renews it with the refresh cookie, then saves. Prints no secrets.
const fs = require('fs'), path = require('path');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const ST = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/3d6c9864-52e6-4e9d-95a9-14042dfac39c/scratchpad/r18-own.json';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
module.exports = async function renewMe(app) {
  const st = JSON.parse(fs.readFileSync(ST, 'utf8'));
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ storageState: { ...st, cookies: st.cookies.filter(c => c.name !== 'aw_staging_access_token') } });
  const pg = await ctx.newPage();
  await pg.goto('https://staging-' + (app || 'desk') + '.taviportal.com/hq', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
  let got = false; for (let i = 0; i < 30; i++) { await pg.waitForTimeout(1000); if ((await ctx.cookies()).find(c => c.name === 'aw_staging_access_token')) { got = true; break; } }
  await pg.waitForTimeout(1500); if (got) await ctx.storageState({ path: ST }); await b.close();
  if (!got) throw new Error('refresh failed - sign in again');
};
