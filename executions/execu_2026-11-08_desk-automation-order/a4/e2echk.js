const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const id = S.e1.ids[0];
const tg = await api('GET', `/desk/tickets/${id}/tags`); log('tagsRaw', tg.s, tg.t.slice(0, 300));
const g = await getTicket(id); log('recTags', JSON.stringify(g.tags), 'owner', g.owner);
const ex = arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).find(e => e.ruleId === S.e1.rule); log('details', JSON.stringify(ex.details).slice(0, 1200));
const h = await api('GET', `/desk/tickets/${id}/history`); log('hist', JSON.stringify(arr(h.j?.data).map(x => x.action + ':' + (x.field_key || '') + ':' + String(x.new_value || '').slice(0, 40))).slice(0, 600));
const t4 = await api('GET', `/desk/tickets/${S.e4.id}/history`); log('hist4', JSON.stringify(arr(t4.j?.data).map(x => x.action + ':' + (x.field_key || '') + ':' + String(x.new_value || '').slice(0, 40))).slice(0, 600));
const TL = arr2((await api('GET', '/desk/email-templates?take=200')).j?.data); log('useCases', JSON.stringify([...new Set(TL.map(t => t.notification_type + '/' + t.use_case))]).slice(0, 600));
