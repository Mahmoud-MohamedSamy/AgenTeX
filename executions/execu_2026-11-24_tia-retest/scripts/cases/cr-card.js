// Card made before the workspace cap, confirmed after. SUB=make|confirm|clean
const F = RUN + '/out/cr-card.json'; const S = fs.existsSync(F) ? JSON.parse(fs.readFileSync(F, 'utf8')) : {}; const SUB = process.env.SUB;
if (SUB === 'make') {
  const r = await ask('Create a lead with first name "QA TIA CR card" and last name "Cap". Prepare the card for me to confirm.', { page: { app: 'crm' } });
  S.conv = r.final?.conversation_id; S.actions = (r.final?.pending_actions || []).map(a => ({ id: a.id, kind: a.kind, summary: (a.summary || '').slice(0, 120) })); S.text = (r.text || r.final?.text || '').slice(0, 200);
  fs.writeFileSync(F, JSON.stringify(S, null, 1)); return S;
}
if (SUB === 'confirm') {
  const o = {}; for (const a of S.actions || []) { const r = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); o[a.id.slice(0, 8)] = { s: r.s, body: (r.t || '').slice(0, 250) }; }
  S.confirm = o; fs.writeFileSync(F, JSON.stringify(S, null, 1)); return o;
}
if (SUB === 'clean') {
  const L = M.leads; const r = await api('GET', `/modules/${L}/records?page=1&per_page=50&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: 'QA TIA CR' }]))}`);
  const o = { found: arr(r.j?.data).length, del: [] }; for (const x of arr(r.j?.data)) o.del.push((await api('DELETE', `/modules/${L}/records/${x.id}`)).s);
  if (S.conv) o.conv = (await api('DELETE', `/agents/tia/conversations/${S.conv}`)).s; ledger('CR card cleanup ' + JSON.stringify(o)); return o;
}
