const card = r => (r.final?.pending_actions || [])[0]; const out = {};
const j06 = await ask('Add a private comment to ticket QA TIA T1 saying: We are checking the account lock with the IT team.');
const c6 = card(j06); out.J06 = { text: j06.text?.slice(0, 200), card: c6 && { kind: c6.kind, target: c6.target, lines: c6.lines, side: c6.side_effects } };
if (c6) { const x = await api('POST', `/agents/tia/actions/${c6.id}/confirm`, {}); out.J06.confirm = { s: x.s, msg: x.j?.data?.message, e: x.j?.error }; }
const j07 = await ask('Write a knowledge base article draft titled "QA TIA How to reset your password" with 3 short steps.');
const c7 = card(j07); out.J07 = { text: j07.text?.slice(0, 300), card: c7 && { kind: c7.kind, target: c7.target, lines: (c7.lines || []).map(l => l.label + ': ' + String(l.value).slice(0, 60)) } };
if (c7) { const x = await api('POST', `/agents/tia/actions/${c7.id}/confirm`, {}); out.J07.confirm = { s: x.s, msg: x.j?.data?.message, e: x.j?.error }; }
// J-13 double confirm in parallel
const j13 = await ask('Add a private comment to ticket QA TIA T2 saying: QA TIA J13 double click test.');
const c13 = card(j13);
if (c13) { const [a, b] = await Promise.all([api('POST', `/agents/tia/actions/${c13.id}/confirm`, {}), api('POST', `/agents/tia/actions/${c13.id}/confirm`, {})]); out.J13 = { a: a.s + ' ' + (a.j?.data?.status || a.j?.error?.code), b: b.s + ' ' + (b.j?.data?.status || b.j?.error?.code) }; }
fs.writeFileSync(RUN + '/out/j-desk.json', JSON.stringify(out, null, 1));
return out;
