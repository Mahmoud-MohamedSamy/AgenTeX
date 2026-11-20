const o = {}; await sleep(3000);
let ids = [], cur = null, n = 0; do { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200' + (cur ? '&cursor=' + cur : '')); for (const x of arr(r.j)) { n++; if (/(^|\s)QA AR /.test(x.record_label || "") || /^QA AR/.test(x.record_label || "")) ids.push(x.id); } cur = r.j && r.j.meta && r.j.meta.next_cursor; } while (cur);
o.binScanned = n; o.binFound = ids.length; const p = []; for (let i = 0; i < ids.length; i += 25) p.push((await api('POST', '/audit/recycle-bin/delete', { ids: ids.slice(i, i + 25) })).s); o.purge = p.join(',');
const left = []; let tp = 1; for (let i = 1; i <= tp && i <= 40; i++) { const r = await api('GET', '/modules/' + T + '/records?page_size=100&page=' + i); tp = (r.j.meta || {}).total_pages || tp; for (const x of arr(r.j.data ?? r.j)) { const f = fl(x); if (/^QA AR /.test(f.subject || '')) left.push(f.subject); } } o.ticketsLeft = left.length;
const rl = [...(await rules('direct')), ...(await rules('round_robin', IDS.DA)), ...(await rules('round_robin', IDS.DB))].filter(r => /^QA AR/.test(r.name)); o.rulesLeft = rl.length;
o.skillsLeft = (await api('GET', '/desk/skills?department_id=' + IDS.DA)).j.data.skills.filter(s => /^QA AR/.test(s.name)).length;
const wf = (await api('GET', '/workflow/rules?moduleId=' + T)).j; o.wfLeft = arr(wf && (wf.data && (wf.data.items || wf.data.rules || wf.data))).filter(w => /^QA AR/.test(w.name || '')).length;
o.deptA = (await api('GET', '/desk/departments/' + IDS.DA)).j.data.agent_user_ids.map(nmU); o.deptB = (await api('GET', '/desk/departments/' + IDS.DB)).j.data.agent_user_ids.map(nmU);
LED('VERIFY: ' + JSON.stringify(o)); return o;
