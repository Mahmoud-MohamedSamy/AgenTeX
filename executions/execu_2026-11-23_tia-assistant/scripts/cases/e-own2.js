const e = JSON.parse(fs.readFileSync(RUN + '/out/e-own.json', 'utf8'));
const m = await api('GET', '/desk/macros?limit=100'); const sla = await api('GET', '/desk/sla-policies?limit=50');
const r12b = await ask('Department: QA AO Dept A.', { conversation_id: e.r12.final.conversation_id });
fs.writeFileSync(RUN + '/out/e-own2.json', JSON.stringify({ r12b }, null, 1));
return { macros: m.s + ':' + arr(m.j?.data).length + ' ' + arr(m.j?.data).slice(0,3).map(x => x.name).join('; '), sla: sla.s + ':' + arr(sla.j?.data).length, r12b: short(r12b), p: JSON.stringify((r12b.final?.pending_actions || [])[0] || {}).slice(0, 800) };
