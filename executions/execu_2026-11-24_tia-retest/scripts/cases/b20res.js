const B = JSON.parse(fs.readFileSync(RUN + '/out/b20-agent-before.json', 'utf8'));
let items = []; for (let i = 0; i < 6; i++) { const r = await api('GET', '/audit/recycle-bin/items?limit=50'); items = arr(r.j?.data).filter(x => x.record_id === B.id); if (items.length) break; await sleep(5000); }
if (!items.length) return { stop: 'not found in recycle bin' };
const r = await api('POST', '/audit/recycle-bin/restore', { ids: items.map(x => x.id) });
let a = null; for (let i = 0; i < 12; i++) { const g = await api('GET', `/agents/${B.id}`); if (g.s === 200) { a = g.j.data; break; } await sleep(5000); }
let st; for (let i = 0; i < 12; i++) { st = (await api('GET', '/agents/tia/status')).j?.data; if (st?.available) break; await sleep(5000); }
const same = a && JSON.stringify(a.draft_definition) === JSON.stringify(B.draft_definition);
ledger(`B-20: Tia restored from Recycle Bin (${r.s}); same id=${!!a}; same definition=${same}; status ${JSON.stringify(st)}`);
return { restore: r.s, err: r.j?.error?.code, sameId: !!a, status: a?.status, version: a?.deployed_version_no, sameDefinition: same, tiaStatus: st };
