const o = {}; const P = 'QA RT12 2754';
const def = X.bp('2754 bp', { marker: P }).state('Open').state('Escalated').state('On Hold').terminal('Closed')
  .tr('go', 'Open', 'Escalated').tr('hold', 'Open', 'On Hold').tr('alt', 'Open', 'Closed').tr('end', 'Escalated', 'Closed').tr('back', 'On Hold', 'Open').build();
const b = await X.createBp(def, false); o.create = X.err(b) + ' ' + (b.s >= 400 ? b.t.slice(0, 400) : ''); o.id = b.j?.data?.id;
// move it to the top of Dept A so it wins over other QA blueprints for "QA RT12 2754" tickets (none match anyway)
return o;
