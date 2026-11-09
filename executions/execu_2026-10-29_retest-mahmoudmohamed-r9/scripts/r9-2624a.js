// NDC-2624 step 1: QA lead → field change → note. The lead id is used by the screen step (u-2624.js) and step 2.
const l = (await X.lead('o', 'QA RT 2624 timeline lead')).j?.data?.id; await sleep(3000);
const e = await api('o', 'PATCH', `/modules/${T.LEADS}/records/${l}`, { data: [{ field: 'description', value: { kind: 'string', value: 'QA RT 2624 changed' } }] });
const n = await api('o', 'POST', `/modules/${T.LEADS}/records/${l}/notes`, { body: 'QA RT 2624 note' });
return { lead: l, edit: e.s, note: n.s };
