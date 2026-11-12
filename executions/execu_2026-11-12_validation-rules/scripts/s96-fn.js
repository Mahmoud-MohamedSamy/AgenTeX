// Function rules against webhook.site. Calibrate the answer format with test-function.
const mid = await modId(); const L = I.layout; const o = {};
const W = JSON.parse(fs.readFileSync(RUN + '/out/webhook.json', 'utf8')); const URL = 'https://webhook.site/' + W.uuid;
const setResp = async (content, status = 200, extra = {}) => { const r = await fetch('https://webhook.site/token/' + W.uuid, { method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ default_status: status, default_content: typeof content === 'string' ? content : JSON.stringify(content), default_content_type: 'application/json', cors: false, ...extra }) }); return r.status; };
if (!I.fn) {
  const r = await mkRule(mid, { name: P + ' F function', layoutId: L, primaryField: 'qa_vr_text', kind: 'function', function: { url: URL, timeoutMs: 5000 }, functionSecret: 'qa-vr1112-secret-0001', branches: [] });
  o.create = SR(r).slice(0, 300); if (!(r.j && r.j.data)) return o; I.fn = r.j.data.id; SAVE();
}
const cands = [{ status: 'error', message: 'QA F6 refused by function' }, { valid: false, message: 'QA F6 refused by function' }, { success: false, message: 'QA F6 refused by function' }, { result: 'error', message: 'QA F6 refused by function' }, { status: 'success' }, { valid: true }, { success: true }];
o.calib = [];
for (const c of cands) { const s = await setResp(c); await sleep(800); const t = await api('POST', VR(mid) + '/' + I.fn + '/test-function', { data: { qa_vr_text: 'calib' } }); o.calib.push(JSON.stringify(c) + ' -> ' + s + ' / ' + t.s + ' ' + JSON.stringify(t.j && (t.j.data || t.j.error)).slice(0, 220)); }
return o;
