const fs = process.getBuiltinModule('fs'); const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad';
const MID = '88e8ea44-1658-4df3-9930-d0902b91073d', LID = '1b55c25d-eb27-4046-afd1-b292398b435b';
const now = (await api('GET', `/modules/${MID}/layouts/${LID}`)).j.data; fs.writeFileSync(S + '/standard-layout-now.json', JSON.stringify(now, null, 1));
const old = JSON.parse(fs.readFileSync(S + '/standard-layout.json', 'utf8'));
const o = { layout: [old.lastModifiedAt, now.lastModifiedAt, old.rowVersion, now.rowVersion] };
for (const k of Object.keys(now.views)) { const a = old.views[k], b = now.views[k]; o[k] = { old: [a.updatedAt, a.updatedBy, a.rowVersion], now: [b.updatedAt, b.updatedBy, b.rowVersion], sameLayoutContent: JSON.stringify(a.layout) === JSON.stringify(b.layout) }; }
// fetch twice more to see if updatedAt moves on read
await sleep(3000); const again = (await api('GET', `/modules/${MID}/layouts/${LID}`)).j.data; o.secondRead = Object.fromEntries(Object.entries(again.views).map(([k, v]) => [k, v.updatedAt]));
return o;
