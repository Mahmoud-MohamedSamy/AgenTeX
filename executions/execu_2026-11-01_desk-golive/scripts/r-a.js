// 12 Nov resume, owner: fresh tickets + W2-04, 19, 45, 49, 56/58 setup, 74 setup, 37/76/85 setup, 83
const o = {}; const ids = {};
const mk = async (n, extra) => { const r = await mkRec(T, { subject: 'QA GL W2 ' + n, status: 'Open', department: DQ, contact_id: 'de7195a2-369e-48c5-b03f-b8e37d6c5fb2', channel: 'Phone', description: 'Go-live wave 2 test ticket (12 Nov). Safe to delete.', ...(extra || {}) }, n); o['mk ' + n] = [r.s, r.e && r.e.message]; return r.id; };
ids.base = await mk('r base');
ids.email = await mk('r email', { channel: 'Email', email: 'mmohamed@anyware.software' });
ids.share = await mk('r share');
ids.cs = await mk('r cs', { department: DCS });
ids.purge = await mk('r purge');
for (const k of Object.keys(ids)) { const g = await api('GET', '/desk/tickets/' + ids[k]); o['num ' + k] = g.j && g.j.data && g.j.data.ticket_number; }
// W2-04 filter + sort
const tries = [`/modules/${T}/records?limit=50&sort=-created_at&q=${encodeURIComponent('QA GL W2')}`, `/modules/${T}/records?limit=50&sort=-created_at&search=${encodeURIComponent('QA GL W2')}`];
for (const p of tries) { const r = await api('GET', p); const rows = arr(r.j && r.j.data).map(fl); o['list ' + p.split('&').pop().split('=')[0]] = [r.s, rows.length, rows.filter(x => /QA GL W2/.test(x.subject || '')).length, rows.slice(0, 6).map(x => [x.ticket_number, (x.subject || '').slice(0, 30), x.created_at])]; }
const fq = await api('POST', `/modules/${T}/records/query`, { filter: { kind: 'StringMatch', field: 'subject', operator: 'Contains', stringValue: 'QA GL W2' }, sort: [{ field: 'created_at', direction: 'desc' }], limit: 50 }); o.listQuery = [fq.s, fq.t.slice(0, 200)];
// W2-83 timing x3
const ms = []; for (let i = 0; i < 3; i++) { const t0 = Date.now(); await api('GET', `/modules/${T}/records?limit=25&sort=-created_at`); ms.push(Date.now() - t0); } o.listMs = ms;
// W2-19 reply all with CC on the email ticket, then the ticket CC list
const E = `/desk/tickets/${ids.email}`;
o.ccReply = sh(await api('POST', `${E}/replies`, { mode: 'reply_all', to: ['mmohamed@anyware.software'], cc: ['mahmoud.mmohamedsamy@gmail.com'], bcc: [], subject: 'Re: QA GL W2 r email', body_html: '<p>QA GL W2 reply all with CC, go-live test, please ignore.</p>' }));
await sleep(3000); o.ccList = sh(await api('GET', `${E}/cc`));
// W2-49 real oversize upload (30 MB, Zoho limit is 20 MB per file)
const big = 30 * 1024 * 1024;
const up = await api('POST', '/files', { app_key: 'desk', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-gl-w2-30mb.bin', declared_content_type: 'application/octet-stream', size_bytes: big, owner_user_id: ME }); o.bigCreate = sh(up);
const fid = up.j && up.j.data && up.j.data.file_id, url = up.j && up.j.data && up.j.data.upload_url;
if (url) { const pr = await page.context().request.fetch(url, { method: 'PUT', data: Buffer.alloc(big, 65), headers: { 'content-type': 'application/octet-stream' }, failOnStatusCode: false, timeout: 120000 }).catch(e => ({ status: () => 'ERR ' + e.message.slice(0, 80) })); o.bigPut = pr.status();
  o.bigConfirm = sh(await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: big }));
  o.bigAttach = sh(await api('POST', `/desk/tickets/${ids.base}/attachments`, { file_id: fid }));
  const al = await api('GET', `/desk/tickets/${ids.base}/attachments`); o.attList = arr(al.j && al.j.data).map(a => [a.id, a.file_name, a.size_bytes]); }
// W2-74 mention B in a comment (API)
o.mention = sh(await api('POST', `/desk/tickets/${ids.base}/comments`, { body_html: `<p>QA GL W2 r mention <span data-type="mention" data-id="${UB}" data-label="mahmoud.mahamed1515">@mahmoud.mahamed1515</span> please check</p>`, is_public: false, mentioned_user_ids: [UB] }));
// W2-56 approvals for B
for (const n of ['approve', 'reject']) o['ap ' + n] = sh(await api('POST', `/desk/tickets/${ids.base}/approvals`, { subject: 'QA GL W2 r approval ' + n, description: 'Go-live test, B will ' + n + ' it', approver_user_ids: [UB] }));
// W2-58 review drafts on base and email
for (const [k, id] of [['base', ids.base], ['email', ids.email]]) { const P = `/desk/tickets/${id}`;
  o['draft ' + k] = sh(await api('PUT', `${P}/drafts/mine`, { mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 r review ' + k, body_html: '<p>QA GL W2 reviewed reply (' + k + '), go-live test, please ignore.</p>' }));
  o['submit ' + k] = sh(await api('POST', `${P}/drafts/mine/submit-review`, {})); }
// W2-37 share the Marketing ticket with Customer Support (read only)
o.share = sh(await api('PUT', `/desk/tickets/${ids.share}/shares`, { shares: [{ department_id: DCS, access: 'read_only' }] }));
// W2-45 delete then delete forever
o.del = sh(await api('DELETE', `/modules/${T}/records/${ids.purge}`)); await sleep(3000);
const rb = await api('GET', '/audit/recycle-bin/items?q=' + encodeURIComponent('QA GL W2 r purge') + '&limit=20'); const its = arr(rb.j && rb.j.data); o.rbItems = its.length;
const it = ids.purge && its.find(x => x.record_id === ids.purge && x.record_label === 'QA GL W2 r purge'); o.rbMine = it ? it.id : 'not found'; if (it) { o.purge = sh(await api('POST', '/audit/recycle-bin/delete', { item_ids: [it.id || it.item_id], ids: [it.id || it.item_id] })); await sleep(3000);
  const rb2 = await api('GET', '/audit/recycle-bin/items?q=' + encodeURIComponent('QA GL W2 r purge') + '&limit=20'); o.rbAfter = arr(rb2.j && rb2.j.data).length; o.restoreAfterPurge = sh(await api('POST', `/modules/${T}/records/${ids.purge}/restore`, {})); }
await sleep(3000); o.wf = await wfx(ids.base);
o.ids = ids; return fin(o);
