const Q = [
 ['I-01', 'How many leads whose name starts with QA TIA have lead source web?'],
 ['I-02', 'List the deals whose name starts with QA TIA, with their amounts and stages.'],
 ['I-09', 'In one answer: how many leads, how many contacts and how many deals have names starting with QA TIA?'],
 ['I-24', 'Show my QA TIA deal.'],
 ['I-04', 'How is my pipeline this month? Give totals by stage.'],
 ['I-05', 'What should I follow up on today?'],
];
const out = {};
for (const [id, q] of Q) { const r = await ask(q); out[id] = { q, ...short(r) }; }
fs.writeFileSync(RUN + '/out/i-crm2.json', JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 420) + (v.refs ? ` (refs ${v.refs})` : '')]));
