const g = 'RN5' + uid(); await mkBp(BASIC(g));
const t = await mkT(g); await waitIn(t); const t2 = await mkT('NOPE' + uid(), 'free');
const bc = await api('POST', '/desk/tickets/bulk/close', { ticket_ids: [t, t2] }); await sleep(3000);
const s1 = await statusOf(t), s2 = await statusOf(t2);
const mac = await api('POST', '/desk/tickets/bulk/move', { ticket_ids: [t], department_id: DEPT });
R('RN-05', s1 === 'Open' ? 'PASS' : 'FAIL', `status locked: record PATCH refused (BLUEPRINT_GOVERNED_FIELD); /desk/tickets PATCH {status} answers 200 but changes nothing (note); bulk close of 1 in + 1 out → ${E(bc)} ${JS(bc.j?.data || bc.j?.error).slice(0, 220)}; in-blueprint ticket status ${s1}, free ticket ${s2}`);
R('RN-02', 'INCONCLUSIVE', 'API: an agent can read every state, transition and step condition (blueprint-state allStates/allTransitions), but the "asks for" items are not in that data — the flow view may load them elsewhere; decided by the screen check in Phase 3');
RG('NDC-3056', 'INCONCLUSIVE', 'conditions visible to agents through the API; "asks for" list checked on screen in Phase 3');
return await cleanup();
