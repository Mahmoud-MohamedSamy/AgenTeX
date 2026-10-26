// NDC-2404 (paused): Desk contact with the CRM contact's phone + ticket; then resume and classify.
const B = '/desk/integrations/crm', DC = '43004ce2-577f-4eda-b00a-0750fe40c3d4', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const s = v => ({ kind: 'string', value: v }); const ph = '+201005552404'; const out = {};
const c = await api('POST', `/modules/${DC}/records`, { layout_id: 'bcac166e-d4e6-4d1c-b319-f07d4dbc0d4d', data: [{ field: 'first_name', value: s('QA RT') }, { field: 'last_name', value: s('2404 desk') }, { field: 'phone', value: s(ph) }] }); const dc = c.j?.data?.id; out.deskContact = c.s + ' ' + (dc || c.t.slice(0, 150));
const mk = async (subj, extra) => { const r = await api('POST', `/modules/${T}/records`, { layout_id: '1b55c25d-eb27-4046-afd1-b292398b435b', data: [{ field: 'subject', value: s(subj) }, { field: 'status', value: s('Open') }, { field: 'department', value: s('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158') }, { field: 'channel', value: s('phone') }, { field: 'phone', value: s(ph) }, ...extra] }); return r.j?.data?.id || ('ERR ' + r.s + ' ' + r.t.slice(0, 150)); };
const t1 = await mk('QA RT 2404 contact ticket', dc ? [{ field: 'contact_id', value: s(dc) }] : []); const t0 = await mk('QA RT 2404 phone only', []);
out.tickets = { t1, t0 };
out.resume = (await api('POST', `${B}/resume`, {})).s; await sleep(50000);
const cl = await api('POST', `${B}/tickets/classify`, { ticket_ids: [t1, t0].filter(x => !/^ERR/.test(x)) }); out.classify = cl.s + ' ' + JSON.stringify(arr(cl.j?.data).map(x => ({ id: (x.ticket_id || x.id || '').slice(0, 8), bucket: x.bucket, reason: x.match_reason || x.matched_by || x.reason }))).slice(0, 400);
out.paused = (await api('GET', `${B}/status`)).j?.data?.paused;
return done(out);
