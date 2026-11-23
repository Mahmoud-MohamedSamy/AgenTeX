// Read-only check of Jam 1ff094b0 (AC-07): rule 88639ae2, tickets #7153-7156, role 685c01ab "Supervisor".
const RID = '88639ae2-d25d-4495-978b-673ebcba32a3', ROLE = '685c01ab-5e57-4a96-af90-3c98dfe52692', T1 = '6f8b5d1c-ac4c-4eb4-955b-f1a07cc19347';
const exs = arr((await api('GET', `/workflow/executions?ruleId=${RID}&take=100`)).j?.data);
const out = { execCount: exs.length, recent: [] };
for (const e of exs.slice(0, 12)) { const g = await getTicket(e.recordId); out.recent.push({ at: (e.evaluatedAt || '').slice(0, 19), ticket: g.ticket_number + ' ' + (g.subject || '').slice(0, 30), prio: g.priority, owner: g.owner || null, dept: g.department, outcome: outcome(e), trig: e.triggerKind, disp: (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? ' (' + String(d.lastError).slice(0, 120) + ')' : '')).join('; ') }); }
const t1 = await getTicket(T1); out.ticket7153 = { prio: t1.priority ?? null, owner: t1.owner ?? null, dept: t1.department, channel: t1.channel, runsForThisRule: exs.filter(e => e.recordId === T1).map(e => outcome(e)) };
const us = arr((await api('GET', '/iam/users?take=200')).j?.data); out.roleMembers = us.filter(u => u.orgUnitId === ROLE).map(u => ({ id: (u.userId || u.id).slice(0, 8), status: u.status, profiles: u.profileNames }));
const depts = arr((await api('GET', '/desk/departments')).j?.data); const cs = depts.find(d => d.id === t1.department); out.ticketDept = cs ? cs.name : t1.department;
return out;
