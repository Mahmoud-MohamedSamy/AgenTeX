const r = await api('GET', '/desk/sla/contracts/00645a02-40cc-4a7e-9f8d-4a1446829857/coverage'); const d = r.j?.data || {};
return { s: r.s, keys: Object.keys(d), plan: d.plan && { name: d.plan.name, dept: d.plan.department_id, policy: d.plan.policy_id }, rest: JSON.stringify({ ...d, plan: undefined }).slice(0, 700) };
