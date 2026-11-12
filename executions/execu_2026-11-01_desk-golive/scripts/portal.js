// Customer (Help Center) lane. Signs in ONCE, keeps state in scratchpad/state-portal.json.
// Usage: node portal.js <step.js> <outname>   step.js body gets (page, ctx, HC, out, shot)
const fs = require('fs'), path = require('path'); const P = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX';
const S = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/f8ef493a-ea8b-46bf-90e4-4def7dea2502/scratchpad';
const RUN = P + '/executions/execu_2026-11-01_desk-golive';
const HC = 'https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const scrub = s => String(s).replace(/("?[\w-]*(token|secret|password|cookie|authorization|bearer)[\w-]*"?\s*[:=]\s*)"[^"]*"/gi, '$1"***"');
(async () => {
  const out = {}; const SF = S + '/state-portal.json';
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const ctx = await b.newContext({ viewport: { width: 1366, height: 860 }, ...(fs.existsSync(SF) ? { storageState: SF } : {}) });
  const page = await ctx.newPage(); page.on('dialog', d => d.accept().catch(() => {}));
  const NET = []; page.on('response', async r => { const q = r.request(); if (q.method() !== 'GET' || /\/api\//.test(r.url())) { if (!/\.(js|css|png|svg|woff2?)$/.test(r.url())) NET.push({ m: q.method(), u: r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 160), s: r.status(), t: scrub((await r.text().catch(() => '')).slice(0, 300)) }); } });
  const shot = n => page.screenshot({ path: RUN + '/evidence/raw/' + n + '.png' });
  try {
    await page.goto(HC + 'tickets', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
    if (/sign-in/.test(page.url())) {
      const C = JSON.parse(fs.readFileSync(S + '/creds.json', 'utf8')).portal;
      await page.locator('input[type=email], input[name=email]').first().fill(C.user);
      await page.locator('input[type=password]').first().fill(C.pw);
      await page.getByRole('button', { name: /^Sign in$/ }).last().click(); await page.waitForTimeout(7000);
      out.signedIn = !/sign-in/.test(page.url()); out.afterSignIn = page.url().replace(HC, '~/');
      if (!out.signedIn) out.signInMsg = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300);
      else await ctx.storageState({ path: SF });
    }
    const step = new Function('page', 'ctx', 'HC', 'out', 'shot', 'NET', 'return (async () => {' + fs.readFileSync(process.argv[2], 'utf8') + '})()');
    if (out.signedIn !== false) await step(page, ctx, HC, out, shot, NET);
    await ctx.storageState({ path: SF });
  } catch (e) { out.ERR = e.message.slice(0, 300); }
  out.NET = NET.filter(x => !/realtime|heartbeat|_next|analytics/.test(x.u)).slice(-40);
  fs.writeFileSync(RUN + '/wave4/raw/' + process.argv[3] + '.json', scrub(JSON.stringify(out, null, 1)));
  console.log('saved', process.argv[3]); await b.close();
})();
