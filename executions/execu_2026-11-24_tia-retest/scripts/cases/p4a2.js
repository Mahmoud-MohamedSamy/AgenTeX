// Phase 4 A retry: monthly cap with longer wait, length boundary with status, deleted chats.
const B = JSON.parse(fs.readFileSync(RUN + '/out/cr-baseline.json', 'utf8')); const o = {}; const P = { page: { app: 'crm' } };
const del = async r => { if (r?.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); };
const setTia = async tia => { const p = (await api('GET', '/ai/policy')).j?.data; const d = JSON.parse(JSON.stringify(p.descriptor)); d.features.tia = tia; return (await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: d })).s; };
const one = async () => { const r = await ask('hi', P); await del(r); return r.error || 'ok'; };
if (!process.env.SKIP_CAP) try {
  o.set = await setTia({ ...B.policyTia, monthly_credit_cap: 0 }); o.readBack = (await api('GET', '/ai/policy')).j?.data?.descriptor?.features?.tia; ledger('P4 monthly cap 0 — restore');
  o.t10 = (await sleep(10000), await one()); o.t70 = (await sleep(60000), await one());
  o.dailyCheck = await setTia({ ...B.policyTia, daily_credit_cap: 0, monthly_credit_cap: 0 }); o.dailyT10 = (await sleep(10000), await one());
} finally { o.restore = await setTia(B.policyTia); const n = (await api('GET', '/ai/policy')).j?.data; o.policySame = JSON.stringify(n.descriptor.features.tia) === JSON.stringify(B.policyTia); ledger('P4 policy restored ' + o.policySame + ' v' + n.version); }
o.len = {};
for (const n of [5000, 6000, 7000, 8000, 12000, 32000]) {
  const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now() + n, message: 'a'.repeat(n - 30) + ' How many leads are there?', ...P }, 120000); await del(r);
  o.len[n] = { s: r.status, notStream: !!r.notStream, err: r.error || null, msg: (r.errorEvent?.message || r.t || '').slice(0, 120), answered: !!(r.text || r.final?.text) }; await sleep(2500);
}
{ const code = 'QADEL' + Math.random().toString(36).slice(2, 6).toUpperCase(); const r = await ask(`Remember the code word ${code} for later.`, P); const cid = r.final?.conversation_id;
  o.deleted = { made: !!cid, del: (await api('DELETE', `/agents/tia/conversations/${cid}`)).s, getMsgs: (await api('GET', `/agents/tia/conversations/${cid}/messages`)).s, inList: arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data).some(c => c.id === cid), delAgain: (await api('DELETE', `/agents/tia/conversations/${cid}`)).s };
  const t = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now(), conversation_id: cid, message: 'What code word did I give you?', ...P }); o.deleted.postInto = t.error || ('accepted: ' + (t.text || t.final?.text || '').slice(0, 80)); await del(t);
  const n = await ask('In an earlier chat I gave you a code word starting with QADEL. What was it?', P); const nt = n.text || n.final?.text || ''; o.deleted.newChat = nt.slice(0, 160); o.deleted.remembered = nt.includes(code); await del(n); }
fs.appendFileSync(RUN + '/out/p4-results.jsonl', JSON.stringify({ part: 'A2', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
