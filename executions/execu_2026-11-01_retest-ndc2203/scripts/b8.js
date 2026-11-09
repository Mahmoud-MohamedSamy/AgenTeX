const out = {};
const sa = await api('POST', '/workflow/actions', { moduleId: T, name: 'QA WF F1 saved comment', type: 'AddTicketComment', isActive: true, action: { type: 'AddTicketComment', order: 0, commentBody: 'QA WF F1 fired (saved action)', commentPublic: false } });
out.F1save = sa.s + ' ' + (sa.j?.data?.id || sa.t.slice(0, 250)); const said = sa.j?.data?.id; if (said) track('savedAction', said, 'F1');
if (said) { out.F1rule = await mkRule('F1', { kind: 'RecordCreated' }, [{ type: 'AddTicketComment', standaloneActionId: said }]); out.F1t = (await mkTicket('F1')).id; }
const ca = await api('POST', '/workflow/custom-actions', { sourceId: 'aca6d31d-5631-4421-88c4-c28c6414c49c', name: 'QA WF B09 echo', description: 'QA WF B09 retest, no inputs', method: 'GET', path: '/anything/qa-wf-b09', targetApps: ['desk'], status: 'active', inputBindings: [], dependencies: [], errorMappings: [], outputMappings: [] });
out.B09ca = ca.s + ' ' + (ca.j?.data?.id || ca.t.slice(0, 300)); if (ca.j?.data?.id) track('customAction', ca.j.data.id, 'B09');
if (ca.j?.data?.id) { out.B09rule = await mkRule('B09', { kind: 'RecordCreated' }, [{ type: 'RunCustomAction', customActionId: ca.j.data.id, customActionInputs: {} }]); out.B09t = (await mkTicket('B09')).id; }
await sleep(15000);
if (out.F1t) out.F1fired = arr((await api('GET', `/desk/tickets/${out.F1t}/comments`)).j?.data).filter(c => /fired/.test(c.body_html)).map(c => c.body_html);
if (out.B09t) out.B09disp = arr((await api('GET', `/workflow/executions?recordId=${out.B09t}`)).j?.data).flatMap(e => (e.dispatches || []).map(x => x.actionType + ' ' + x.status + ' ' + x.responseStatus + ' ' + (x.responseBodyTruncated || '').slice(0, 150)));
return fin(out);
