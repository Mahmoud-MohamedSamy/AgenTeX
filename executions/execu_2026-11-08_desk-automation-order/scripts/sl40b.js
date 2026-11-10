// SL-40 follow-up, as Test User 1: any notice about the QA contract ending tomorrow.
const R = JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/sl40.json', 'utf8'));
const n = (await api('GET', '/notifications?limit=80')).j; const L = n?.data?.data || [];
return { now: new Date().toISOString(), hits: L.filter(x => /contract/i.test(JSON.stringify(x)) || JSON.stringify(x).includes(R.tag)).map(x => (x.event_type || x.type) + ' | ' + (x.title || '').slice(0, 100) + ' | ' + x.created_at).slice(0, 5) };
