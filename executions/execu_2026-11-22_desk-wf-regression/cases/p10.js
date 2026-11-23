const TU1 = '876ce871-2b02-4854-89a7-68050391c62b', DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const all = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data); const r = all.find(x=>x.name==='QA WF P9edit');
const pe = await patchTicket((await mkTicket('P9edit', { department: DEPT2 }, 'noowner')).id, {}); // placeholder
const a = await mkTicket('P9edit', { department: DEPT2, owner: TU1 }, 'withowner');
const b = await mkTicket('P9edit', { department: DEPT2 }, 'noowner2');
await sleep(30000);
const ea = await execs(a.id, r.id);
const p = await patchTicket(a.id, { owner: DEV2 });
return { withOwnerOnCreate: ea.map(e => outcome(e) + ' ' + e.triggerKind + ' ' + e.evaluatedAt.slice(11,19)), withoutOwner: await fired(b.id, r.id), ownerPatch: p.s + ' ' + (p.err||'').slice(0,300), createdAt: (await getTicket(a.id)).created_at };
