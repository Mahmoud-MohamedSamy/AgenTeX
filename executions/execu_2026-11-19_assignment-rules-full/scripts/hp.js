const q = '?department_id=' + IDS.DA; const o = {};
o.types = sh(await api('GET', '/desk/skill-types' + q)); o.typesNoQ = sh(await api('GET', '/desk/skill-types'));
const sk = (await api('GET', '/desk/skills' + q)).j?.data; o.skill0 = JSON.stringify((sk?.skills || sk || [])[0]).slice(0, 500);
const led = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => /QA AR SK1 auto|QA AR limit/.test(l)).map(l => l.match(/[0-9a-f-]{36}/)[0]);
for (const id of led) { const r = (await api('GET', '/modules/' + T + '/records/' + id)).j?.data?.data || []; o['rec_' + id.slice(0, 6)] = r.filter(f => /skill/i.test(f.field)).map(f => f.field + '=' + JSON.stringify(f.value).slice(0, 200)); const d = (await api('GET', '/desk/tickets/' + id + '/skills')); o['dsk_' + id.slice(0, 6)] = sh(d); }
return o;
