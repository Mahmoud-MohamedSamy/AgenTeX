const mid = await modId(); const me = (await api('GET', '/iam/me')).j.data; const mine = (me.profiles_by_app?.crm || []).map(p => p.profile_id);
const profs = arr((await api('GET', '/iam/profiles?app_key=crm')).j?.data).map(p => ({ ...p, id: p.profileId })); const other = profs.find(p => !mine.includes(p.id) && /user/i.test(p.name || '')) || profs.find(p => !mine.includes(p.id));
const g = (await getRule(mid, I.rF)).j.data; const b = JSON.parse(JSON.stringify(g.branches));
// X branch: message only for OTHER profile; read-only text editable for MY profile; new: read_only + mandatory on empty email2 (F8)
b[0].actions = b[0].actions.map(a => a.type === 'show_message' ? { ...a, profileIds: [other.id] } : a.type === 'read_only_fields' ? { ...a, exceptProfileIds: mine } : a);
b[1].actions.push({ type: 'read_only_fields', fields: ['qa_lr_email2'] }, req(['qa_lr_email2']));
const u = await putRule(mid, I.rF, { ...g, branches: b });
return { mine: mine.length, myNames: (me.profiles_by_app?.crm || []).map(p => p.name), other: other?.name, put: SR(u).slice(0, 300) };
