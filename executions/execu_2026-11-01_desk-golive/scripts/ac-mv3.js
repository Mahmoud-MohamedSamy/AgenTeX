const pr = async (m, p, b) => { const r = await api(m, p, b); return r.s + (r.s >= 300 ? ' ' + ((r.j && r.j.error && (r.j.error.message || r.j.error.code)) || r.t.slice(0, 60)).slice(0, 120) : ''); };
out.before = (await probe('MV2')); 
out.moveToMkt = await pr('POST', '/desk/tickets/' + TK.CSC + '/move', { department_id: DEP.MKT });
await sleep(2000); out.cscAfter = await probe('CSC');
out.targetsC = (await api('GET', '/desk/departments/' + DEP.CS + '/transfer-targets')).t.slice(0, 150);
return fin({ out });
