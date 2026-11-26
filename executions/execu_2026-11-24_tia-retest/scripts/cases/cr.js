// Credits + daily limits. STEP=base|cost|setlim|probe|valid|capvalid|cap|restore|verify
const STEP = process.env.STEP; const BF = RUN + '/out/cr-baseline.json'; const RF = RUN + '/out/cr-results.jsonl';
const rec = (id, v) => { fs.appendFileSync(RF, JSON.stringify({ id, who: process.env.WHO, at: new Date().toISOString().slice(0, 19), ...v }) + '\n'); return v; };
const txt = r => (r.text || r.final?.text || '');
const wallet = async () => (await api('GET', '/ai/credits/wallet')).j?.data?.lifetime_debited_credits;
const deploy = async def => { const a = await getAgent(); const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const d = p.s < 300 ? await api('POST', `/agents/${a.id}/deploy`, {}) : { s: '-' }; return { put: p.s, dep: d.s, err: p.s >= 300 ? (p.t || '').slice(0, 200) : undefined }; };
const setPolicyTia = async tia => { const p = (await api('GET', '/ai/policy')).j?.data; const d = JSON.parse(JSON.stringify(p.descriptor)); d.features.tia = tia; const r = await api('PUT', '/ai/policy', { expected_version: p.version, descriptor: d }); return { s: r.s, err: r.s >= 300 ? (r.t || '').slice(0, 200) : undefined }; };
const turn = async (m, extra) => { const r = await ask(m, { page: { app: 'crm' }, ...(extra || {}) }); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); for (const a of r.final?.pending_actions || []) await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); return { s: r.status, err: r.error ? String(r.error).slice(0, 120) : null, text: txt(r).slice(0, 150), ms: r.totalMs }; };
const raw = async (body, ms) => { const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now(), page: { app: 'crm' }, ...body }, ms || 60000); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); return { s: r.status, err: r.error ? String(r.error).slice(0, 160) : null, text: txt(r).slice(0, 100) }; };
const B = fs.existsSync(BF) ? JSON.parse(fs.readFileSync(BF, 'utf8')) : null;

if (STEP === 'base') {
  if (B) return 'baseline exists, not overwritten';
  const a = await getAgent(); const p = (await api('GET', '/ai/policy')).j?.data;
  const nb = { agentDef: a.draft_definition, agentVer: a.deployed_version_no, policyVersion: p.version, policyTia: p.descriptor.features.tia };
  fs.writeFileSync(BF, JSON.stringify(nb, null, 1));
  ledger(`CR baseline saved: agent v${a.deployed_version_no} tia=${JSON.stringify(a.draft_definition.tia)}, policy v${p.version} tia=${JSON.stringify(p.descriptor.features.tia)}`); return { tia: nb.agentDef.tia, policyTia: nb.policyTia, ver: nb.agentVer };
}
if (STEP === 'cost') {
  const o = {}; const msgs = [['simple', 'hi'], ['tool', 'How many leads are there in CRM?'], ['refused', 'Can you book a flight to Paris for me?'], ['simple2', 'hi'], ['tool2', 'How many leads are there in CRM?']];
  for (const [k, m] of msgs) { const w0 = await wallet(); const t = await turn(m); await sleep(6000); const w1 = await wallet(); o[k] = { ...t, debit: w1 - w0 }; }
  for (const [k, body, ms] of [['empty', { message: '' }], ['huge', { message: 'x '.repeat(60000) }, 90000], ['badConv', { message: 'hi', conversation_id: '00000000-0000-0000-0000-000000000001' }]]) { const w0 = await wallet(); const r = await raw(body, ms); await sleep(5000); o[k] = { ...r, debit: (await wallet()) - w0 }; }
  return rec('CR-02', o);
}
if (STEP === 'setlim') { const def = JSON.parse(JSON.stringify(B.agentDef)); def.tia = { ...def.tia, daily_user_credit_limit: Number(process.env.LIM) }; const r = await deploy(def); ledger(`CR: per-user daily limit set to ${process.env.LIM} ${JSON.stringify(r)} — restore`); await sleep(5000); return rec('CR-set-' + process.env.LIM, r); }
if (STEP === 'probe') {
  const o = { turns: [] }; const N = Number(process.env.N || 8);
  for (let i = 0; i < N; i++) { const w0 = await wallet(); const t = await turn(i % 2 ? 'How many leads are there in CRM?' : 'hi'); await sleep(4000); t.debit = (await wallet()) - w0; o.turns.push(t); if (t.err) break; }
  o.status = (await api('GET', '/agents/tia/status?app=crm')).j?.data; o.list = (await api('GET', '/agents/tia/conversations?limit=5')).s;
  return rec('CR-probe-' + (process.env.TAG || ''), o);
}
if (STEP === 'valid') {
  const o = {};
  for (const v of [0, -1, 1.5, 'abc', 1e12, null]) { const a = await getAgent(); const def = JSON.parse(JSON.stringify(B.agentDef)); def.tia = { ...def.tia, daily_user_credit_limit: v }; const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const g = await getAgent(); o[String(v)] = { put: p.s, stored: g.draft_definition?.tia?.daily_user_credit_limit, err: p.s >= 300 ? (p.t || '').slice(0, 160) : undefined }; }
  const a = await getAgent(); const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: B.agentDef, expected_updated_at: a.updated_at }); const g = await getAgent(); o.draftRestored = p.s + ' same=' + (JSON.stringify(g.draft_definition) === JSON.stringify(B.agentDef)) + ' undeployed=' + g.has_undeployed_changes;
  return rec('CR-05', o);
}
if (STEP === 'capvalid') {
  const o = {};
  for (const v of [-5, 'abc', 1.5]) { o[String(v)] = await setPolicyTia({ ...B.policyTia, daily_credit_cap: v }); const now = (await api('GET', '/ai/policy')).j?.data; o[String(v)].stored = now.descriptor.features.tia.daily_credit_cap; o[String(v)].ver = now.version; if (JSON.stringify(now.descriptor.features.tia) !== JSON.stringify(B.policyTia)) o[String(v)].restore = await setPolicyTia(B.policyTia); }
  return rec('CR-07', o);
}
if (STEP === 'cap') { const v = process.env.CAP === 'base' ? B.policyTia : { ...B.policyTia, daily_credit_cap: Number(process.env.CAP) }; const r = await setPolicyTia(v); ledger(`CR: policy tia set to ${JSON.stringify(v)} ${JSON.stringify(r)}`); await sleep(5000); return rec('CR-cap-' + process.env.CAP, r); }
if (STEP === 'restore') { const o = {}; const a = await getAgent(); if (JSON.stringify(a.draft_definition) !== JSON.stringify(B.agentDef) || a.has_undeployed_changes) o.agent = await deploy(B.agentDef); const p = (await api('GET', '/ai/policy')).j?.data; if (JSON.stringify(p.descriptor.features.tia) !== JSON.stringify(B.policyTia)) o.policy = await setPolicyTia(B.policyTia); ledger('CR restore ' + JSON.stringify(o)); return o; }
if (STEP === 'verify') { const a = await getAgent(); const p = (await api('GET', '/ai/policy')).j?.data; return { agentSame: JSON.stringify(a.draft_definition) === JSON.stringify(B.agentDef), undeployed: a.has_undeployed_changes, ver: a.deployed_version_no, policySame: JSON.stringify(p.descriptor.features.tia) === JSON.stringify(B.policyTia), policyVer: p.version, tia: a.draft_definition.tia }; }
