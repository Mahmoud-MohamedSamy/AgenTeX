const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const up = async (name, type, size, fill) => {
  const r = await api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
  if (r.s >= 300) return { stage: 'create', s: r.s, t: r.t.slice(0, 250) };
  const fid = r.j.data.file_id;
  const put = await page.evaluate(async ([u, n, t, fill]) => { const b = new Uint8Array(n); if (fill) for (let i = 0; i < n; i++) b[i] = 65 + (i % 26); try { const r = await fetch(u, { method: 'PUT', headers: { 'Content-Type': t }, body: b }); return r.status; } catch (e) { return 'ERR ' + e.message; } }, [r.j.data.upload_url, size, type, fill]);
  const c = await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: size });
  if (c.s >= 300) return { stage: 'confirm', put, s: c.s, t: c.t.slice(0, 250), fid };
  const a = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: fid, file_name: name, content_type: type, size });
  return { stage: 'attach', put, s: a.s, t: a.s >= 300 ? a.t.slice(0, 250) : '', fid, attId: a.j && a.j.data && a.j.data.id };
};
out.types = {};
for (const [n, t] of [['qa-r2sc.pdf','application/pdf'],['qa-r2sc.png','image/png'],['qa-r2sc.jpg','image/jpeg'],['qa-r2sc.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ['qa-r2sc.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],['qa-r2sc.csv','text/csv'],['qa-r2sc.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  ['qa-r2sc.mp3','audio/mpeg'],['qa-r2sc.mp4','video/mp4'],['qa-r2sc.log','text/plain'],['qa-r2sc.json','application/json'],['qa-r2sc.zip','application/zip'],['qa-r2sc.html','text/html'],
  ['qa-r2sc.svg','image/svg+xml'],['qa-r2sc.exe','application/x-msdownload'],['qa-r2sc-exe-as.png','image/png'],['qa-r2sc.exe','image/png'],['qa-r2sc-noext','application/octet-stream'],['qa-r2sc.eml','message/rfc822'],['qa-r2sc.msg','application/vnd.ms-outlook']])
  out.types[n + ' (' + t + ')'] = await up(n, t, 64, true);
out.sizes = {};
for (const [lbl, sz] of [['0 B', 0], ['20 MB', 20 * 1048576], ['20 MB + 1', 20 * 1048576 + 1], ['25 MB', 25 * 1048576], ['100 MB', 100 * 1048576], ['1 GB', 1073741824], ['-1', -1]]) {
  const r = await api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-r2sc-size.pdf', declared_content_type: 'application/pdf', declared_size_bytes: sz });
  out.sizes[lbl] = { s: r.s, t: r.s >= 300 ? r.t.slice(0, 250) : 'file ' + r.j.data.file_id };
}
