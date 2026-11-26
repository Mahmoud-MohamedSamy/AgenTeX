const t = ST.TSLA[0]; const o = {};
for (const p of [`/desk/tickets/${t}/sla/reapply`, `/desk/tickets/${t}/sla/re-apply`]) { const r = await api.O('POST', p, {}); o[p.split('/').pop()] = E(r); if (r.s < 300) break; }
await sleep(15000); const s = await api.O('GET', `/desk/tickets/${t}/sla`); o.after = s.j?.data?.state + ' policy=' + JSON.stringify(s.j?.data?.policy);
const pol = (await api.O('GET', '/desk/sla/policies/' + ST.SLA)).j?.data; o.policy = JSON.stringify({ active: pol?.is_active, dept: pol?.department_id, triggers: pol?.triggers }).slice(0, 300);
return o;
