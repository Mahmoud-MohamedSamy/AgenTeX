const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 120) : ' ' + r.t.slice(0, 160)); };
const sh = async k => (await api('GET', '/desk/tickets/' + TK[k] + '/shares')).t.match(/"(department_name|access)":"[^"]+"/g)?.join(',') || 'none';
out.sh1 = { before: await sh('SH1'), move: await pr('POST', '/desk/tickets/' + TK.SH1 + '/move', { department_id: DEP.SAL }) }; await sleep(2000); out.sh1.after = await sh('SH1');
out.sh2 = { before: await sh('SH2'), move: await pr('POST', '/desk/tickets/' + TK.SH2 + '/move', { department_id: DEP.CS }) }; await sleep(2000); out.sh2.after = await sh('SH2');
return fin({ out });
