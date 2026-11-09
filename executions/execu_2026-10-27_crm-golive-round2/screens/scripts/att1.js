const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const start = (name, type, size) => api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
// 1. one small text file end to end
const body = 'QA R2SC attachment text ' + Date.now();
const r1 = await start('qa-r2sc.txt', 'text/plain', body.length);
out.create = { s: r1.s, keys: r1.j && r1.j.data && Object.keys(r1.j.data), host: r1.j && r1.j.data && r1.j.data.upload_url && new URL(r1.j.data.upload_url, B).host, err: r1.s >= 300 ? r1.t : '' };
const fid = r1.j.data.file_id;
out.put = await page.evaluate(async ([u, b]) => { try { const r = await fetch(u, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: b }); return r.status; } catch (e) { return 'ERR ' + e.message; } }, [r1.j.data.upload_url, body]);
const c = await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: body.length }); out.confirm = { s: c.s, t: c.t.slice(0, 300) };
const a = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: fid, file_name: 'qa-r2sc.txt', content_type: 'text/plain', size: body.length });
out.attach = { s: a.s, t: a.t.slice(0, 500) };
const ls = await api('GET', `/modules/${L}/records/${REC}/attachments`); out.list = { s: ls.s, t: ls.t.slice(0, 600) };
const dl = await api('POST', `/files/${fid}/download`, { file_id: fid, vouching_app_key: 'crm' }); out.dl = { s: dl.s, keys: dl.j && dl.j.data && Object.keys(dl.j.data) };
const url = dl.j && dl.j.data && (dl.j.data.download_url || dl.j.data.url);
out.dlBody = url ? await page.evaluate(async u => { const r = await fetch(u); return r.status + ' ' + (await r.text()).slice(0, 80); }, url) : 'no url';
out.same = out.dlBody.endsWith(body);
out.fid = fid; out.attId = a.j && a.j.data && a.j.data.id;
