const M = '064aa360-7e4b-4e0b-9e68-831c469fa6e9', id = '1508c360-e046-4bd4-a180-cb400fd9ab38'; const out = {};
const g = (await api('GET', `/modules/${M}/records/${id}`)).j?.data?.data || []; out.colour = JSON.stringify(g.find(x => x.field === 'qa_colour')?.value);
out.exec = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.outcome + ' ' + (e.evaluatedAt || '').slice(11, 19) + ' ' + JSON.stringify((e.dispatches || []).map(d => d.actionType + ':' + d.status + ' due ' + (d.scheduledFor || d.dueAt || d.runAt || '') + ' last ' + (d.lastAttemptAt || '').slice(11, 19))));
out.tl = arr((await api('GET', `/timeline/records/qa_rt_r8/${id}/feed`)).j?.data).map(e => e.entry_type + ' ' + (e.occurred_at || '').slice(11, 19)).slice(0, 5);
out.now = new Date().toISOString(); return done(out);
