const o = {}; const F7 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f07.json', 'utf8'));
const p = await api('PATCH', '/desk/departments/' + F7.dA, { name: 'QA RT21 BP Dept A', agent_user_ids: [] }); o.patch = E(p);
const r = await api('DELETE', '/desk/departments/' + F7.dA); o.del = E(r); LED('department delete ' + F7.dA + ' (Dept A) after removing owner from it: patch ' + p.s + ', delete ' + E(r));
for (const k of ['dA', 'dB']) { const g = await api('GET', '/desk/departments/' + F7[k]); o['get' + k] = g.s + ' active=' + g.j?.data?.is_active; }
const all = L((await api('GET', '/desk/departments?limit=200')).j?.data); o.listRT21BP = all.filter(d => /QA RT21 BP/.test(d.name)).map(d => d.name + ' active=' + d.is_active);
o.bps = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).filter(b => /QA RT21 BP/.test(b.definition?.name || b.name || '')).map(b => (b.definition?.name || b.name) + '=' + b.isActive);
const bin = await api('GET', '/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20BP&limit=100'); o.binLeft = L(bin.j?.data).filter(x => /QA RT21 BP/.test(JSON.stringify(x))).length;
const cs = (await api('GET', '/desk/departments/' + CS)).j?.data; o.cs = { n: cs.agent_user_ids.length, ces2: cs.agent_user_ids.includes(AG_A), vo: cs.view_only_agent_user_ids };
return o;
