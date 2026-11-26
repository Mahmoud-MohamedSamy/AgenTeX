// Notifications: manual owner change vs Tia owner change. SUB=snap(mahmoud) | act(owner) | diff(mahmoud) | clean(owner)
const F = RUN + '/out/nt.json'; const S = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : {}; const save = () => fs.writeFileSync(F, JSON.stringify(S, null, 1));
const L = M.leads; const MAH = '3445ec4a-020e-4f12-b156-dd2de7610164'; const SUB = process.env.SUB; const val = v => ({ kind: 'string', value: v });
const notifs = async () => arr((await api('GET', '/notifications?limit=50')).j?.data?.data || (await api('GET', '/notifications?limit=50')).j?.data);
if (SUB === 'snap') { S.before = (await notifs()).map(n => n.id); save(); return { n: S.before.length }; }
if (SUB === 'act') {
  const mk = async nm => { const r = await api('POST', `/modules/${L}/records`, { data: [{ field: 'first_name', value: val(nm) }, { field: 'name', value: val(nm) }] }); return r.j?.data?.id || r.j?.data?.[0]?.id; };
  S.a = await mk('QA TIA NT manual'); S.b = await mk('QA TIA NT viaTia'); save(); ledger(`NT leads ${S.a} ${S.b} — delete`);
  const p = await api('PATCH', `/modules/${L}/records/${S.a}`, { data: [{ field: 'owner', value: val(MAH) }] }); S.manual = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 200) : '');
  const r = await ask(`Change the owner of the lead named "QA TIA NT viaTia" to the user mahmoud.mahamed1515. Prepare the card for me to confirm.`, { page: { app: 'crm' } });
  S.tiaText = (r.text || r.final?.text || '').slice(0, 250); S.cards = (r.final?.pending_actions || []).map(a => a.kind + ': ' + (a.summary || '').slice(0, 150));
  for (const a of r.final?.pending_actions || []) { const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); S.confirm = c.s + ' ' + (c.t || '').slice(0, 250); }
  if (r.final?.conversation_id) S.conv = r.final.conversation_id; save();
  const own = async id => arr((await api('GET', `/modules/${L}/records/${id}`)).j?.data?.data).find(x => x.field === 'owner')?.value?.value;
  await sleep(20000); S.ownerA = (await own(S.a)) === MAH; S.ownerB = (await own(S.b)) === MAH; save(); return S;
}
if (SUB === 'diff') { const before = new Set(S.before || []); const nw = (await notifs()).filter(n => !before.has(n.id)); S.newNotifs = nw.map(n => ({ type: n.event_type, title: n.title, rec: n.data?.record_id === S.a ? 'A-manual' : n.data?.record_id === S.b ? 'B-tia' : 'other' })); save(); return S.newNotifs; }
if (SUB === 'clean') { const o = {}; for (const k of ['a', 'b']) if (S[k]) o[k] = (await api('DELETE', `/modules/${L}/records/${S[k]}`)).s; if (S.conv) o.conv = (await api('DELETE', `/agents/tia/conversations/${S.conv}`)).s; ledger('NT clean ' + JSON.stringify(o)); return o; }
