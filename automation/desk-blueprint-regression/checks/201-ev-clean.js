const EV = JSON.parse(fs.readFileSync(RUN + '/evidence/plane-evidence.json', 'utf8'));
for (const k of ['bug1', 'bug3', 'bug4', 'bug5']) if (EV[k]?.ticket) { MADE.tickets.push(EV[k].ticket); }
keep();
const r = await cleanup();
const left = (await listBps()).filter(b => /^QA BP R EV/.test(b.definition?.name || '')).length;
const bin = arr((await api('GET', '/audit/recycle-bin/items?limit=100')).j?.data).filter(x => /QA BP R EV/.test(JS(x)));
if (bin.length) await api('POST', '/audit/recycle-bin/delete', { ids: bin.map(x => x.id) });
return { ...r, evBlueprintsLeft: left, binPurged: bin.length };
