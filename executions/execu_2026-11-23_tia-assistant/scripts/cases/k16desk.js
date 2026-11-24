const T = '88e8ea44-1658-4df3-9930-d0902b91073d', LAY = '1b55c25d-eb27-4046-afd1-b292398b435b';
const v = { subject: 'QA TIA <img src=x onerror=alert(1)> T5', status: 'Open', department: DESK.deptA, email: 'qa.tia.customer@example.com', channel: 'web', priority: 'medium', description: 'XSS display test <b>bold</b>' };
const r = await api('POST', `/modules/${T}/records`, { data: Object.entries(v).map(([field, x]) => ({ field, value: { kind: 'string', value: x } })), layout_id: LAY });
if (r.j?.data?.id) ledger(`Desk ticket "${v.subject}" ${r.j.data.id} (K-16 UI)`);
return { s: r.s, id: r.j?.data?.id };
