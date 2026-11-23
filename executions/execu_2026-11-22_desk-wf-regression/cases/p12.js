
const LL = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l.includes('"QA WF P11 x"')).pop(); const tid = LL.split(' ').pop();
const tries = {};
for (const p of [`/desk/tickets/${tid}/collaboration/activity`, `/modules/${T}/records/${tid}/history`, `/modules/${T}/records/${tid}/timeline`, `/desk/tickets/${tid}/history`, `/feeds/desk_tickets/${tid}`, `/modules/${T}/records/${tid}/feed`]) { const r = await api('GET', p); tries[p.replace(tid, ':id')] = r.s + ' ' + r.t.slice(0, 700); }
// executions for all QA WF rules on this ticket
const rules = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data).filter(r => r.isActive);
const hits = []; for (const r of rules) { const e = (await execs(tid, r.id)); if (e.length) hits.push(r.name + ': ' + e.map(x => x.triggerKind + ' ' + outcome(x) + ' ' + (x.dispatches||[]).map(d=>d.actionType).join('+')).join('; ')); }
return { tid, hits, tries };
