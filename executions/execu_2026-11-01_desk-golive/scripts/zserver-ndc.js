// READ-ONLY headed Edge for NDC's Zoho Desk (portal wondertravel). Every non-GET/HEAD/OPTIONS request to *.zoho.com is
// aborted at the network layer and logged, so nothing in NDC's org can change. HTTP 127.0.0.1:8892 POST /run {code}
// runs `async (page, ctx, blocked) => {...}`. Prints no secrets.  Usage: node zserver-ndc.js <stateFile>
const http = require('http'), path = require('path'), fs = require('fs'); const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const LOG = path.join(P, 'executions/execu_2026-11-01_desk-golive/ndc-zoho/blocked.log');
(async () => {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  const b = await chromium.launch({ headless: false, channel: 'msedge' }); const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, storageState: process.argv[2] });
  const blocked = [];
  await ctx.route(/zoho\.(com|eu|in)|zohocdn|zohostatic|zohopublic/, route => { const r = route.request(); const m = r.method();
    if (['GET', 'HEAD', 'OPTIONS'].includes(m)) {
      // Even a GET is refused when its URL names an action (e.g. CtiApiConfig.do?mode=generatePhoneBridgeOauthtoken).
      const uq = r.url(); if (/[?&](mode|action|operation|op)=[^&]*(generate|save|update|delete|remove|create|add|mark|assign|move|send|execute|run|reset|revoke|enable|disable)/i.test(uq) || /\/(markAsRead|markRead|read\/mark|generate[A-Z][A-Za-z]*)\b/.test(uq)) {
        fs.appendFileSync(LOG, new Date().toISOString() + ' BLOCK-ACTION-GET ' + uq.slice(0, 200) + '\n'); blocked.push('GET-ACTION ' + uq.slice(0, 160)); return route.abort(); }
      return route.continue(); }
    const u = r.url().slice(0, 200);
    // Legacy DWR reads: allow only when EVERY method in the batch is a pure read by name.
    if (/\/DWRutil\.do|\/dwr\//.test(u)) { const pd = r.postData() || ''; const ms = [...pd.matchAll(/c\d+-(?:scriptName|methodName)=([^\r\n&]+)/g)].map(x => x[1]);
      const meths = [...pd.matchAll(/c\d+-methodName=([^\r\n&]+)/g)].map(x => x[1]);
      const ok = meths.length > 0 && meths.every(x => /^(get|list|fetch|load|is|has|check|show|view|search|count|retrieve|find)/i.test(x) && !/save|update|delete|remove|create|add|set[A-Z_]|mark|move|clone|enable|disable|activate|import|send|execute|run|reorder|publish|assign/i.test(x));
      fs.appendFileSync(LOG, new Date().toISOString() + (ok ? ' ALLOW-DWR ' : ' BLOCK-DWR ') + ms.join(',') + '\n');
      if (ok) return route.continue(); }
    if (/\/support\/(getbadge|getresource)\.acs/.test(u)) { fs.appendFileSync(LOG, new Date().toISOString() + ' ALLOW-READ ' + u + '\n'); return route.continue(); }
    blocked.push(m + ' ' + u); fs.appendFileSync(LOG, new Date().toISOString() + ' ' + m + ' ' + u + '\n'); return route.abort(); });
  let page = await ctx.newPage();
  await page.goto('https://desk.zoho.com/agent/wondertravel/all', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  http.createServer((req, res) => { let s = ''; req.on('data', d => s += d); req.on('end', async () => {
    try { const { code } = JSON.parse(s); const fn = eval(code); const out = await fn(page, ctx, blocked); res.end(JSON.stringify({ ok: true, out })); }
    catch (e) { res.end(JSON.stringify({ ok: false, err: String(e && e.message || e).slice(0, 500) })); } }); }).listen(8892, '127.0.0.1', () => console.log('zndc ready 8892'));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
