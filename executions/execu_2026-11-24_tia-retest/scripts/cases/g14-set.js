const f = RUN + '/out/g14-policy-before.json';
let p = (await api('GET', '/ai/policy')).j?.data;
if (process.env.MODE === 'zero') {
  fs.writeFileSync(f, JSON.stringify(p, null, 1));
  const d = JSON.parse(JSON.stringify(p.descriptor)); d.features.tia = { ...d.features.tia, daily_credit_cap: 0 };
  const r = await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: d });
  const g = await api('POST', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' });
  ledger(`G-14: AI policy tia daily_credit_cap → 0 (${r.s}, was ${JSON.stringify(p.descriptor.features.tia)}); Desk Agent ai:tia:use GRANT (${g.s}) — revert after`);
  return { put: r.s, err: r.j?.error?.code, before: p.descriptor.features.tia, version: r.j?.data?.version, grant: g.s };
} else {
  const B = JSON.parse(fs.readFileSync(f, 'utf8'));
  const r = await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: B.descriptor });
  const del = await api('DELETE', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions/ai:tia:use`);
  p = (await api('GET', '/ai/policy')).j?.data; const perms = arr((await api('GET', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`)).j?.data);
  ledger(`G-14: AI policy restored (${r.s}) tia=${JSON.stringify(p.descriptor.features.tia)}; Desk Agent ai:tia:use removed (${del.s})`);
  return { put: r.s, sameAsBefore: JSON.stringify(p.descriptor) === JSON.stringify(B.descriptor), tia: p.descriptor.features.tia, version: p.version, perm: del.s, deskAgentHasTia: perms.some(x => x.permissionKey === 'ai:tia:use'), permCount: perms.length };
}
