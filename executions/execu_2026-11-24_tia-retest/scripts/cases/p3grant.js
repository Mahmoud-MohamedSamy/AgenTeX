const I = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const o = {};
const perms = async id => { const r = await api('GET', `/iam/profiles/${id}/permissions`); const d = r.j?.data; return Array.isArray(d) ? d : d?.permissions || []; };
for (const [k, id] of [['deskAgent', DESK_AGENT_PROFILE], ['crmManager', I.crmManagerProfile]]) {
  const has = (await perms(id)).some(p => p.permissionKey === 'ai:tia:use');
  if (process.env.MODE === 'grant' && !has) { o[k] = (await api('POST', `/iam/profiles/${id}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' })).s; ledger(`P3: ai:tia:use granted to ${k} (${o[k]}) — remove in R`); }
  if (process.env.MODE === 'revoke' && has) { o[k] = (await api('DELETE', `/iam/profiles/${id}/permissions/ai:tia:use`)).s; ledger(`P3: ai:tia:use removed from ${k} (${o[k]})`); }
  o[k + 'Count'] = (await perms(id)).length;
}
return o;
