const A5 = '485f9d3f-d9d5-48d4-b121-d8df14388bf9'; const out = {};
const r = await api('POST', '/workflow/rules', { moduleId: T, name: 'QA WF A5 send rating email', isActive: true, mode: 'OneTime', trigger: { kind: 'RecordUpdated' }, criteria: guard('QA WF A5 '), actions: [{ order: 0, type: 'SendHappinessEmail' }] });
out.rule = r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 200)); if (r.j?.data?.id) track('rule', r.j.data.id, 'A5send');
out.patch = await patchTicket(A5, { description: 'QA WF A5 send the rating email' }); await sleep(15000);
out.disp = arr((await api('GET', `/workflow/executions?recordId=${A5}`)).j?.data).flatMap(e => (e.dispatches || []).map(x => x.actionType + ' ' + x.status + ' ' + (x.responseBodyTruncated || x.lastError || '').slice(0, 250)));
const t = await getTicket(A5); out.fields = { link: t.happiness_link_status, rating: t.happiness_rating };
return fin(out);
