const mid = await modId(); const out = {};
const id = fs.readFileSync(RUN + '/ledger.md', 'utf8').match(/E6 keep" ([0-9a-f-]{36})/)[1]; I.e6 = id; SAVE();
const v = await recVals(mid, id); out.e6 = { id, first: v.first_name, type: v[FP + 'type'], order: v[FP + 'order'] };
return out;
