const a = short(await ask('How many leads whose name starts with QA TIA have lead source web?'));
const b = await ask('Change the lead source of the lead QA TIA Lead 1 to referral.');
const c = (b.final?.pending_actions || [])[0]; let conf = null;
if (c) { const x = await api('POST', `/agents/tia/actions/${c.id}/confirm`, {}); conf = { s: x.s, msg: x.j?.data?.message }; }
return { I01: a.text, J04: (b.text || '').slice(0, 250), card: c && { kind: c.kind, target: c.target?.record_label, lines: c.lines }, conf };
