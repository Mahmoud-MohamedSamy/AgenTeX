const r = await ask('Write a knowledge base article draft titled "QA TIA How to reset your password" with 3 short steps.');
const c = (r.final?.pending_actions || [])[0];
let conf = null; if (c) { const x = await api('POST', `/agents/tia/actions/${c.id}/confirm`, {}); conf = { s: x.s, msg: x.j?.data?.message, e: x.j?.error }; }
return { s: r.status, err: r.error, types: r.types, text: (r.text || r.final?.text || '').slice(0, 400), card: c && { kind: c.kind, target: c.target, lines: (c.lines || []).map(l => l.label + ': ' + String(l.value).slice(0, 60)) }, conf };
