const B = JSON.parse(fs.readFileSync(RUN + '/out/acc-baseline.json', 'utf8'));
const pr = arr((await api('GET', '/iam/profiles?app_key=crm')).j?.data); const k = Object.keys(pr[0] || {});
const f = arr((await api('GET', `/modules/${B.campId}/fields`)).j?.data); const lay = arr((await api('GET', `/modules/${B.campId}/layouts`)).j?.data);
const me = (await api('GET', '/iam/users/me')).j?.data || (await api('GET', '/iam/me')).j?.data;
return { profKeys: k, admin: pr.filter(p => /admin/i.test(p.name)).map(p => ({ name: p.name, id: p.id || p.profileId || p.profile_id })), me: JSON.stringify(me).slice(0, 300), fields: f.map(x => (x.apiName || x.api_name) + (x.required || x.isRequired ? '*' : '') + ':' + (x.dataType || x.type)).slice(0, 25), layouts: lay.map(l => l.name + ':' + l.id) };
