const n = require('./bp/ndc'); const { call, CS } = n;
(async () => {
  const s = await call('owner', 'GET', '/desk/ticket-statuses'); console.log('statuses', (s.json?.data?.statuses || []).map(x => x.value + '/' + x.type).join(', '));
  const h = await call('owner', 'GET', '/desk/happiness/settings'); const hd = h.json?.data || {}; console.log('happiness', h.status, JSON.stringify({ on: hd.is_enabled, scope: hd.department_scope_enabled, depts: hd.department_ids, send_on_close: hd.send_on_close, keys: Object.keys(hd).join(',') }));
  const d = await call('owner', 'GET', '/desk/departments/' + CS); console.log('CS dept', d.status, JSON.stringify({ name: d.json?.data?.name, vis: d.json?.data?.visibility, hc: d.json?.data?.display_in_help_center }));
  const hc = await call('owner', 'GET', '/help-centers'); console.log('help centers', hc.status, JSON.stringify(hc.json?.data).slice(0, 400));
  const m = await call('owner', 'GET', '/modules'); const mods = (m.json?.data || m.json?.data?.modules || []); const arr = Array.isArray(mods) ? mods : (mods.modules || []); console.log('contacts module', arr.filter(x => /contact/i.test(x.key || x.name)).map(x => x.id + ' ' + x.key).join(' | '));
})();
