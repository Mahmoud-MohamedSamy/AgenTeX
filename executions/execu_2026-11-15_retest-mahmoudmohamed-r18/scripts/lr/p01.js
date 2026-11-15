const mid = await modId(); const dm = await modId('deals'); const out = { mid, dm };
out.me = (await api('GET', '/iam/me')).s;
out.rules = (await rules(mid)).map(r => r.name + '|' + r.status + '|' + r.layoutId);
out.layouts = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).map(l => l.id + ' ' + l.name + (l.isDefault ? ' DEF' : ''));
const F = await fieldsOf(mid); out.nf = F.length; out.qa = F.filter(f => /^qa_/.test(f.fieldName)).map(f => f.fieldName);
return out;
