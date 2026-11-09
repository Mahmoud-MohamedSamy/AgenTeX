// Holds one browser context per agent (each its own sign-in) and keeps presence as set in out/presence-ctl.json:
// {"a1":"on"|"off", ...}. "on" = channels all true + heartbeat every 45 s; "off" = channels all false, no heartbeat.
// Stops when out/presence-ctl.json has "stop": true. Saves storage state back after each loop. Prints no secrets.
const path = require('path'); const fs = require('fs');
const P = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const RUN = P + '/executions/execu_2026-11-06_desk-assignment-skills';
const { chromium } = require(path.join(P, 'node_modules/playwright-core'));
const H = 'https://staging-desk.taviportal.com'; const API = H + '/api/v1';
const CTL = RUN + '/out/presence-ctl.json'; const STAT = RUN + '/out/presence-stat.json';
const names = ['a1', 'a2', 'a3'];
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'msedge' });
  const S = {};
  for (const n of names) { const ctx = await b.newContext({ storageState: RUN + '/out/' + n + '.json' }); const page = await ctx.newPage();
    await page.goto(H + '/', { waitUntil: 'commit', timeout: 120000 }); await page.waitForTimeout(8000); await page.goto("about:blank"); S[n] = { ctx, page, last: null }; }
  const call = async (n, m, p, body) => { const ctx = S[n].ctx; const t = ((await ctx.cookies()).find(x => x.name === 'aw_staging_access_token') || {}).value;
    if (!t) { await S[n].page.goto(H + '/', { waitUntil: 'commit', timeout: 120000 }).catch(() => {}); await S[n].page.waitForTimeout(6000); await S[n].page.goto("about:blank").catch(() => {}); return 'NO_TOKEN'; }
    const r = await ctx.request.fetch(API + p, { method: m, headers: { authorization: 'Bearer ' + t, 'x-app-key': 'desk', 'content-type': 'application/json' }, data: body ? JSON.stringify(body) : undefined, failOnStatusCode: false }); return r.status(); };
  for (;;) {
    let ctl = {}; try { ctl = JSON.parse(fs.readFileSync(CTL, 'utf8')); } catch (e) {}
    if (ctl.stop) break;
    // one-off agent actions: out/agent-do.json = [{id, who, m, p, body}] ; results appended to out/agent-do-result.json
    try { const DO = RUN + '/out/agent-do.json'; if (fs.existsSync(DO)) { const L = JSON.parse(fs.readFileSync(DO, 'utf8')); fs.unlinkSync(DO);
      for (const d of L) { const ctx = S[d.who].ctx; const t = ((await ctx.cookies()).find(x => x.name === 'aw_staging_access_token') || {}).value;
        const r = await ctx.request.fetch(API + d.p, { method: d.m, headers: { authorization: 'Bearer ' + t, 'x-app-key': 'desk', 'content-type': 'application/json' }, data: d.body ? JSON.stringify(d.body) : undefined, failOnStatusCode: false });
        const tx = await r.text(); fs.writeFileSync(RUN + '/out/do-' + d.id + '.json', tx);
        fs.appendFileSync(RUN + '/out/agent-do-result.json', JSON.stringify({ id: d.id, s: r.status(), t: tx.slice(0, 400) }) + '\n'); } } } catch (e) { fs.appendFileSync(RUN + '/out/agent-do-result.json', JSON.stringify({ err: String(e.message).slice(0, 200) }) + '\n'); }
    const st = { at: new Date().toISOString() };
    for (const n of names) { const want = ctl[n] || 'on';
      try {
        if (want === 'on') { const a = S[n].last !== 'on' ? await call(n, 'PUT', '/desk/agents/me/presence', { channels: { email: true, chat: true, phone: true } }) : '-'; const h = await call(n, 'POST', '/desk/agents/me/presence/heartbeat', { active: true }); st[n] = 'on ' + a + ' ' + h; }
        else if (want === 'emailoff') { const a = S[n].last !== 'emailoff' ? await call(n, 'PUT', '/desk/agents/me/presence', { channels: { email: false, chat: true, phone: true } }) : '-'; const h = await call(n, 'POST', '/desk/agents/me/presence/heartbeat', { active: true }); st[n] = 'emailoff ' + a + ' ' + h; }
        else if (want === 'out') { const a = S[n].last !== 'out' ? await call(n, 'POST', '/desk/agents/me/presence/sign-out') : '-'; st[n] = 'out ' + a; }
        else { const a = S[n].last !== 'off' ? await call(n, 'PUT', '/desk/agents/me/presence', { channels: { email: false, chat: false, phone: false } }) : '-'; st[n] = 'off ' + a; }
        S[n].last = want; await S[n].ctx.storageState({ path: RUN + '/out/' + n + '.json' });
      } catch (e) { st[n] = 'ERR ' + String(e.message).slice(0, 80); }
    }
    fs.writeFileSync(STAT, JSON.stringify(st)); if (Object.values(st).some(v => /\s\d{3}/.test(String(v)))) fs.appendFileSync(STAT + '.log', JSON.stringify(st) + '\n');
    // short loop so control changes apply within ~5 s; heartbeat effectively every loop
    for (let i = 0; i < 5; i++) { await new Promise(r => setTimeout(r, 1000)); let c2 = {}; try { c2 = JSON.parse(fs.readFileSync(CTL, 'utf8')); } catch (e) {} if (JSON.stringify(c2) !== JSON.stringify(ctl)) break; }
  }
  for (const n of names) await S[n].ctx.storageState({ path: RUN + '/out/' + n + '.json' }).catch(() => {});
  await b.close(); console.log('keepalive stopped');
})().catch(e => { console.error('ERR', String(e.message).replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>')); process.exit(1); });
