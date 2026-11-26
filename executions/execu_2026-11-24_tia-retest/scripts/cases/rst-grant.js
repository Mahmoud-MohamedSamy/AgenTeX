const P = DESK_AGENT_PROFILE; const perms = async () => { const r = await api('GET', `/iam/profiles/${P}/permissions`); const d = r.j?.data; const a = Array.isArray(d) ? d : (d?.permissions || d?.items || []); return a; };
const before = await perms(); const has = before.some(p => (p.permissionKey || p.permission_key || p.key) === 'ai:tia:use');
const o = { before: before.length, had: has };
if (process.env.MODE === 'grant' && !has) { o.grant = (await api('POST', `/iam/profiles/${P}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' })).s; ledger('RST: ai:tia:use granted to Desk Agent profile (' + o.grant + ') — revoke after'); }
if (process.env.MODE === 'revoke' && has) { o.revoke = (await api('DELETE', `/iam/profiles/${P}/permissions/ai:tia:use`)).s; ledger('RST: ai:tia:use removed from Desk Agent profile (' + o.revoke + ')'); }
const after = await perms(); o.after = after.length; o.hasNow = after.some(p => (p.permissionKey || p.permission_key || p.key) === 'ai:tia:use');
// tickets with departments, for the scope test
if (process.env.MODE === 'grant') { const T = arr((await api('GET', `/modules/${M.tickets}/records?page=1&per_page=60`)).j?.data); o.tickets = T.map(t => { const v = Object.fromEntries((t.data || []).map(x => [x.field, x.value?.value])); return { id: t.id, no: v.ticket_number || v.number, subj: String(v.subject || '').slice(0, 50), dept: v.department_id || t.department_id }; }); fs.writeFileSync(RUN + '/out/rst-tickets.json', JSON.stringify(o.tickets)); o.tickets = o.tickets.length; }
return o;
