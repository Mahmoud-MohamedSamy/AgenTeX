const t = ST.tickets['QA PA bp 6']; const o = {};
const run = (extra) => api.A('POST', `/desk/tickets/${t}/blueprint-transitions/t_val`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, ...extra });
o.val = E(await run({}));
const fin = (extra) => api.A('POST', `/desk/tickets/${t}/blueprint-transitions/t_fin`, { run_id: crypto.randomUUID(), expected_state_id: 'On Hold', fields: {}, ...extra });
o.a = (await fin({ approval: {} })).t.slice(0, 400);
o.b = (await fin({ approval: { subject: 'QA PA bp approval' } })).t.slice(0, 400);
return o;
