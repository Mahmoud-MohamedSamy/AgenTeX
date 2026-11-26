const TECH = '19510fdc-91f3-4a7a-8888-153f1318b765';
const before = (await api.O('POST', '/desk/agents/departments/query', { agent_user_ids: [U.O, U.S], user_ids: [U.O, U.S] })).j?.data?.departments_by_agent;
const r = await api.O('DELETE', '/desk/departments/' + ST.D2, { transfer_to_department_id: TECH }); ledger('delete QA PA Dept 2 (transfer to Tech) -> ' + r.s);
const after = (await api.O('POST', '/desk/agents/departments/query', { agent_user_ids: [U.O, U.S], user_ids: [U.O, U.S] })).j?.data?.departments_by_agent;
const same = k => { const b = (before[U[k]] || []).filter(x => x !== ST.D2), a = after[U[k]] || []; return b.length === a.length && b.every(x => a.includes(x)); };
const d1 = await api.O('PATCH', '/desk/departments/' + ST.D1, { is_active: false }); 
return { del: E(r), O_same: same('O'), S_same: same('S'), d1deactivate: E(d1) };
