const out = {};
// L-06 duplicate: same turn_id twice in parallel
const tid = crypto.randomUUID();
const [a, b] = await Promise.all([stream('/agents/tia/turn/stream', { turn_id: tid, message: 'Reply with the word ALPHA' }), stream('/agents/tia/turn/stream', { turn_id: tid, message: 'Reply with the word ALPHA' })]);
out.L06 = [a.status + ' ' + (a.error || a.j?.error?.code || '') + ' ' + (a.text || '').slice(0, 20), b.status + ' ' + (b.error || b.j?.error?.code || '') + ' ' + (b.text || '').slice(0, 20)];
// L-04 busy: two different turns at once
const [c, d] = await Promise.all([stream('/agents/tia/turn/stream', { turn_id: crypto.randomUUID(), message: 'Summarise ticket QA TIA T1 in 5 bullet points.' }), (async () => { await sleep(1500); return stream('/agents/tia/turn/stream', { turn_id: crypto.randomUUID(), message: 'Reply with OK' }); })()]);
out.L04 = [c.status + ' ' + (c.error || c.j?.error?.code || 'ok'), d.status + ' ' + (d.error || d.j?.error?.code || 'ok') + ' ' + (d.text || '').slice(0, 20)];
// L-09 too long
out.L09 = {};
for (const n of [4001, 20000, 50000]) { const r = await stream('/agents/tia/turn/stream', { turn_id: crypto.randomUUID(), message: 'Please count the words. ' + 'word '.repeat(Math.ceil(n / 5)).slice(0, n) }); out.L09[n] = r.status + ' ' + (r.error || r.j?.error?.code || 'ok') + ' ' + (r.text || '').slice(0, 60); }
// L-03 stream cut: abort after first event, then poll the turn
const t3 = crypto.randomUUID();
const cut = await stream('/agents/tia/turn/stream', { turn_id: t3, message: 'List 5 tips for writing a polite reply to a customer.' }, 1500);
let st = null; for (let i = 0; i < 20; i++) { st = (await api('GET', `/agents/tia/turns/${t3}`)).j?.data; if (st?.status && st.status !== 'running') break; await sleep(3000); }
out.L03 = { cut: cut.status + ' ' + cut.error, after: st?.status, hasResponse: !!st?.response, text: (st?.response?.text || '').slice(0, 60) };
// H-11 stop: start and cancel
const t11 = crypto.randomUUID();
const p = stream('/agents/tia/turn/stream', { turn_id: t11, message: 'Write a 300 word summary of how to handle angry customers.' });
await sleep(1200); const cx = await api('POST', `/agents/tia/turns/${t11}/cancel`, {}); const res = await p; const st11 = (await api('GET', `/agents/tia/turns/${t11}`)).j?.data;
out.H11 = { cancel: cx.s + ' ' + (cx.j?.error?.code || ''), stream: res.status + ' ' + (res.error || 'no-error') + ' len ' + (res.text || '').length, turn: st11?.status + ' ' + (st11?.error_code || '') };
fs.writeFileSync(RUN + '/out/l-api.json', JSON.stringify(out, null, 1));
return out;
