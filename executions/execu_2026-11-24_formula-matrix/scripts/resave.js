// re-save records so newly added formulas get values, then re-read into the recs file
const SPEC = process.env.SPEC || 'matrix', isDesk = !!process.env.DESK, app = isDesk ? 'desk' : 'crm'; const st = made[SPEC]; const M = st.mod; const out = {};
for (const k of ['rFull', 'rFull2', 'rEmpty', 'rEdge1', 'rEdit']) if (st[k]) { const v0 = await getRec(M, st[k]); await api('PATCH', `/modules/${M}/records/${st[k]}`, { data: data({ name: v0.name }) }); }
await sleep(3000); for (const k of ['rFull', 'rFull2', 'rEmpty', 'rEdge1', 'rEdit']) if (st[k]) out[k] = { id: st[k], values: await getRec(M, st[k]) };
fs.writeFileSync(RUN + `/out/recs-${app}-${SPEC}.json`, JSON.stringify(out, null, 1)); log(Object.fromEntries(Object.entries(out).map(([k, r]) => [k, Object.keys(r.values).filter(n => /^fx_/.test(n)).length])));
