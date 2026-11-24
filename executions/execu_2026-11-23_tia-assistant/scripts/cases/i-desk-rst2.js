const out = {};
out['I-26'] = short(await ask('How many tickets were created today?'));
out['I-30'] = short(await ask('What did the customer say in ticket QA TIA T3 last week?'));
out['I-17'] = short(await ask('Why was ticket QA TIA T2 assigned the way it is? Explain the assignment.'));
out['I-12b'] = short(await ask('Count the tickets with status Open that I can see.'));
fs.writeFileSync(RUN + '/out/i-desk-rst2.json', JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, (v.err ? '[' + v.err + '] ' : '') + v.text.slice(0, 450) + ` (refs ${v.refs}, cards ${v.cards})`]));
