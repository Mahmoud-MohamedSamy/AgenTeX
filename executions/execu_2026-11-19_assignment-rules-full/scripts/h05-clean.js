const o = { skills: [], types: [] }; const D = IDS.DA;
for (const k of ['H05_S1', 'H05_S2', 'H05_S3', 'H05_S4']) o.skills.push((await api('DELETE', '/desk/skills/' + IDS[k] + '?department_id=' + D)).s);
for (const k of ['H05_TX', 'H05_TY']) o.types.push((await api('DELETE', '/desk/skill-types/' + IDS[k] + '?department_id=' + D)).s);
await sleep(4000); let ids = [], cur = null; do { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200' + (cur ? '&cursor=' + cur : '')); for (const x of arr(r.j)) if (/QA H05/.test(x.record_label || '')) ids.push(x.id); cur = r.j && r.j.meta && r.j.meta.next_cursor; } while (cur);
o.bin = ids.length; if (ids.length) o.purge = (await api('POST', '/audit/recycle-bin/delete', { ids })).s;
o.left = (await api('GET', '/desk/skills?department_id=' + D)).j.data.skills.map(s => s.name);
o.typesLeft = (await api('GET', '/desk/skill-types?department_id=' + D)).j.data.types.map(t => t.name);
LED('H05 cleanup: ' + JSON.stringify(o)); return o;
