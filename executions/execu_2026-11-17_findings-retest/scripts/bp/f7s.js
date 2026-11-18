const o = {};
for (const k of ['A', 'B']) { const d = await api('POST', '/desk/departments', { name: 'QA RT21 BP Dept ' + k, description: 'QA RT21 BP F07 ' + (k === 'A' ? 'transfer target' : 'transfer source'), agent_user_ids: [OWNER] }); o['d' + k] = d.j?.data?.id; o['r' + k] = E(d); if (o['d' + k]) { made.other.push({ dept: o['d' + k] }); keep(); LED('department created ' + o['d' + k] + ' "QA RT21 BP Dept ' + k + '" (F07) active'); } }
const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: 'QA RT21 BP-F07 transfer ticket', description: 'QA RT21 BP F07', status: 'Open', department: o.dB, owner: OWNER }) });
o.x = r.j?.data?.id; o.rx = E(r); if (o.x) { made.tickets.push(o.x); keep(); LED('ticket created ' + o.x + ' "QA RT21 BP-F07 transfer ticket" in Dept B'); }
await sleep(5000); const x = await rec(o.x); o.xn = x.ticket_number; o.xDept = x.department;
fs.writeFileSync(RUN + '/scripts/bp/f07.json', JSON.stringify(o, null, 1)); return o;
