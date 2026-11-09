const id = 'f59943aa-35f7-4e29-a02e-b6d0e201d8c5'; const out = {};
out.del = (await api('o', 'DELETE', '/iam/org-units/' + id)).s; ledger(`org unit ${id} "QA RT 1343 OU" (NDC-1343) deleted: ${out.del}`);
out.stillListed = arr((await api('o', 'GET', '/iam/org-units')).j?.data).some(o => o.orgUnitId === id);
await sleep(40000);
out.audit = arr((await api('o', 'GET', '/audit/events?app_key=iam&limit=200')).j?.data).filter(e => e.target_id === id).map(e => e.action + ' by ' + e.actor_label);
return out;
