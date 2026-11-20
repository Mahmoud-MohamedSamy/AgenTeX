const BP = '23339d62-fecf-4324-8950-5fa1bfdef0df'; const o = {};
const g = await getBp(BP); const r = await api('PUT', `/modules/${TK}/blueprints/${BP}`, { definition: g.definition, isActive: true, revision: g.revision }); o.on = E(r) + ' active=' + (await getBp(BP)).isActive; LED('blueprint switched ON (for test) ' + BP + ' "QA RT20 BS 3056 flow": ' + o.on);
const mk = async (suffix, pr) => { const r = await api('POST', `/modules/${TK}/records`, { data: fields({ subject: 'QA RT20 X56 / QA RT20 BS 3056 flow ' + suffix, description: 'QA RT20 X56 retest NDC-3056', status: 'Open', department: CS, priority: pr, owner: AG_A }) }); const id = r.j?.data?.id; if (!id) { o['fail_' + suffix] = E(r); return null; } made.tickets.push(id); keep(); const n = (await rec(id)).ticket_number; LED('ticket created ' + id + ' #' + n + ' "QA RT20 X56 / QA RT20 BS 3056 flow ' + suffix + '" priority ' + pr + ' owner CES2'); return { id, n }; };
o.t2 = await mk('t2', 'low'); o.t3 = await mk('t3', 'high');
for (const k of ['t2', 't3']) if (o[k]) o[k].in = (await waitIn(o[k].id, 40))?.activeStates;
return o;
