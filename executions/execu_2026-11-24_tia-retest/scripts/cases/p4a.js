// Phase 4 part A (owner): reset-time info, monthly cap, message length, deleted chats. Restores everything.
const B = JSON.parse(fs.readFileSync(RUN + '/out/cr-baseline.json', 'utf8')); const o = {}; const P = { page: { app: 'crm' } };
const del = async r => { if (r?.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); };
const deploy = async def => { const a = await getAgent(); const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const d = p.s < 300 ? await api('POST', `/agents/${a.id}/deploy`, {}) : { s: '-' }; return p.s + '/' + d.s; };
const setTia = async tia => { const p = (await api('GET', '/ai/policy')).j?.data; const d = JSON.parse(JSON.stringify(p.descriptor)); d.features.tia = tia; return (await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: d })).s; };
// 1. per-user limit error payload + status + reset info
try {
  const def = JSON.parse(JSON.stringify(B.agentDef)); def.tia = { ...def.tia, daily_user_credit_limit: 1 }; o.setLim = await deploy(def); ledger('P4 per-user limit 1 — restore'); await sleep(5000);
  const r = await ask('hi', P); o.limitEvent = r.errorEvent || r.error; o.limitStatus = (await api('GET', '/agents/tia/status?app=crm')).j?.data; await del(r);
} finally { o.restoreLim = await deploy(B.agentDef); ledger('P4 per-user limit restored ' + o.restoreLim); }
// 2. monthly cap
try {
  o.setMonthly = await setTia({ ...B.policyTia, monthly_credit_cap: 2000 }); ledger('P4 monthly cap 2000 — restore'); await sleep(6000);
  const r = await ask('hi', P); o.monthlyEvent = r.errorEvent || r.error || ('ok: ' + (r.text || r.final?.text || '').slice(0, 60)); await del(r);
  o.monthlyZero = await setTia({ ...B.policyTia, monthly_credit_cap: 0 }); await sleep(6000); const r2 = await ask('hi', P); o.monthlyZeroEvent = r2.errorEvent || r2.error || 'ok'; await del(r2);
  o.monthlyNeg = await setTia({ ...B.policyTia, monthly_credit_cap: -5 });
} finally { o.restorePolicy = await setTia(B.policyTia); const now = (await api('GET', '/ai/policy')).j?.data; o.policySame = JSON.stringify(now.descriptor.features.tia) === JSON.stringify(B.policyTia); ledger('P4 policy restored ' + o.policySame + ' v' + now.version); }
// 7. message length boundary
const tryLen = async n => { const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now() + n, message: 'a'.repeat(n - 30) + ' How many leads are there?', ...P }, 120000); await del(r); return r.error ? (r.errorEvent?.message || r.error) : 'ok'; };
o.len = {}; for (const n of [2000, 4000, 8000, 16000, 32000]) { o.len[n] = String(await tryLen(n)).slice(0, 120); await sleep(2500); }
// 8. deleted chats really gone
{ const code = 'QADEL' + Math.random().toString(36).slice(2, 6).toUpperCase(); const r = await ask(`Remember the code word ${code} for later.`, P); const cid = r.final?.conversation_id;
  o.deleted = { del: (await api('DELETE', `/agents/tia/conversations/${cid}`)).s, getMsgs: (await api('GET', `/agents/tia/conversations/${cid}/messages`)).s, inList: arr((await api('GET', '/agents/tia/conversations?limit=200')).j?.data).some(c => c.id === cid), delAgain: (await api('DELETE', `/agents/tia/conversations/${cid}`)).s };
  const t = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now(), conversation_id: cid, message: 'What code word did I give you?', ...P }); o.deleted.postInto = t.error || 'accepted: ' + (t.text || t.final?.text || '').slice(0, 80); await del(t);
  const n = await ask('In an earlier chat I gave you a code word starting with QADEL. What was it?', P); const nt = n.text || n.final?.text || ''; o.deleted.newChat = nt.slice(0, 160); o.deleted.remembered = nt.includes(code); await del(n); }
fs.appendFileSync(RUN + '/out/p4-results.jsonl', JSON.stringify({ part: 'A', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
