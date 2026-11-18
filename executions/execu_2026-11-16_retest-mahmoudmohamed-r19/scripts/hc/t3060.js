const o = {};
const during = { messages: [], checklist: [], deskItems: [], itemOrder: ['field:contact_id','field:account_id','field:product_id'], requiredFields: [{name:'contact_id',datatype:{key:'lookup'},required:false},{name:'account_id',datatype:{key:'lookup'},required:false},{name:'product_id',datatype:{key:'lookup'},required:false}], instructionalMessage: null };
const def = DEF('HC 3060', [ST('Open', { position: { x: 0, y: 150 } }), ST('On Hold', { position: { x: 400, y: 150 } }), ST('Closed', { isTerminal: true, position: { x: 800, y: 150 } })],
  [TR('hold', 'Open', 'On Hold', { during }), TR('end', 'On Hold', 'Closed')], { departmentId: DA });
const b = await mkBp(def); o.bp = E(b.r); o.id = b.id;
if (!b.id) return o;
o.t = await mkT('HC 3060', 'ticket', { contact_id: 'a4f8d01e-e750-4368-9a51-9416d895a27f', account_id: 'ab2b141d-1908-4da6-9ceb-9df70d54ee29', product_id: '12f171d3-772e-4216-9879-448f22ade212' }, DA);
o.in = await waitIn(o.t); const r = await rec(o.t); o.n = r.ticket_number; o.c = r.contact_id; o.a = r.account_id; o.p = r.product_id;
o.tr = await trans(o.t);
fs.writeFileSync(RUN + '/scripts/hc/3060.json', JSON.stringify(o, null, 1)); return o;
