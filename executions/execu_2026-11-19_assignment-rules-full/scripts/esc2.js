const o = {}; const D = IDS.DA; const t0 = Date.now(); const at = () => Math.round((Date.now() - t0) / 1000) + 's';
const y = await mk('ESC_Y2', 'QA AR ESC Y 2', D), n = await mk('ESC_N2', 'QA AR ESC N 2', D);
const edit = async (id, pr) => (await api('PATCH', '/modules/' + T + '/records/' + id, body({ priority: pr }))).s;
const slaOf = async id => { const d = ((await api('GET', '/desk/tickets/' + id + '/sla')).j || {}).data || {}; return JSON.stringify({ note: d.note, esc: d.escalated ?? d.is_escalated ?? d.sla_escalated, lvl: d.escalation_level ?? d.sla_escalation_level, ob: (d.obligations || []).map(x => x.kind + ':' + x.state) }); };
const rec = async id => { const r = await api('GET', '/modules/' + T + '/records/' + id); const f = fl(r.j.data); return Object.fromEntries(Object.entries(f).filter(([k]) => /escal|sla/i.test(k))); };
await sleep(6000); o.create = { y: await ownN(y.id), n: await ownN(n.id), slaY: await slaOf(y.id), recY: await rec(y.id) };
o.earlyEdit = await edit(y.id, 'High'); await sleep(10000); o.afterEarlyEdit = { y: await ownN(y.id), at: at() };
let esc = null; for (let i = 0; i < 36 && !esc; i++) { await sleep(10000); const s = await slaOf(y.id); const r = await rec(y.id); if (/true|"lvl":1|breach|violat|escalat/i.test(s) || Object.values(r).some(v => v === true || v === 1)) esc = { at: at(), s, r }; }
o.escalated = esc || { at: at(), s: await slaOf(y.id), r: await rec(y.id) };
o.editAfter = { y: await edit(y.id, 'Low'), n: await edit(n.id, 'Low') }; await sleep(3000);
o.after = { y: await waitO(y.id, 40), n: await waitO(n.id, 10), at: at() };
const h = (await api('GET', '/desk/tickets/' + y.id + '/history')).j; o.histY = JSON.stringify(h && h.data).match(/.{0,120}(assign|escalat).{0,120}/gi)?.slice(0, 4);
return o;
