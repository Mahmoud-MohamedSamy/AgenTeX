const mid = await modId(); const L = I.layout; const o = {};
const W = JSON.parse(fs.readFileSync(RUN + '/out/webhook.json', 'utf8'));
const setResp = async (content, status = 200, extra = {}) => (await fetch('https://webhook.site/token/' + W.uuid, { method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ default_status: status, default_content: typeof content === 'string' ? content : JSON.stringify(content), default_content_type: 'application/json', cors: false, ...extra }) })).status;
const t = async (fn) => { const a = Date.now(); const r = await fn(); return [r, Date.now() - a]; };
// F6 error
await setResp({ status: 'error', message: 'QA F6 refused by function' }); await sleep(800);
let [r, ms] = await t(() => mkRec(mid, { ...I.base, last_name: P + ' F6', qa_vr_text: 'code-unknown' }, L)); o.F6 = `${r.s} ${r.err.slice(0, 200)} (${ms} ms)`;
// F7 success
await setResp({ status: 'success' }); await sleep(800);
[r, ms] = await t(() => mkRec(mid, { ...I.base, last_name: P + ' F7', qa_vr_text: 'code-ok' }, L)); o.F7 = `${r.s} ${r.err.slice(0, 120)} (${ms} ms)`; const okId = r.id;
// edit (record id should be sent)
const e = okId ? await updRec(mid, okId, { qa_vr_text: 'code-edit' }) : { s: 'n/a' }; o.F9edit = e.s;
// slow: webhook waits 7 s, rule timeout 5 s
await setResp({ status: 'success' }, 200, { timeout: 7 }); await sleep(800);
[r, ms] = await t(() => mkRec(mid, { ...I.base, last_name: P + ' F8 slow', qa_vr_text: 'code-slow' }, L)); o.slow = `${r.s} ${r.err.slice(0, 200)} (${ms} ms)`;
// 500 and bad JSON
await setResp({ status: 'success' }, 500); await sleep(800); [r, ms] = await t(() => mkRec(mid, { ...I.base, last_name: P + ' F8 500', qa_vr_text: 'code-500' }, L)); o.http500 = `${r.s} ${r.err.slice(0, 160)} (${ms} ms)`;
await setResp('not json at all', 200); await sleep(800); [r, ms] = await t(() => mkRec(mid, { ...I.base, last_name: P + ' F8 badjson', qa_vr_text: 'code-badjson' }, L)); o.badJson = `${r.s} ${r.err.slice(0, 160)} (${ms} ms)`;
// F9 inspect requests
const q = await (await fetch('https://webhook.site/token/' + W.uuid + '/requests?sorting=newest&per_page=20', { headers: { accept: 'application/json' } })).json();
const reqs = (q.data || []).map(x => { let body = null; try { body = JSON.parse(x.content); } catch (e) { } return { method: x.method, headers: Object.keys(x.headers || {}).filter(h => !/^(cdn|x-forwarded|x-real|via|accept-encoding|connection|content-length|host)/i.test(h)), auth: Object.keys(x.headers || {}).filter(h => /authorization|cookie|token/i.test(h)), sig: Object.entries(x.headers || {}).filter(([h]) => /signature|sign/i.test(h)).map(([h, v]) => h + ':len' + String(v).length), bodyKeys: body && Object.keys(body), bodySample: body && JSON.stringify(body).replace(/"(qa_vr_text|value)":"[^"]*"/g, (m) => m).slice(0, 400) }; });
o.F9 = reqs.slice(0, 4);
fs.writeFileSync(RUN + '/out/f9-requests.json', JSON.stringify(reqs, null, 1));
fs.writeFileSync(RUN + '/out/fn-results.json', JSON.stringify(o, null, 1)); return o;
