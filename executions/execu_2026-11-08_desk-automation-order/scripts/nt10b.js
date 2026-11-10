const R = JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/nt10.json', 'utf8'));
const n = (await api('GET', '/notifications?limit=60')).j; const L = n?.data?.data || [];
return L.filter(x => JSON.stringify(x).includes(R.tag) || JSON.stringify(x).includes(R.ticket)).map(x => (x.event_type || x.type) + ' | ' + (x.title || '').slice(0, 100));
