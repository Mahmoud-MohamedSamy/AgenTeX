const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8')); const o = {};
o.endR3 = E(await runT(J.r3, 'end', 'Escalated')); LED('owner ran QA end on #4807 (60968417) Escalated->Closed (NDC-3068)');
// plain ticket, no blueprint (subject without BP guard words) in Customer Support
const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: 'QA RT20 BP-3068 plain close', description: 'QA RT20 BP 3068 normal close', status: 'Open', department: CS }) });
o.plain = r.j?.data?.id; LED('ticket created ' + o.plain + ' "QA RT20 BP-3068 plain close" (no blueprint)'); await sleep(65000);
o.close = E(await api('PATCH', '/modules/' + TK + '/records/' + o.plain, { data: fields({ status: 'Closed' }) })); LED('owner closed ' + o.plain + ' by status edit (NDC-3068)');
await sleep(8000);
for (const k of ['r3', 'plain']) { const id = k === 'plain' ? o.plain : J[k]; const h = L((await api('GET', `/desk/tickets/${id}/history`)).j?.data); o[k + 'n'] = (await api('GET', '/desk/tickets/' + id)).j?.data?.ticket_number; o[k + 'hist'] = h.map(x => x.occurred_at.slice(11, 19) + ' ' + x.action + ' ' + (x.field_key || '') + ' new=' + JSON.stringify(x.new_value).slice(0, 60)); }
o.k1hist = L((await api('GET', `/desk/tickets/${J.k1}/history`)).j?.data).map(x => x.action);
J.plain = o.plain; fs.writeFileSync(RUN + '/scripts/bp/3065.json', JSON.stringify(J, null, 1));
return o;
