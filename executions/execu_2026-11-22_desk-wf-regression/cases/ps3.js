const o = {};
for (const [n, id] of Object.entries({ agent: '44444444-4444-4444-4444-444444444402', light: '44444444-4444-4444-4444-444444444403', reviewer: '44444444-4444-4444-4444-444444444405', supervisor: '44444444-4444-4444-4444-444444444404' })) {
  const p = arr((await api('GET', `/iam/profiles/${id}/permissions`)).j?.data).filter(x => /^workflow/.test(x.permissionKey)).map(x => x.permissionKey + ':' + x.effect);
  const e = (await api('GET', `/iam/profiles/${id}/effective`)).j?.data; const es = JSON.stringify(e || '');
  o[n] = { direct: p, effective: [...new Set(es.match(/workflow:[a-z_:]+/g) || [])] };
}
return o;
