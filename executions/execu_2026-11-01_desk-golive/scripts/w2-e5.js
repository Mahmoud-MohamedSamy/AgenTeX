const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {};
const MM = 'f9877c93-bf97-422c-a62b-91e9df7a3849', MC = '5616592e-adad-4ad1-82b6-8e13f3751195', XS = '07e8ad7e-1ded-43f3-8a2f-54bb0bbfca8d';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 260) : undefined });
// views
const vl = await api('GET', `/modules/${T}/views`); const views = arr(vl.j && vl.j.data); o.views = views.map(v => (v.name || '') + (v.isSystem || v.is_system ? '*' : '')).join(' | ').slice(0, 700);
const vc = await api('POST', `/modules/${T}/views`, { name: 'QA GL W2 view', criteria: { op: 'eq', field: 'department', value: DQ }, columns: ['subject', 'status', 'priority'], visibility: 'private' }); o.viewCreate = sh(vc); const vid = vc.j && vc.j.data && vc.j.data.id;
if (vid) { CREATED.push({ k: 'view', id: vid }); o.viewPin = sh(await api('PUT', `/modules/${T}/views/${vid}/pin`, {})); o.viewUnpin = sh(await api('DELETE', `/modules/${T}/views/${vid}/pin`));
  const cl = await api('POST', `/modules/${T}/views/${vid}/clone`, { name: 'QA GL W2 view clone' }); o.viewClone = sh(cl); const cid = cl.j && cl.j.data && cl.j.data.id; if (cid) { CREATED.push({ k: 'view', id: cid }); o.viewCloneDel = sh(await api('DELETE', `/modules/${T}/views/${cid}`)); }
  o.viewDelete = sh(await api('DELETE', `/modules/${T}/views/${vid}`)); }
// filter via records list
const fr = await api('POST', `/modules/${T}/records/query`, { criteria: { op: 'contains', field: 'subject', value: 'QA GL W2' }, limit: 50 }); o.filter = fr.s + ' ' + (fr.s < 300 ? arr(fr.j && fr.j.data).length + ' rows' : fr.t.slice(0, 150));
// template list
const tl = await api('GET', '/desk/ticket-templates'); o.tplList = tl.s + ' ' + JSON.stringify(tl.j && tl.j.data).slice(0, 300);
// mass update + bulk assign/close
o.massUpdate = sh(await api('POST', `/modules/${T}/records/mass-update`, { record_ids: [MM, MC], data: [{ field: 'priority', value: { kind: 'string', value: 'Urgent' } }] }));
const g1 = await getRec(T, MM), g2 = await getRec(T, MC); o.afterMass = [g1.o.priority, g2.o.priority];
o.bulkAssign = sh(await api('POST', '/desk/tickets/bulk/assign', { ticket_ids: [MM, MC], owner_id: null }));
o.bulkClose = sh(await api('POST', '/desk/tickets/bulk/close', { ticket_ids: [MM, MC] }));
// attachment: presigned flow
const txtBody = 'QA GL W2 attachment ' + new Date().toISOString();
const up = await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2.txt', declared_content_type: 'text/plain', size_bytes: txtBody.length, owner_user_id: ME }); o.fileCreate = sh(up);
const fd = up.j && up.j.data; const fid = fd && (fd.file_id || fd.id); const url = fd && (fd.upload_url || fd.presigned_url || (fd.upload && fd.upload.url));
if (fid && url) { const put = await page.context().request.fetch(url, { method: (fd.upload_method || 'PUT'), headers: { 'content-type': 'text/plain', ...(fd.upload_headers || {}) }, data: txtBody, failOnStatusCode: false }); o.filePut = put.status();
  o.fileConfirm = sh(await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: txtBody.length }));
  o.attach = sh(await api('POST', `${P}/attachments`, { file_id: fid })); const al = await api('GET', `${P}/attachments`); const atts = arr(al.j && al.j.data); o.attList = atts.map(a => [a.id, a.file_name || a.name || a.original_filename, a.size_bytes || a.size]);
  if (atts[0]) o.attDelete = sh(await api('DELETE', `${P}/attachments/${atts[0].id}`)); }
// delete + restore (xss ticket)
o.delete = sh(await api('DELETE', `/modules/${T}/records/${XS}`)); const gd = await api('GET', `/modules/${T}/records/${XS}`); o.afterDelete = gd.s;
o.restore = sh(await api('POST', `/modules/${T}/records/${XS}/restore`, {})); const gr = await api('GET', `/modules/${T}/records/${XS}`); o.afterRestore = gr.s;
return fin(o);
