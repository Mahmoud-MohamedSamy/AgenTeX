const out = {};
const r10 = await ask('Run the report "QA RT18 2917 Gold report" and summarise the result.'); out['I-10'] = short(r10);
const r20 = await ask('How do I create a web form in Desk? Give the steps.'); out['I-20'] = short(r20); out['I-20cit'] = JSON.stringify(r20.final?.citations || '').slice(0, 300); out['I-20raw'] = JSON.stringify({ e: r20.error, t: r20.types, s: r20.status }).slice(0,200);
const r18 = await ask('Explain the stages and transitions of one of our Desk ticket blueprints.'); out['I-18'] = short(r18);
fs.writeFileSync(RUN + '/out/i-own2.json', JSON.stringify({ r10, r20, r18 }, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === 'string' ? v : (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 600) + ` (refs ${v.refs}, cards ${v.cards})`]));
