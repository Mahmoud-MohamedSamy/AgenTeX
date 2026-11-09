// Poll staging health (read-only) until /iam/me and /modules answer 200, up to 25 min.
const t0 = Date.now(); const log = [];
for (let i = 0; i < 25; i++) { const a = await api('GET', '/iam/me').catch(e => ({ s: 'ERR' })); const b = await api('GET', '/modules').catch(e => ({ s: 'ERR' })); const c = await api('GET', '/audit/events?app_key=crm&limit=1').catch(e => ({ s: 'ERR' }));
  log.push(new Date().toISOString().slice(11, 16) + ' me=' + a.s + ' modules=' + b.s + ' audit=' + c.s); if (a.s === 200 && b.s === 200) break; await sleep(60000); }
return { minutes: Math.round((Date.now() - t0) / 60000), log };
