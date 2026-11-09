// Regression batch: A2 / A3 / D3 triggers, F1 saved comment, F2 dept scope, B15 with a contact, B09 custom action.
const R = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const ev = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
const cY = 'ef75e54b-34ef-4be0-9901-559747bbb303';
R.A2 = { rule: await mkRule('A2', ev(['agent_response']), cmt('A2')) };
R.A3 = { rule: await mkRule('A3', ev(['comment'], { comments: 'public' }), cmt('A3')) };
R.D3any = { rule: await mkRule('D3any', { kind: 'SpecificFieldChanged', fieldNames: ['description', 'resolution', 'language'], fieldMatch: 'any' }, cmt('D3any')) };
R.D3all = { rule: await mkRule('D3all', { kind: 'SpecificFieldChanged', fieldNames: ['description', 'resolution', 'language'], fieldMatch: 'all' }, cmt('D3all')) };
R.D3four = (await mkRule('D3four', { kind: 'SpecificFieldChanged', fieldNames: ['description', 'resolution', 'language', 'phone'], fieldMatch: 'any' }, cmt('D3four')));
for (const t of ['A2', 'A3', 'D3any', 'D3all']) R[t].ticket = await mkTicket(t);
R.B15 = { rule: await mkRule('B15c', { kind: 'RecordCreated' }, [{ type: 'UpdateRelatedRecord', relatedLookupField: 'contact_id', fieldUpdates: { title: { kind: 'string', stringValue: 'QA WF B15 set by rule' } } }]) };
R.B15.ticket = await mkTicket('B15c', { contact_id: cY });
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF F1 saved comment', type: 'AddTicketComment', isActive: true, action: { type: 'AddTicketComment', order: 0, commentBody: 'QA WF F1 fired (saved action)', commentPublic: false } });
const said = sa.j?.data?.id; R.F1save = sa.s; if (said) { track('savedAction', said, 'F1'); R.F1 = { rule: await mkRule('F1', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', standaloneActionId: said }]) }; R.F1.ticket = await mkTicket('F1'); }
R.F2 = { rule: await mkRule('F2', { kind: 'RecordCreated' }, cmt('F2'), { departmentIds: [HR] }) }; R.F2.hr = await mkTicket('F2', { department: HR }); R.F2.cs = await mkTicket('F2');
const ca = await api('POST', '/workflow/custom-actions', { sourceId: 'aca6d31d-5631-4421-88c4-c28c6414c49c', name: 'QA WF B09 echo', description: 'QA WF B09 retest, no inputs', method: 'GET', path: '/anything/qa-wf-b09', targetApps: ['desk'], status: 'active', inputBindings: [], dependencies: [], errorMappings: [], outputMappings: [] });
R.B09ca = ca.s + ' ' + (ca.j?.data?.id || ca.t.slice(0, 200)); if (ca.j?.data?.id) { track('customAction', ca.j.data.id, 'B09'); R.B09 = { rule: await mkRule('B09', { kind: 'RecordCreated' }, [{ type: 'RunCustomAction', customActionId: ca.j.data.id, customActionInputs: {} }]) }; R.B09.ticket = await mkTicket('B09'); }
return fin(R);
