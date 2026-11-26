const RST = '9d182dfa-05f3-4af7-9685-8615a2fbe537', T = M.tickets, LAY = '1b55c25d-eb27-4046-afd1-b292398b435b';
const out = {};
const g0 = (await api('GET', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`)).j?.data || [];
out.hadTia = g0.some(p => p.permissionKey === 'ai:tia:use');
if (!out.hadTia) { const r = await api('POST', `/iam/profiles/${DESK_AGENT_PROFILE}/permissions`, { permission_key: 'ai:tia:use', effect: 'GRANT' }); out.grant = r.s; ledger(`Desk Agent profile ${DESK_AGENT_PROFILE}: GRANT ai:tia:use (${r.s}) — remove in R-02`); }
const g = (await api('GET', '/desk/departments/' + DEPT_A)).j.data; const before = g.agent_user_ids || [];
out.rstInDept = before.includes(RST);
if (!out.rstInDept) { const p = await api('PATCH', '/desk/departments/' + DEPT_A, { ...g, agent_user_ids: [...new Set([...before, RST])] }); out.dept = p.s; ledger(`Desk dept QA AO Dept A: added RST (before ${JSON.stringify(before)}) — restore in R-02`); }
const enc = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const r = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA TIA RT T1', status: 'Open', department: DEPT_A, email: 'qa.tia.customer@example.com', channel: 'web', priority: 'medium', description: 'Customer cannot download the invoice for booking QA-901; the link gives an error.' }).map(([field, x]) => ({ field, value: enc(x) })), layout_id: LAY });
out.ticket = r.s; const tid = r.j?.data?.id; if (tid) ledger(`Desk ticket "QA TIA RT T1" ${tid}`); else out.ticketErr = (r.t||'').slice(0,300);
const all = ids(); all.deptA_before = before; all.t1 = tid; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1));
return out;
