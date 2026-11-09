const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
const lays = arr((await api('GET', `/modules/${D}/layouts`)).j?.data); const nm = id => (lays.find(l => l.id === id) || {}).name || id;
out.layouts = lays.map(l => l.name + ' | ' + l.accessMode + ' | ' + JSON.stringify(l.assignedProfiles) + ' | default=' + l.isDefault);
const profs = arr((await api('GET', '/iam/profiles')).j?.data); const pn = id => (profs.find(p => p.profileId === id) || {}).name || id;
out.assign = arr((await api('GET', `/modules/${D}/layouts/assignments`)).j?.data).map(a => nm(a.layoutId) + ' <- ' + pn(a.profileId) + ' default=' + a.isDefault + ' ' + a.view);
const me = (await api('GET', '/iam/me')).j?.data; out.myProfiles = (me?.profiles || []).map(p => p.name);
return done(out);
