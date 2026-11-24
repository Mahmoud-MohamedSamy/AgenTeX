const L = CRMIDS; const out = {};
const card = r => (r.final?.pending_actions || [])[0];
const j11 = await ask('Create a new contact: first name QA TIA, last name J11 Expiry, email qa.tia.j11@example.com.');
out.j11 = card(j11) && { id: card(j11).id, exp: card(j11).expires_at };
fs.writeFileSync(RUN + '/out/j11-card.json', JSON.stringify({ ...out.j11, made: new Date().toISOString() }));
const j01 = await ask('Create a new lead: first name QA TIA, last name J01, company QA Co, email qa.tia.j01@example.com.');
const c1 = card(j01); out.J01 = { text: j01.text?.slice(0, 200), card: c1 && { kind: c1.kind, target: c1.target, lines: c1.lines, side: c1.side_effects, exp: c1.expires_at } };
if (c1) { const x = await api('POST', `/agents/tia/actions/${c1.id}/confirm`, {}); out.J02 = { s: x.s, d: x.j?.data, e: x.j?.error }; }
const j03 = await ask('Create a new lead: first name QA TIA, last name J03 Cancel, company QA Co.');
const c3 = card(j03); if (c3) { const x = await api('POST', `/agents/tia/actions/${c3.id}/reject`, {}); const o = await api('GET', `/agents/tia/actions/${c3.id}`); out.J03 = { s: x.s, d: x.j?.data, outcome: o.j?.data }; const y = await api('POST', `/agents/tia/actions/${c3.id}/confirm`, {}); out.J20 = { s: y.s, e: y.j?.error }; }
const j04 = await ask(`Change the lead source of the lead QA TIA Lead 1 to referral.`);
const c4 = card(j04); out.J04 = { text: j04.text?.slice(0, 200), card: c4 && { kind: c4.kind, target: c4.target, lines: c4.lines } };
if (c4) { const x = await api('POST', `/agents/tia/actions/${c4.id}/confirm`, {}); out.J04.confirm = { s: x.s, d: x.j?.data }; }
const j05 = await ask('Add a note "QA TIA note J05" to the contact QA TIA Contact A.');
const c5 = card(j05); out.J05 = { text: j05.text?.slice(0, 200), card: c5 && { kind: c5.kind, target: c5.target, lines: c5.lines } };
if (c5) { const x = await api('POST', `/agents/tia/actions/${c5.id}/confirm`, {}); out.J05.confirm = { s: x.s, d: x.j?.data }; }
fs.writeFileSync(RUN + '/out/j-crm.json', JSON.stringify(out, null, 1));
return out;
