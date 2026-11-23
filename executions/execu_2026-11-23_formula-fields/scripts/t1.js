const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const F = [fdef('qa_fx_dept', 'QA FX Dept', 'formula', { expression: 'concat(department)', return_kind: 'string' }), fdef('qa_fx_team', 'QA FX Team', 'formula', { expression: 'concat(team)', return_kind: 'string' }),
  fdef('qa_fx_chan', 'QA FX Channel', 'formula', { expression: 'concat(channel)', return_kind: 'string' }), fdef('qa_fx_hi', 'QA FX High', 'formula', { expression: 'priority = "High"', return_kind: 'boolean' })];
made.tickets ||= { fields: [], tickets: [] };
for (const f of F) { const r = await api('POST', `/modules/${TK}/fields`, { fields: [f] }); log(f.fieldName, E(r)); if (r.s < 300) { made.tickets.fields.push(f.fieldName); keep(); led('Desk Tickets formula field ' + f.fieldName); } }
const t = await api('POST', `/modules/${TK}/records`, { data: data({ subject: 'QA FX E23 ticket', description: 'QA FX formula run - delete', status: 'Open', department: CS, priority: 'High', channel: 'Web' }) });
log('ticket', E(t)); if (t.j?.data?.id) { made.tickets.tickets.push(t.j.data.id); keep(); const v = flat(t.j.data.data); log(JSON.stringify({ department: v.department, team: v.team, channel: v.channel, priority: v.priority, qa_fx_dept: v.qa_fx_dept, qa_fx_team: v.qa_fx_team, qa_fx_chan: v.qa_fx_chan, qa_fx_hi: v.qa_fx_hi })); }
