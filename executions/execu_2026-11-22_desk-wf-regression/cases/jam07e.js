const RID = '88639ae2-d25d-4495-978b-673ebcba32a3';
const rule = (await allRules()).find(r => r.id === RID);
const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data); const us = arr((await api('GET', '/iam/users?take=200')).j?.data);
const act = rule && rule.actions.find(a => a.type === 'OwnerAssignment'); const role = act && orgs.find(o => (o.orgUnitId || o.id) === act.ownerValue);
const depts = arr((await api('GET', '/desk/departments')).j?.data);
const out = { rule: rule && { active: rule.isActive, version: rule.version, updated: rule.updatedAt, trigger: rule.trigger.kind, criteria: JSON.stringify(rule.criteria).slice(0, 200), owner: act && act.ownerTargetKind + ' ' + (role ? role.name : act.ownerValue), depts: rule.departmentIds }, roleMembers: act ? us.filter(u => u.orgUnitId === act.ownerValue).map(u => ({ id: u.userId.slice(0, 8), name: (u.displayName || '').slice(0, 25), status: u.status, profiles: u.profileNames })) : [] };
const exs = arr((await api('GET', `/workflow/executions?ruleId=${RID}&take=100`)).j?.data);
out.runs = []; for (const e of exs.slice(0, 10)) { const g = await getTicket(e.recordId); const d = depts.find(x => x.id === g.department); out.runs.push({ at: (e.evaluatedAt || '').slice(11, 19), ticket: g.ticket_number, subj: (g.subject || '(deleted)').slice(0, 25), prio: g.priority, owner: g.owner ? (us.find(u => u.userId === g.owner)?.displayName || g.owner.slice(0, 8)) : null, dept: d ? d.name : g.department, disp: (e.dispatches || []).map(x => x.status + (x.lastError ? ' (' + String(x.lastError).slice(0, 110) + ')' : '')).join('; ') }); }
if (act) { for (const d of new Set(out.runs.map(r => r.dept))) { const dep = depts.find(x => x.name === d); if (!dep) continue; const ag = arr((await api('GET', `/desk/departments/${dep.id}/agents`)).j?.data); out['agentsOf ' + d] = ag.length ? ag.map(a => (a.user_id || a.userId || a.id || '').slice(0, 8)) : 'n/a'; } }
return out;
