const T = 'f64e2ab2-83ae-4ec8-9441-ee94d302d8bd', TM = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const recDept = async () => { const r = await api('GET', '/modules/' + TM + '/records/' + T); const x = D(r.j) || {}; return ((x.data || []).find(d => d.field === 'department') || {}).value; };
const deskDept = async () => (D((await api('GET', '/desk/tickets/' + T)).j) || {}).department_id;
out.before = { rec: await recDept(), desk: await deskDept() };
const mv = await api('POST', '/desk/tickets/' + T + '/move', { department_id: CS }); out.move = mv.s + ' ' + mv.t.slice(0, 200);
await sleep(3000); out.after = { rec: await recDept(), desk: await deskDept() };
const back = await api('POST', '/desk/tickets/' + T + '/move', { department_id: MK }); out.back = back.s; await sleep(2000); out.final = { rec: await recDept(), desk: await deskDept() };
return fin({ out });
