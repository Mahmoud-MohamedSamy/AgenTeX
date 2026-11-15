const out = {};
for (const n of [31, 50, 51]) { const r = await mkRule({ name: P + 'Z7 ' + n, entries: Array.from({ length: n }, (_, i) => ent('company', 'eq', 'c' + i, 1)) }); out['n' + n] = SR(r).slice(0, 200); }
return out;
