const iso = ms => new Date(Date.now() + ms).toISOString().slice(0, 19) + 'Z';
const r = await mkRule('TD13run', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: 60, offsetMode: 'wall_clock' }, [FU({ qa_ndc_company_name: 'DATEFU' }), { type: 'AddTicketComment', commentBody: 'QA WF date comment', commentPublic: false }]);
const t = await mkTicket('TD13run', { due_date: iso(60e3) });
const got = await waitFor(async () => { const e = await execs(t.id, r.id); return e.length && e[0].dispatches && e[0].dispatches.every(d => d.status !== 'Pending') ? e : null; }, 420, 15000);
await sleep(10000);
const cm = arr((await api('GET', `/desk/tickets/${t.id}/comments`)).j?.data).map(c => c.body_html);
return { save: r.s, field: (await getTicket(t.id)).qa_ndc_company_name || null, comments: cm, dispatch: (got || []).flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + (d.lastError ? ' ' + String(d.lastError).slice(0, 120) : ''))) };
