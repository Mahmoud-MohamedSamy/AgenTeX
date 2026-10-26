// Run as AD (admin, HR/Marketing/Sales): reach AG's Customer Support QA records (ACT-A3/A4, RPL-A2). Read-first; writes only on QA records.
const TK = '60e81b1b-e8ae-4a5d-aad9-70b69d9624b9'; const s = r => r.s + ' ' + (r.j && r.j.error ? r.j.error.code + ' ' + r.j.error.message : 'ok').slice(0, 120);
const L = await api('GET', `/modules/${M.tasks}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`); const list = ((L.j && L.j.data && (L.j.data.records || L.j.data.items || L.j.data)) || []).map(fl);
const qa = list.filter(x => /^QA ACT/.test(x.subject || ''));
rec('ACT-A3', 'INFO', `admin of other departments lists tasks: ${L.s}, total=${L.j && L.j.meta && L.j.meta.total_count}, QA ACT tasks visible=${qa.length} (agent's Customer Support records). Zoho: activities are department-specific`);
const one = qa[0]; if (one) { const g = await api('GET', `/modules/${M.tasks}/records/${one.id}`); const p = await patch('tasks', one.id, { description: 'QA ACT edited by AD' }); rec('ACT-A4/A5', 'INFO', `GET ${s(g)}; PATCH ${s(p)}`); }
const t = await api('GET', `/desk/tickets/${TK}`); const rp = await api('GET', `/desk/tickets/${TK}/replies`);
const post = await api('POST', `/desk/tickets/${TK}/comments`, { content_html: '<p>QA RPL A2 comment by AD</p>', is_public: false });
rec('RPL-A2', t.s >= 400 && rp.s >= 400 && post.s >= 400 ? 'PASS' : 'FAIL', `admin (not in Customer Support) on a CS ticket: GET ticket ${s(t)}; GET replies ${s(rp)}; POST private comment ${s(post)}`);
if (post.s < 300 && post.j && post.j.data) await api('DELETE', `/desk/tickets/${TK}/comments/${post.j.data.id}`);
await go(`/modules/${M.tickets}/records/${TK}`, 9000); const ui = await txt(); rec('RPL-A2-ui', 'INFO', 'direct URL shows ticket content: ' + /QA RPL ticket 3/.test(ui) + ' / ' + ((ui.match(/(not found|permission|access)[^\n]{0,80}/i) || [''])[0]), { shot: await shot('RPL-A2-admin-url') });
return fin();
