const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 90) : ''); };
out.list = (await listQA()).ids.filter(x => /^[A-Z]/.test(x)).join(',');
for (const k of ['MK1', 'HR1', 'SA1', 'MV1']) out[k] = st(await probe(k));
out.editMK1 = await pr('PATCH', '/modules/' + TM + '/records/' + TK.MK1, { data: [{ field: 'priority', value: sv('low') }] });
out.cmtHR1 = await pr('POST', '/desk/tickets/' + TK.HR1 + '/comments', { body_html: '<p>QA AC D comment HR1 org scope</p>', is_private: true });
await go('/views/all/tickets/' + TK.MK1, 9000); out.ui = (await mtxt()).slice(0, 200); await shot('access/d-mk1-orgscope');
return fin({ out });
