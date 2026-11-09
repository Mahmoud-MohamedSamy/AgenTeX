// NT-09 part 2, as Test User 1: which assigned/completed notices reached the bell.
await sleep(30000);
const R = JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/nt09.json', 'utf8'));
const n = (await api('GET', '/notifications?limit=80')).j; const L = n?.data?.data || arr(n?.data);
const mine = L.filter(x => JSON.stringify(x).includes(R.u)).map(x => ({ type: x.event_type || x.type || x.kind, title: (x.title || '').slice(0, 90) }));
return { found: mine.length, items: mine };
