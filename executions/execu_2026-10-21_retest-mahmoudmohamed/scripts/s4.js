const M2 = '9ef906c2-bdbd-4765-a600-3c724801cc71';
const me = await api('GET', '/iam/me'); const ms = arr((await api('GET', '/modules')).j?.data).map(m => m.moduleKey);
const list = await api('GET', `/modules/${M2}/records?page=1&per_page=5`); const add = await api('POST', `/modules/${M2}/records`, { data: [{ field: 'name', value: { kind: 'string', value: 'QA RT closed rec (samy)' } }] });
return { who: me.j?.data?.email, profiles: (me.j?.data?.profiles || []).map(p => p.name), listed: ms.includes('desk_qa_rt_closed') || ms.includes('qa_rt_closed'), list: list.s + ' ' + list.t.slice(0, 120), create: add.s + ' ' + add.t.slice(0, 160) };
