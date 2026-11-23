const b = await mkTicket('P11', { department: DEPT2 }, 'x');
const t0 = await getTicket(b.id); await sleep(25000); const t1 = await getTicket(b.id);
const diff = {}; for (const k of new Set([...Object.keys(t0), ...Object.keys(t1)])) if (JSON.stringify(t0[k]) !== JSON.stringify(t1[k])) diff[k] = [t0[k], t1[k]];
const rr = await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + DEPT2);
const sla = await api('GET', '/desk/sla/policies?department_id=' + DEPT2);
const bp = await api('GET', '/desk/blueprints?department_id=' + DEPT2);
const recent = arr((await api('GET','/workflow/executions?take=40')).j.data).filter(e=>e.recordId===b.id).map(e=>(e.ruleId||'')+' '+(e.assignmentRuleId||'')+' '+e.origin+' '+e.triggerKind+' '+e.outcome);
return { diff, rr: rr.s + ' ' + JSON.stringify(rr.j && rr.j.data).slice(0, 300), sla: sla.s + ' ' + sla.t.slice(0, 200), bp: bp.s + ' ' + bp.t.slice(0, 200), recent };
