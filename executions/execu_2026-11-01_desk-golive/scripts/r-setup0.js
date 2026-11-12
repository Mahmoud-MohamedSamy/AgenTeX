const o = {};
const wr = await api('GET', '/workflow/rules?take=200'); o.rules = arr(wr.j && wr.j.data).filter(r => (r.moduleId || r.module_id) === T && (r.isActive || r.is_active)).map(r => [r.name, JSON.stringify(r.trigger || r.executeOn || '').slice(0, 80), JSON.stringify(r.criteria || r.conditions || r.conditionGroups || '').slice(0, 160)]);
for (const [k, d] of [['mkt', DQ], ['cs', DCS], ['sales', DS]]) { const r = await api('GET', `/desk/departments/${d}/agents`); o[k] = r.s + ' ' + JSON.stringify(arr(r.j && r.j.data).map(a => (a.email || a.user_email || a.name || '').split('@')[0])).slice(0, 300); }
const s = await api('GET', '/mail/signatures/me'); o.sig = sh(s);
const st = await api('GET', '/desk/settings/attachments'); o.attSet = sh(st);
return fin(o);
