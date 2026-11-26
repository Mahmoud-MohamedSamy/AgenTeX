const SUP = '44444444-4444-4444-4444-444444444404', KEY = 'desk:approvals:view_department';
const add = await api.O('POST', `/iam/profiles/${SUP}/permissions`, { permission_key: KEY, effect: 'GRANT' }); ledger('A13 restore GRANT -> ' + add.s);
await sleep(4000); const ok = (await api.O('GET', `/iam/profiles/${SUP}/permissions`)).t.includes(KEY); const l = (await inbox('A', { list: 'all_pending' })).s;
result('A13', ok && l === 200 ? 'PASS' : 'FAIL', `remove "${KEY}" from Desk Supervisor -> 204; Supervisor A: All pending 403 APPROVALS_LIST_FORBIDDEN, permissions all_pending false, count hidden; restored (GRANT) -> ${add.s}, permission back ${ok}, All pending ${l}`);
return { add: E(add), ok, l };
