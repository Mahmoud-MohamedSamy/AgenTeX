// NDC-2399 setup (read-only): back up config/status, recent runs, notifications endpoints, open the integration page.
const I = '/desk/integrations/crm';
const cfg = await api('GET', `${I}/config`); const st = await api('GET', `${I}/status`); const runs = await api('GET', `${I}/runs?limit=5`);
const nCand = {}; for (const p of ['/notifications?limit=10', '/notifications/unread-count', '/iam/notifications?limit=10', '/inbox/notifications?limit=10']) nCand[p] = (await api('GET', p)).s;
await go('/settings/integrations/crm', 10000); await shot('2399-r2-00-page');
const btns = await page.locator('button').evaluateAll(b => b.map(x => x.innerText.trim()).filter(t => /connect|pause|resume|sync/i.test(t)));
return done({ cfg: cfg.j?.data, st: st.j?.data, runs: arr(runs.j?.data).map(r => ({ kind: r.kind || r.type, status: r.status, at: r.started_at || r.created_at, done: r.finished_at || r.completed_at })), nCand, btns });
