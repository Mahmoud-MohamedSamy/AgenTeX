const Q = [
 ['I-01', 'How many leads whose name starts with QA TIA have lead source web?'],
 ['I-02', 'List the deals whose name starts with QA TIA, with their amounts and stages.'],
 ['I-03', 'What stage is the deal QA TIA Deal 2500 in?'],
 ['I-06', 'What fields does the Deals module have? List up to 15.'],
 ['I-07', 'Which CRM modules can I open?'],
 ['I-08', 'Find QA TIA Contact A and tell me their email.'],
 ['I-09', 'In one answer: how many leads, how many contacts and how many deals have names starting with QA TIA?'],
 ['I-23', 'Show me the deal named QA TIA Nonexistent.'],
 ['I-24', 'Show my QA TIA deal.'],
 ['I-29', 'List all contacts.'],
 ['I-04', 'How is my pipeline this month? Give totals by stage.'],
 ['I-05', 'What should I follow up on today?'],
 ['I-11', 'Which reports can I open? List up to 10.'],
];
const out = {};
for (const [id, q] of Q) { const r = await ask(q); out[id] = { q, ...short(r), conv: r.final?.conversation_id, refsList: (r.final?.refs || []).slice(0, 6).map(x => (x.label || x.title || x.record_label || '') + '|' + (x.module || x.module_label || x.app || '')) }; }
const f = await ask('And which of them is closed?', { conversation_id: out['I-02'].conv }); out['I-25'] = { q: 'follow-up to I-02: which of them is closed?', ...short(f) };
fs.writeFileSync(RUN + '/out/i-crm.json', JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 420) + (v.refs ? ` (refs ${v.refs})` : '') + (v.actions.length ? ' ACTIONS' : '')]));
