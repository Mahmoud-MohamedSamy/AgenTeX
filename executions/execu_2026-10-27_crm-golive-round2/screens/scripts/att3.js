const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const MB16 = 16777216;
const mk = (name, type, size) => api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
const put = (u, n, t) => page.evaluate(async ([u, n, t]) => { try { const r = await fetch(u, { method: 'PUT', headers: { 'Content-Type': t }, body: new Uint8Array(n) }); return r.status; } catch (e) { return 'ERR ' + e.message; } }, [u, n, t]);
// exactly 16 MB: real upload + attach
let r = await mk('qa-r2sc-16mb.pdf', 'application/pdf', MB16);
out.exact16 = { create: r.s };
if (r.s < 300) { const f = r.j.data.file_id; out.exact16.put = await put(r.j.data.upload_url, MB16, 'application/pdf'); const c = await api('POST', `/files/${f}/confirm`, { file_id: f, size_bytes: MB16 }); out.exact16.confirm = c.s;
  const a = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: f, file_name: 'qa-r2sc-16mb.pdf', content_type: 'application/pdf', size: MB16 }); out.exact16.attach = a.s; out.exact16.attId = a.j && a.j.data && a.j.data.id; }
r = await mk('qa-r2sc-16mb1.pdf', 'application/pdf', MB16 + 1); out.over16 = { create: r.s, t: r.t.slice(0, 200) };
// declare 1 KB, upload 17 MB, confirm 1 KB
r = await mk('qa-r2sc-lie.pdf', 'application/pdf', 1024);
if (r.s < 300) { const f = r.j.data.file_id; const p = await put(r.j.data.upload_url, MB16 + 1048576, 'application/pdf'); const c = await api('POST', `/files/${f}/confirm`, { file_id: f, size_bytes: 1024 });
  out.lie = { put: p, confirm: c.s, confirmT: c.t.slice(0, 300) };
  if (c.s < 300) { const a = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: f, file_name: 'qa-r2sc-lie.pdf', content_type: 'application/pdf', size: 1024 }); out.lie.attach = a.s; out.lie.attId = a.j && a.j.data && a.j.data.id; out.lie.fid = f;
    const g = await api('GET', `/files/${f}`); out.lie.stored = g.t.slice(0, 400); } }
// SVG download: content type and disposition
const ls = await api('GET', `/modules/${L}/records/${REC}/attachments`);
out.list = (ls.j.data.items || ls.j.data).map(x => ({ id: x.id, n: x.file_name, size: x.size, by: x.created_by_name, at: x.created_at, fid: x.file_id }));
const svg = out.list.find(x => x.n.endsWith('.svg'));
if (svg) { const d = await api('POST', `/files/${svg.fid}/download`, { file_id: svg.fid, vouching_app_key: 'crm' }); const u = d.j.data.download_url;
  out.svgUrlHost = new URL(u, B).host; out.svgHeaders = await page.evaluate(async u => { const r = await fetch(u); return { s: r.status, ct: r.headers.get('content-type'), cd: r.headers.get('content-disposition'), csp: r.headers.get('content-security-policy'), nosniff: r.headers.get('x-content-type-options') }; }, u); }
