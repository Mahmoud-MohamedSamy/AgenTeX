// Workspace cap timing probe. CAP=<units>. Sets cap (retry), probes at ~5s, ~65s, ~125s, then restores baseline. Runs as owner only.
const BF = RUN + '/out/cr-baseline.json'; const B = JSON.parse(fs.readFileSync(BF, 'utf8'));
const retry = async (f, n = 4) => { let e; for (let i = 0; i < n; i++) { try { return await f(); } catch (x) { e = x; await sleep(4000); } } throw e; };
const setTia = async tia => retry(async () => { const p = (await api('GET', '/ai/policy')).j?.data; const d = JSON.parse(JSON.stringify(p.descriptor)); d.features.tia = tia; const r = await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: d }); return { s: r.s, ver: p.version }; });
const one = async () => retry(async () => { const r = await ask('hi', { page: { app: 'crm' } }); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); return r.error ? String(r.error).slice(0, 60) : 'ok'; });
const o = { cap: Number(process.env.CAP) };
try {
  o.set = await setTia({ ...B.policyTia, daily_credit_cap: o.cap }); ledger(`CR cap set to ${o.cap} ${JSON.stringify(o.set)} — restore`);
  o.readBack = (await api('GET', '/ai/policy')).j?.data?.descriptor?.features?.tia;
  o.t5 = (await sleep(5000), await one()); o.t65 = (await sleep(55000), await one()); o.t125 = (await sleep(55000), await one());
  o.status = (await api('GET', '/agents/tia/status?app=crm')).j?.data;
} finally {
  o.restore = await setTia(B.policyTia); const now = (await api('GET', '/ai/policy')).j?.data; o.restored = JSON.stringify(now.descriptor.features.tia) === JSON.stringify(B.policyTia); ledger(`CR cap restored ${o.restored} v${now.version}`);
}
fs.appendFileSync(RUN + '/out/cr-results.jsonl', JSON.stringify({ id: 'CR-cap-timing', ...o }) + '\n'); return o;
