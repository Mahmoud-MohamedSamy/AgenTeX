const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const mk = (name, type, size) => api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
const r2 = await mk('qa-r2sc-ghost.pdf', 'application/pdf', 2048);
const a2 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: r2.j.data.file_id, file_name: 'qa-r2sc-ghost.pdf', content_type: 'application/pdf', size: 2048 });
out.ghost = { attach: a2.s, t: a2.t.slice(0, 300), attId: a2.j && a2.j.data && a2.j.data.id, fid: r2.j.data.file_id };
const f = await api('GET', `/files/${r2.j.data.file_id}`); out.ghost.fileState = f.s + ' ' + f.t.slice(0, 400);
const d2 = await api('POST', `/files/${r2.j.data.file_id}/download`, { file_id: r2.j.data.file_id, vouching_app_key: 'crm' });
out.ghost.download = d2.s + ' ' + d2.t.slice(0, 200);
out.ghost.fetch = d2.j && d2.j.data && d2.j.data.download_url ? await page.evaluate(async u => (await fetch(u)).status, d2.j.data.download_url) : null;
const a3 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: '00000000-0000-4000-8000-000000000001', file_name: 'qa-r2sc-random.pdf', content_type: 'application/pdf', size: 1 });
out.randomId = { s: a3.s, t: a3.t.slice(0, 250), attId: a3.j && a3.j.data && a3.j.data.id };
// declared name vs real file: attach a pdf file under name .exe / .txt
const ok = (await api('GET', `/modules/${L}/records/${REC}/attachments`)).j.data; const pdf = ok.find(x => x.file_name === 'qa-r2sc.pdf');
const a4 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: pdf.file_id, file_name: 'qa-r2sc-renamed.exe', content_type: 'application/pdf', size: 64 });
out.renameExe = { s: a4.s, t: a4.t.slice(0, 250), attId: a4.j && a4.j.data && a4.j.data.id };
// same file attached twice
const a5 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: pdf.file_id, file_name: 'qa-r2sc.pdf', content_type: 'application/pdf', size: 64 });
out.dup = { s: a5.s, attId: a5.j && a5.j.data && a5.j.data.id };
// the size the client claims vs stored
const a6 = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: pdf.file_id, file_name: 'qa-r2sc-big-claim.pdf', content_type: 'application/pdf', size: 999999999 });
out.sizeClaim = { s: a6.s, attId: a6.j && a6.j.data && a6.j.data.id, stored: a6.j && a6.j.data && a6.j.data.size };
