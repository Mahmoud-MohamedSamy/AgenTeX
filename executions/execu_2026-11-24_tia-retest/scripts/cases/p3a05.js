const x = await askCard('Set the status of the ticket "QA TIA P3 T1" to On Hold.'); const c = x.acts[0] ? await confirmA(x.acts[0]) : null;
const g = await getRec(M.tickets, P3I.t1);
p3rec('A-05', '?', `card=${x.card || 'none'}; confirm=${JSON.stringify(c)}; status now=${val(g.rec, 'status')}; text=${x.text.slice(0, 250)}`, { conv: x.conv });
const y = await askCard('Change the priority of ticket "QA TIA P3 T3" to High.'); const d = y.acts[0] ? await confirmA(y.acts[0]) : null;
const h = await getRec(M.tickets, P3I.t3);
p3rec('A-05b', '?', `card=${y.card || 'none'}; confirm=${JSON.stringify(d)}; priority now=${val(h.rec, 'priority')}; text=${y.text.slice(0, 250)}`, { conv: y.conv });
return [x.card, c, val(g.rec, 'status'), x.text.slice(0, 200), y.card, d, val(h.rec, 'priority'), y.text.slice(0, 200)];
