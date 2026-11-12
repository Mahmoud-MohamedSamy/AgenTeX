const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const rid = S.e1.rule;
const NM = { '876ce871-2b02-4854-89a7-68050391c62b': 'Test User 1', '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4': 'Dev Team 2', [OWNER]: 'owner' };
const online = arr((await api('GET', '/desk/queues/agents')).j?.data?.agents).filter(x => x.presence?.online).map(x => NM[x.user_id] || x.user_id.slice(0, 6));
const t = await mkTicket('E2E1', { priority: 'urgent', owner: null }, 'urgent no owner'); await sleep(20000);
const g = await getTicket(t.id); const h = arr((await api('GET', `/desk/tickets/${t.id}/history`)).j?.data).map(x => x.action + ':' + (x.field_key || '') + ':' + String(x.new_value || '').slice(0, 12));
const ex = arr2((await api('GET', `/workflow/executions?recordId=${t.id}`)).j?.data).filter(e => e.ruleId === rid);
S.e1c = { online, id: t.id, owner: NM[g.owner] || g.owner || 'none', hist: h, d: ex.flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status)), rule: JSON.stringify((await api('GET', '/workflow/rules/' + rid)).j?.data?.actions?.[0]).slice(0, 250) };
fs.writeFileSync('../a4/e2e134.json', JSON.stringify(S, null, 1)); log(JSON.stringify(S.e1c, null, 1));
