const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const mk = (name, type, size) => api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
const put = (u, b, t) => page.evaluate(async ([u, n, t, s]) => { const body = s != null ? s : new Uint8Array(n); try { const r = await fetch(u, { method: 'PUT', headers: { 'Content-Type': t }, body }); return r.status + ' ' + (await r.text()).slice(0, 120); } catch (e) { return 'ERR ' + e.message; } }, [u, typeof b === 'number' ? b : 0, t, typeof b === 'string' ? b : null]);
out.cap = {};
for (const mb of [1, 5, 8, 10, 12, 15]) {
  const n = mb * 1048576; const r = await mk('qa-r2sc-' + mb + 'mb.pdf', 'application/pdf', n);
  const p = await put(r.j.data.upload_url, n, 'application/pdf'); const c = await api('POST', `/files/${r.j.data.file_id}/confirm`, { file_id: r.j.data.file_id, size_bytes: n });
  out.cap[mb + ' MB'] = { put: p, confirm: c.s, fid: r.j.data.file_id };
}
out.uploadUrlShape = (await mk('qa-r2sc-shape.pdf', 'application/pdf', 10)).j.data.upload_url.replace(/[?].*/, '?…').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}');
// attach a never-uploaded file
const r2 = await mk('qa-r2sc-ghost.pdf', 'application/pdf', 2048);
const a2 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: r2.j.data.file_id, file_name: 'qa-r2sc-ghost.pdf', content_type: 'application/pdf', size: 2048 });
out.ghost = { attach: a2.s, attId: a2.j && a2.j.data && a2.j.data.id, fid: r2.j.data.file_id };
const d2 = await api('POST', `/files/${r2.j.data.file_id}/download`, { file_id: r2.j.data.file_id, vouching_app_key: 'crm' });
out.ghost.download = d2.s; out.ghost.fetch = d2.j && d2.j.data ? await page.evaluate(async u => (await fetch(u)).status, d2.j.data.download_url) : d2.t.slice(0, 200);
// attach a random file id
const a3 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: '00000000-0000-4000-8000-000000000001', file_name: 'qa-r2sc-random.pdf', content_type: 'application/pdf', size: 1 });
out.randomId = { s: a3.s, t: a3.t.slice(0, 200), attId: a3.j && a3.j.data && a3.j.data.id };
