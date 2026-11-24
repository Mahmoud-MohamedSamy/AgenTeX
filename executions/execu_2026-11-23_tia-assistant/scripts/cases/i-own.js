const out = {};
const r10 = await ask('Run the report "QA RT19 GS Gold report" and summarise the result.'); out['I-10'] = short(r10);
const r19 = await ask('Explain our ticket round robin rules: who they apply to and how tickets are shared.'); out['I-19'] = short(r19);
const r20 = await ask('How do I create a web form in Desk? Give the steps.'); out['I-20'] = short(r20); out['I-20cit'] = JSON.stringify(r20.final?.citations || '').slice(0, 300);
const r18 = await ask('List our Desk blueprints and explain the stages and transitions of one of them.'); out['I-18'] = short(r18);
fs.writeFileSync(RUN + '/out/i-own.json', JSON.stringify({ r10, r19, r20, r18 }, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === 'string' ? v : (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 500) + ` (refs ${v.refs}, cards ${v.cards})`]));
