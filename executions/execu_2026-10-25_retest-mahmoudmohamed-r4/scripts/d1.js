const out = {};
const mods = arr((await api('GET', '/modules')).j?.data); out.m2250 = mods.map(m => (m.labels?.en || m.moduleKey) + ' | lastModifiedByName=' + JSON.stringify(m.lastModifiedByName) + ' createdBy=' + (m.createdByName || m.createdBy || '').toString().slice(0, 20));
const teams = arr((await api('GET', '/teamspaces')).j?.data); out.ts = teams.map(t => t.id + ' ' + t.name);
const dt = await api('POST', '/custom-datatypes', { key: 'qa_rt_dt4', label: 'QA RT dt4', base_datatype_key: 'single_line', icon: 'type' }); out.dt = dt.s + ' ' + (dt.s >= 300 ? dt.t.slice(0, 150) : '');
const listed = JSON.stringify((await api('GET', '/fields/datatypes')).j).includes('qa_rt_dt4'); out.dtListed = listed;
const prof = await api('GET', '/iam/profiles'); out.profiles = arr(prof.j?.data).filter(p => /Desk/.test(p.name)).map(p => (p.id || p.profile_id) + ' ' + p.name);
return done(out);
