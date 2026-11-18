const LEADS = '259e93be-1e0a-4d78-a385-055db8265323';
const r = await api('GET', `/modules/${LEADS}/records?search=AEX-01-BP&page_size=5`);
const items = arr(r.j?.data); const out = { s: r.s, n: items.length };
out.items = items.slice(0, 5).map(x => ({ id: x.id, name: JSON.stringify(x).match(/"(AEX[^"]{0,40})"/)?.[1] }));
for (const it of items.slice(0, 5)) { const b = await api('GET', `/modules/${LEADS}/records/${it.id}/blueprint-state`); const s0 = (b.j?.data?.states || [])[0]; if (s0) { out.bp = { id: it.id, name: s0.blueprintName, active: s0.activeStates, nStates: (s0.allStates || []).length, nTr: (s0.allTransitions || []).length, fromActive: (s0.allTransitions || []).filter(t => s0.activeStates.includes(t.fromStateId)).length }; break; } }
return out;
