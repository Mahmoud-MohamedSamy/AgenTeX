const o = JSON.parse(fs.readFileSync(RUN + '/out/rv1.json', 'utf8'));
const e = await execs(o.TK.TR06, o.R.RVTR06);
const h = arr((await api('GET', `/desk/tickets/${o.TK.TR06}/history`)).j?.data?.items || (await api('GET', `/desk/tickets/${o.TK.TR06}/history`)).j?.data);
const tg = await api('POST', '/desk/tags', { name: 'zz wf rv92b', department_id: DEPT2 });
return { runs: e.map(x => (x.evaluatedAt || '').slice(11, 19) + ' ' + x.triggerKind + ' ' + outcome(x)), history: h.slice(0, 8).map(x => (x.created_at || x.at || '').slice(11, 19) + ' ' + x.action + ' ' + (x.actor_type || x.source || '') + ' ' + JSON.stringify(x.changes || x.details || '').slice(0, 140)), tagCreate: tg.s + ' ' + tg.t.slice(0, 200) };
