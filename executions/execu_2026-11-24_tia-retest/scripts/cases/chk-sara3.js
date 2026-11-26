const o = { runs: [] }; let hit = 0;
for (let i = 0; i < 8 && hit < 1; i++) {
  const r = await ask('i want you to create assignment rule', { page: { app: 'crm' } }); const t = r.text || r.final?.text || ''; const cid = r.final?.conversation_id;
  const row = { i, sara: /sara/i.test(t), text: t.slice(0, 200), progress: r.progress, types: r.types, ms: r.totalMs, conv: cid };
  if (row.sara) { hit++; const m = (await api('GET', `/agents/tia/conversations/${cid}/messages`)).j; row.messages = JSON.stringify(m).slice(0, 4000); row.finalKeys = Object.keys(r.final || {}); row.finalExtra = JSON.stringify({ ...r.final, text: undefined }).slice(0, 1500); }
  o.runs.push(row); await sleep(7000);
}
o.sara = `${hit} of ${o.runs.length}`;
fs.writeFileSync(RUN + '/out/sara-repro.json', JSON.stringify(o, null, 1));
for (const r of o.runs) if (r.conv) await api('DELETE', `/agents/tia/conversations/${r.conv}`);
return { sara: o.sara, runs: o.runs.map(r => ({ i: r.i, sara: r.sara, progress: r.progress, ms: r.ms })) };
