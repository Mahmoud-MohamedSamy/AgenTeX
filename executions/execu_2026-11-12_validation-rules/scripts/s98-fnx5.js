const mid = await modId(); const L = I.layout; const o = {}; const crypto = globalThis.crypto;
const W = JSON.parse(fs.readFileSync(RUN + '/out/webhook.json', 'utf8'));
const setResp = async (content, status = 200) => (await fetch('https://webhook.site/token/' + W.uuid, { method: 'PUT', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ default_status: status, default_content: JSON.stringify(content), default_content_type: 'application/json', cors: false }) })).status;
// F9: signature check + edit request
const q = await (await fetch('https://webhook.site/token/' + W.uuid + '/requests?sorting=newest&per_page=50', { headers: { accept: 'application/json' } })).json();
const all = q.data || []; const edit = all.find(x => /"operation":"update"/.test(x.content || ''));
if (edit) { const b = JSON.parse(edit.content); o.edit = { recordId: !!b.recordId, operation: b.operation, recordKeys: Object.keys(b.record).length, hasLayout: 'layoutId' in b || 'layout_id' in b }; }
const one = all[0]; const sig = one && (one.headers['x-anyware-signature'] || [])[0] || ''; o.sigFormat = sig.replace(/[0-9a-f]{64}$/, '<64hex>').slice(0, 30);
const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('qa-vr1112-secret-0001'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const tsHdr = Object.entries(one.headers).filter(([h]) => /timestamp|time/i.test(h)).map(([h, v]) => h + '=' + v[0]);
const mac = Buffer.from(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(one.content))).toString('hex');
o.sigMatchesBodyHmac = sig.endsWith(mac); o.tsHeaders = tsHdr;
// X5: bad code refused, good code saved, receiver offline
await setResp({ status: 'error', message: 'QA X5 unknown agency code' }); await sleep(800);
const bad = await mkRec(mid, { ...I.base, last_name: P + ' X5 bad', qa_vr_text: 'AGENCY-999' }, L); o.X5bad = bad.s + ' ' + bad.err.slice(80, 230);
await setResp({ status: 'success' }); await sleep(800);
const good = await mkRec(mid, { ...I.base, last_name: P + ' X5 good', qa_vr_text: 'AGENCY-001' }, L); o.X5good = good.s;
const del = await fetch('https://webhook.site/token/' + W.uuid, { method: 'DELETE', headers: { accept: 'application/json' } }); o.receiverDeleted = del.status; await sleep(1500);
const a0 = Date.now(); const off = await mkRec(mid, { ...I.base, last_name: P + ' X5 offline', qa_vr_text: 'AGENCY-001' }, L); o.X5offline = off.s + ' ' + off.err.slice(80, 230) + ' (' + (Date.now() - a0) + ' ms)';
fs.writeFileSync(RUN + '/out/fn-x5.json', JSON.stringify(o, null, 1)); return o;
