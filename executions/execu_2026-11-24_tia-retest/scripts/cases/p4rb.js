// Rollback while a chat is open. Restores baseline at the end.
const B = JSON.parse(fs.readFileSync(RUN + '/out/cr-baseline.json', 'utf8')); const o = {}; const P = { page: { app: 'crm' } };
const deploy = async def => { const a = await getAgent(); const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const d = p.s < 300 ? await api('POST', `/agents/${a.id}/deploy`, {}) : { s: '-' }; return p.s + '/' + d.s; };
const say = async (cid, m) => { const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now(), conversation_id: cid, message: m, ...P }); return r.error || (r.text || r.final?.text || '').slice(0, 160); };
const a0 = await getAgent(); o.startVer = a0.deployed_version_no; const baseVer = a0.deployed_version_no;
const r0 = await ask('hi', P); const cid = r0.final?.conversation_id; o.chat = !!cid;
try {
  o.weatherBefore = await say(cid, 'How many leads are there?');
  const def = JSON.parse(JSON.stringify(B.agentDef)); def.tia = { ...def.tia, daily_user_credit_limit: 1 }; o.deployBlock = await deploy(def); ledger('P4 rollback test: deployed per-user limit 1 — restore'); await sleep(8000);
  o.newVer = (await getAgent()).deployed_version_no; o.weatherBlocked = await say(cid, 'How many leads are there?');
  const a = await getAgent(); const vl = arr((await api('GET', `/agents/${a.id}/versions/paged?limit=5`)).j?.data); const vid = vl.find(x => x.version_no === baseVer)?.id; o.baseVerId = !!vid; const rb = await api('POST', `/agents/${a.id}/versions/${vid}/redeploy`, {}); o.redeploy = rb.s + ' ' + (rb.s >= 300 ? (rb.t || '').slice(0, 200) : ''); await sleep(8000);
  const a2 = await getAgent(); o.afterVer = a2.deployed_version_no; o.afterDraftSame = JSON.stringify(a2.draft_definition) === JSON.stringify(B.agentDef); o.afterUndeployed = a2.has_undeployed_changes; o.limitNow = a2.draft_definition?.tia?.daily_user_credit_limit;
  o.weatherAfter = await say(cid, 'How many leads are there?');
  o.newChatAfter = (await (async () => { const r = await ask('How many leads are there?', P); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); return r.error || (r.text || r.final?.text || '').slice(0, 160); })());
} finally {
  const a3 = await getAgent(); if (JSON.stringify(a3.draft_definition) !== JSON.stringify(B.agentDef) || a3.has_undeployed_changes) o.finalRestore = await deploy(B.agentDef);
  const a4 = await getAgent(); o.final = { ver: a4.deployed_version_no, same: JSON.stringify(a4.draft_definition) === JSON.stringify(B.agentDef), undeployed: a4.has_undeployed_changes }; ledger('P4 rollback test restored ' + JSON.stringify(o.final));
  if (cid) await api('DELETE', `/agents/tia/conversations/${cid}`);
}
fs.appendFileSync(RUN + '/out/p4-results.jsonl', JSON.stringify({ part: 'rollback', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
