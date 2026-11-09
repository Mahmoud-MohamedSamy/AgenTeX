const out = {}; const cY = '53a36bd0-491a-4595-af36-b9080afa46d2';
// B15 with a contact
out.B15t = (await mkTicket('B15', { contact_id: cY })).id;
// F1 saved action of a new type, used through standaloneActionId
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF F1 saved comment', type: 'AddTicketComment', commentBody: 'QA WF F1 fired (saved action)', commentPublic: false });
out.F1save = sa.s + ' ' + (sa.j?.data?.id || sa.t.slice(0, 250)); if (sa.j?.data?.id) track('savedAction', sa.j.data.id, 'F1');
if (sa.j?.data?.id) { out.F1rule = await mkRule('F1', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', standaloneActionId: sa.j.data.id }]); out.F1t = (await mkTicket('F1')).id; }
// F2 department scope: HR only
out.F2rule = await mkRule('F2', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', commentBody: 'QA WF F2 fired', commentPublic: false }], { departmentIds: [HR] });
out.F2hr = (await mkTicket('F2', { department: HR })).id; out.F2cs = (await mkTicket('F2')).id;
// probes (read-only GET / OPTIONS-like)
for (const p of ['/desk/custom-actions', '/integrations/custom-actions', '/custom-actions', '/desk/integrations/custom-actions', '/workflow/custom-actions', '/desk/salesiq/brands', '/desk/im/brands', '/desk/whatsapp/brands']) out[p] = (await api('GET', p)).s;
await sleep(15000);
const fired = async id => arr((await api('GET', `/desk/tickets/${id}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html);
out.F1fired = out.F1t ? await fired(out.F1t) : 'n/a'; out.F2hrFired = await fired(out.F2hr); out.F2csFired = await fired(out.F2cs);
const g = (await api('GET', `/modules/${CONTACTS}/records/${cY}`)).j?.data; const d = {}; for (const x of g?.data || []) d[x.field] = val(x.value); out.B15contactTitle = d.title;
out.B15disp = arr((await api('GET', `/workflow/executions?recordId=${out.B15t}`)).j?.data).flatMap(e => (e.dispatches || []).map(x => x.actionType + ' ' + x.status + ' ' + (x.responseBodyTruncated || '').slice(0, 120)));
return fin(out);
