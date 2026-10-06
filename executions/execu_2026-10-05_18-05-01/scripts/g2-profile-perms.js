// Read-only: metadata permissions held by the Desk Agent and CRM Admin profiles.
const out = {};
for (const [n, id] of [['Desk Agent', '44444444-4444-4444-4444-444444444402'], ['Desk Light Agent', '44444444-4444-4444-4444-444444444403'], ['Desk Administrator', '44444444-4444-4444-4444-444444444401']]) {
  const e = await api('GET', `/iam/profiles/${id}/effective`); const p = await api('GET', `/iam/profiles/${id}/permissions`);
  const s = JSON.stringify(e.j) + JSON.stringify(p.j);
  out[n] = { effective: e.s, perms: p.s, metadata: [...new Set(s.match(/metadata[.:][a-z_.:]+/g) || [])] };
}
const crm = arr((await api('GET', '/iam/profiles')).j.data).find(x => x.name === 'CRM Admin');
const ce = await api('GET', `/iam/profiles/${crm.profileId}/effective`); out['CRM Admin'] = { effective: ce.s, metadata: [...new Set(JSON.stringify(ce.j).match(/metadata[.:][a-z_.:]+/g) || [])] };
page.off('request', onReq);
return JSON.stringify(out);
