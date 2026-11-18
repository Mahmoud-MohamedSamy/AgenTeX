const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 120) : ''); };
const snap = async id => { const f = flat(D((await api('GET', '/modules/' + TM + '/records/' + id)).j) || {}); return [f.department === DEP.SAL ? 'Sales' : f.department === DEP.MKT ? 'Marketing' : f.department === DEP.CS ? 'CS' : (f.department || '').slice(0, 8), f.status, (f.owner && f.owner.slice ? f.owner.slice(0, 8) : 'none'), '#' + f.ticket_number, f.priority].join('/'); };
const P = '/desk/tickets/' + TK.MV1;
out.prep = [await pr('PATCH', '/modules/' + TM + '/records/' + TK.MV1, { data: [{ field: 'status', value: sv('On Hold') }, { field: 'priority', value: sv('low') }] }), await pr('POST', P + '/comments', { body_html: '<p>QA AC MV1 comment before move</p>', is_private: true })];
out.before = await snap(TK.MV1); out.cBefore = (await api('GET', P + '/comments')).j?.data?.length;
out.targets = (await api('GET', '/desk/departments/' + DEP.MKT + '/transfer-targets')).t.slice(0, 200);
out.neg = { same: await pr('POST', P + '/move', { department_id: DEP.MKT }), bogus: await pr('POST', P + '/move', { department_id: '00000000-0000-0000-0000-0000000000ab' }), notUuid: await pr('POST', P + '/move', { department_id: 'x' }), ownerNotInTarget: await pr('POST', P + '/move', { department_id: DEP.SAL, owner_id: US.C }) };
out.move = await pr('POST', P + '/move', { department_id: DEP.SAL });
await sleep(3000); out.after = await snap(TK.MV1); out.cAfter = (await api('GET', P + '/comments')).j?.data?.length;
const h = await api('GET', P + '/history'); out.hist = JSON.stringify(D(h.j)).match(/.{0,80}(move|department)[^"]{0,80}/gi)?.slice(0, 4);
// move with owner picked in target
out.move3 = await pr('POST', '/desk/tickets/' + TK.MV3 + '/move', { department_id: DEP.SAL, owner_id: US.B }); await sleep(2000); out.mv3 = await snap(TK.MV3);
return fin({ out });
