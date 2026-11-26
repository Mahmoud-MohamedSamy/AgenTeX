// Group B — action-card lifecycle, CRM leads, Owner. SUB=main|b09|b06get|b06confirm|b08get|b08confirm
const SUB = process.env.SUB; const L = M.leads; const S = v => ({ kind: 'string', value: String(v) });
const src = async id => val((await getRec(L, id)).rec, 'lead_source');
const mkLead = async n => { const r = await api('POST', `/modules/${L}/records`, { data: [{ field: 'name', value: S('QA TIA P3 ' + n) }, { field: 'first_name', value: S('QA TIA P3') }, { field: 'last_name', value: S(n) }, { field: 'company', value: S('QA P3 Co') }, { field: 'lead_source', value: S('Web') }] }); const id = r.j?.data?.id; if (id) { ledger(`P3: lead QA TIA P3 ${n} ${id} — delete in R`); const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); (I2.extraLeads = I2.extraLeads || []).push(id); fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); } return id; };
const hist = async id => { const tl = await api('GET', `/timeline/records/leads/${id}/feed`); return (tl.j?.data?.data || tl.j?.data || []).filter(e => e.field_key === 'lead_source').map(e => `${e.previous_value}→${e.new_value}`); };
if (SUB === 'main') {
  // B-01 double confirm in parallel
  const b1 = await mkLead('B01'); let x = await askCard('Change the lead source of the lead "QA TIA P3 B01" to Referral.');
  if (x.acts[0]) { const [c1, c2] = await Promise.all([confirmA(x.acts[0]), confirmA(x.acts[0])]); await sleep(3000); p3rec('B-01', '?', `two parallel confirms: ${JSON.stringify(c1)} | ${JSON.stringify(c2)}; history=${JSON.stringify(await hist(b1))}; value=${await src(b1)}`, { conv: x.conv }); } else p3rec('B-01', 'Inconclusive', 'no card: ' + x.text.slice(0, 200));
  // B-03 confirm after reject
  const b3 = await mkLead('B03'); x = await askCard('Change the lead source of the lead "QA TIA P3 B03" to Referral.');
  if (x.acts[0]) { const rj = await rejectA(x.acts[0]); const c = await confirmA(x.acts[0]); p3rec('B-03', '?', `reject=${rj}; confirm after reject=${JSON.stringify(c)}; value=${await src(b3)}`, { conv: x.conv }); } else p3rec('B-03', 'Inconclusive', 'no card: ' + x.text.slice(0, 200));
  // B-04 stale: record changed after the card
  const b4 = await mkLead('B04'); x = await askCard('Change the lead source of the lead "QA TIA P3 B04" to Referral.');
  if (x.acts[0]) { const p = await api('PATCH', `/modules/${L}/records/${b4}`, { data: [{ field: 'lead_source', value: S('Partner') }] }); const c = await confirmA(x.acts[0]); p3rec('B-04', '?', `form change to Partner=${p.s}; then confirm=${JSON.stringify(c)}; value=${await src(b4)}; history=${JSON.stringify(await hist(b4))}`, { conv: x.conv }); } else p3rec('B-04', 'Inconclusive', 'no card: ' + x.text.slice(0, 200));
  // B-05 stale: record deleted after the card
  const b5 = await mkLead('B05'); x = await askCard('Change the lead source of the lead "QA TIA P3 B05" to Referral.');
  if (x.acts[0]) { const d = await api('DELETE', `/modules/${L}/records/${b5}`); const c = await confirmA(x.acts[0]); const g = await getRec(L, b5); p3rec('B-05', '?', `delete=${d.s}; confirm=${JSON.stringify(c)}; record after=${g.s} deleted=${g.rec?.is_deleted}`, { conv: x.conv }); } else p3rec('B-05', 'Inconclusive', 'no card: ' + x.text.slice(0, 200));
  // B-11 undo
  const b11 = await mkLead('B11'); x = await askCard('Change the lead source of the lead "QA TIA P3 B11" to Referral.');
  if (x.acts[0]) { const c = await confirmA(x.acts[0]); const u = await askCard('Undo that change — put the lead source back to what it was.', x.conv); const cu = u.acts[0] ? await confirmA(u.acts[0]) : null; p3rec('B-11', '?', `first=${JSON.stringify(c)}; undo card=${u.card || 'none'}; undo confirm=${JSON.stringify(cu)}; value=${await src(b11)}; text=${u.text.slice(0, 250)}`, { conv: x.conv }); }
  // B-12 card in another app (confirm through the Desk host is done by a second run; here record id)
  const b12 = await mkLead('B12'); x = await askCard('Change the lead source of the lead "QA TIA P3 B12" to Referral.');
  if (x.acts[0]) { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); I2.b12 = { action: x.acts[0].id, lead: b12, conv: x.conv }; fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); }
  // B-13 many pending: 5 cards, confirm the 3rd only
  const ids13 = []; for (let i = 1; i <= 5; i++) ids13.push(await mkLead('B13-' + i)); const acts = []; let conv13 = null;
  for (let i = 1; i <= 5; i++) { const y = await askCard(`Change the lead source of the lead "QA TIA P3 B13-${i}" to Referral.`, conv13); conv13 = y.conv; acts.push(y.acts[0] || null); }
  const c3 = acts[2] ? await confirmA(acts[2]) : null; const vals = []; for (const id of ids13) vals.push(await src(id));
  const msgs = arr((await api('GET', `/agents/tia/conversations/${conv13}/messages?limit=50`)).j?.data); const pend = msgs.filter(m => (m.pending_actions || []).length).length;
  p3rec('B-13', '?', `cards=${acts.filter(Boolean).length}/5; confirm 3rd=${JSON.stringify(c3)}; values=${vals.join(',')}; messages with pending cards in history=${pend}`, { conv: conv13 });
  // B-10 card after reload (history keeps pending actions?)
  const b10 = await mkLead('B10'); x = await askCard('Change the lead source of the lead "QA TIA P3 B10" to Referral.');
  const m10 = arr((await api('GET', `/agents/tia/conversations/${x.conv}/messages?limit=10`)).j?.data); const last = m10.filter(m => m.role === 'assistant').pop();
  p3rec('B-10', '?', `card offered=${!!x.acts[0]}; after reopening the chat (history) the last answer has pending_actions=${JSON.stringify(last?.pending_actions || null).slice(0, 200)}`, { conv: x.conv });
  if (x.acts[0]) await rejectA(x.acts[0]);
  // B-09 expiry: keep one pending card for later
  const b9 = await mkLead('B09'); x = await askCard('Change the lead source of the lead "QA TIA P3 B09" to Referral.');
  if (x.acts[0]) { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); I2.b09 = { action: x.acts[0].id, lead: b9, at: stamp() }; fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); }
  return 'ok';
}
if (SUB === 'b12') { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const c = await confirmA({ id: I2.b12.action }); const c2 = await confirmA({ id: I2.b12.action }); p3rec('B-12', '?', `card made in CRM, confirmed through the ${process.env.APP} host=${JSON.stringify(c)}; second confirm=${JSON.stringify(c2)}; value=${await src(I2.b12.lead)}`); return c; }
if (SUB === 'b09') { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); const c = await confirmA({ id: I2.b09.action }); p3rec('B-09', '?', `card created ${I2.b09.at}, confirmed ${stamp()}: ${JSON.stringify(c)}; value=${await src(I2.b09.lead)}`); return c; }
// B-06/B-07/B-08: get a card (as WHO), then the Owner changes access, then confirm
if (SUB === 'get') { const n = process.env.CASE; const id = await (async () => { const g = arr((await api('GET', `/modules/${L}/records?page=1&per_page=1&filters=${encodeURIComponent(JSON.stringify([{ field: 'last_name', operator: 'equals', value: process.env.LEADNAME }]))}`)).j?.data); return g[0]?.id; })();
  const x = await askCard(`Change the lead source of the lead "QA TIA P3 ${process.env.LEADNAME}" to Referral.`); const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); I2[n] = { action: x.acts[0]?.id || null, lead: id, text: x.text.slice(0, 200) }; fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); return I2[n]; }
if (SUB === 'confirm') { const n = process.env.CASE; const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); if (!I2[n]?.action) return p3rec(n, 'Inconclusive', 'no card was offered: ' + I2[n]?.text); const c = await api('POST', `/agents/tia/actions/${I2[n].action}/confirm`, {}); p3rec(n, '?', `confirm after the change: ${c.s} ${c.j?.data?.status || ''} ${c.j?.error?.code || ''} ${String(c.j?.data?.message || c.j?.error?.message || '').slice(0, 200)}`); return c.s; }
if (SUB === 'mk') return await mkLead(process.env.LEADNAME);
if (SUB === 'val') return await src(process.env.LEADID);
