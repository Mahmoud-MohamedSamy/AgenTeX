const o = JSON.parse(fs.readFileSync('../a4/i10.json')); const NM = { [A1]: 'Test User 1', [SAMY]: 'Mahmoud Samy', [OWNER]: 'owner' }; const R = {};
const orig = (await api('GET', '/desk/assignment/notification-settings')).j?.data; fs.writeFileSync('../a4/i10-switch-orig.json', JSON.stringify(orig));
R.before = { direct: orig.direct_rules_enabled, rr: orig.round_robin_rules_enabled };
const KEY = JSON.parse(fs.readFileSync('../a4/i10.json')).R.key; const run = async lbl => { const t = await mkTicket('I10', { description: KEY, owner: null }, lbl); await sleep(20000); const g = await getTicket(t.id);
  return { id: t.id, owner: NM[g.owner] || g.owner || 'none', hist: arr((await api('GET', `/desk/tickets/${t.id}/history`)).j?.data).reverse().map(x => x.occurred_at.slice(11, 23) + ' ' + x.action + ':' + (x.field_key || '') + ':' + (NM[x.new_value] || String(x.new_value || '').slice(0, 10)) + ' ' + (x.actor?.kind || '') + '/' + (x.source || '')) }; };
try {
  R.on = (await api('PUT', '/desk/assignment/notification-settings', { ...orig, direct_rules_enabled: true })).s; await sleep(5000);
  R.onSeen = (await api('GET', '/desk/assignment/notification-settings')).j?.data?.direct_rules_enabled;
  R.both = await run('both apply direct on');
  const wfOff = await api('POST', '/workflow/rules/' + o.wr + '/deactivate', {}); R.wfOff = wfOff.s;
  R.assignOnly = await run('assignment only'); R.wfOn = (await api('POST', '/workflow/rules/' + o.wr + '/activate', {})).s;
} finally { R.off = (await api('PUT', '/desk/assignment/notification-settings', orig)).s; const now = (await api('GET', '/desk/assignment/notification-settings')).j?.data; R.restored = now.direct_rules_enabled === orig.direct_rules_enabled && now.round_robin_rules_enabled === orig.round_robin_rules_enabled; }
const prev = JSON.parse(fs.readFileSync('../a4/i10.json')); prev.b = R; fs.writeFileSync('../a4/i10.json', JSON.stringify(prev, null, 1)); log(JSON.stringify(R, null, 1));
