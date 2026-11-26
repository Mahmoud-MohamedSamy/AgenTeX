const I = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8'));
const r = await api('GET', `/iam/profiles/${I.crmManagerProfile}/permissions`); const d = r.j?.data; const l = Array.isArray(d) ? d : d?.permissions || [];
const ts = arr((await api('GET', '/teamspaces')).j?.data); const det = [];
for (const t of ts) { const g = await api('GET', `/teamspaces/${t.id}`); det.push({ name: t.name, accessMode: t.accessMode, s: g.s, keys: Object.keys(g.j?.data || {}), body: JSON.stringify(g.j?.data).slice(0, 700) }); }
const mp = await api('GET', `/iam/profiles/${I.crmManagerProfile}/module-permissions`); const pr = await api('GET', `/iam/profiles/${I.crmManagerProfile}`);
return { keys: l.map(x => x.permissionKey + (x.effect && x.effect !== 'GRANT' ? '(' + x.effect + ')' : '')), modulePerms: { s: mp.s, b: (mp.t || '').slice(0, 300) }, profileKeys: Object.keys(pr.j?.data || {}), profileBody: JSON.stringify(pr.j?.data).slice(0, 900), det };
