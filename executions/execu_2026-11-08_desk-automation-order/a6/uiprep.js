// Data for the NDC-Staging screen rows: one published blueprint with items, a time limit and a common transition, two tickets inside.
const d = DEF('UI', [ST('Open', { slaMinutes: 120, slaPreExpiryMinutes: 60 }), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [
  TR('verify', 'Open', 'Escalated', { during: { messages: [{ id: 'm1', text: 'QA BP read this first' }], checklist: [{ id: 'c1', label: 'QA BP checked', mandatory: true }], deskItems: [{ kind: 'comment', mandatory: true }], requiredFields: [{ name: 'priority', datatype: 'pick_list' }], itemOrder: ['message:m1', 'checklist', 'desk:comment', 'field:priority'] } }),
  TR('hold', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed'), TR('cancel', 'Open', 'Closed', { extra: { isCommon: true } })]);
const b = await mkBp(d); const t1 = await mkT('UI', 'screen one', { email: GMAIL }); const t2 = await mkT('UI', 'screen two'); await waitIn(t1); await waitIn(t2);
const num = async id => (await flds(id)).ticket_number;
const out2 = { bp: b.id, bpS: E(b.r), t1, t2, n1: await num(t1), n2: await num(t2) };
fs.writeFileSync('../a6/ui-data.json', JSON.stringify(out2)); log(JSON.stringify(out2));
