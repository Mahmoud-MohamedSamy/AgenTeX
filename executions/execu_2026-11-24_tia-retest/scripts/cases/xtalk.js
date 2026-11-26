// Concurrency correctness: each user's answers must be their own. Run the same script for 8 users at once.
const P = { page: { app: process.env.APP } }; const ROUND = process.env.ROUND || '1';
const code = 'XT' + process.env.WHO.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
const total = (await api('GET', `/modules/${M.leads}/records?page=1&per_page=1`)).j?.meta?.total_count; // user's own visible leads (null if no CRM)
const say = async (cid, m) => { const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa' + Date.now() + Math.random().toString(36).slice(2, 6), ...(cid ? { conversation_id: cid } : {}), message: m, ...P }, 120000); return { cid: r.final?.conversation_id, text: r.text || r.final?.text || '', err: r.error || null }; };
const o = { who: process.env.WHO, round: ROUND, code, apiLeads: total };
const a = await say(null, `Please remember my personal code word for this chat: ${code}. Just confirm.`); const cid = a.cid; o.t1 = { err: a.err };
const b = await say(cid, 'What is my personal code word? Reply with the code word only.'); o.t2 = { err: b.err, text: b.text.slice(0, 80), ownCode: b.text.includes(code), otherCode: (b.text.match(/XT[A-Z]{1,4}[A-Z0-9]{4}/g) || []).filter(x => x !== code) };
const c = await say(cid, 'How many leads are there in CRM?'); const n = (c.text.match(/\d[\d,]*/) || [])[0]; o.t3 = { err: c.err, text: c.text.slice(0, 90), tiaLeads: n ? Number(n.replace(/,/g, '')) : null };
o.leadsMatch = total == null ? 'n/a' : o.t3.tiaLeads === total;
const m = arr((await api('GET', `/agents/tia/conversations/${cid}/messages`)).j?.data); o.history = { n: m.length, foreignCodes: m.flatMap(x => (String(x.text).match(/XT[A-Z]{1,4}[A-Z0-9]{4}/g) || [])).filter(x => x !== code) };
if (cid) o.deleted = (await api('DELETE', `/agents/tia/conversations/${cid}`)).s;
fs.appendFileSync(RUN + '/out/xtalk-results.jsonl', JSON.stringify({ at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
