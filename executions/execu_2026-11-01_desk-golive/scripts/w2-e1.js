const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const P = `/desk/tickets/${tk}`; const o = {};
const MM = 'f9877c93-bf97-422c-a62b-91e9df7a3849', MC = '5616592e-adad-4ad1-82b6-8e13f3751195', PA = 'c9e96413-189a-4933-91a5-ef1d94adf798', C1 = 'f3bf9581-ca76-46a9-a56e-0d757de60b27', C2 = '36c92f6b-c2e2-41dd-b651-1f5da310355b';
const sh = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '')).slice(0, 240) : undefined, d: r.j && r.j.data ? JSON.stringify(r.j.data).slice(0, 200) : undefined });
const at = new Date(Date.now() + 86400e3).toISOString(); const key = 'qa-gl-w2-sched-' + Date.now();
o.sched = sh(await api('POST', `${P}/scheduled-replies`, { idempotency_key: key, mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>', schedule: { send_at: at, time_zone: 'Africa/Cairo' } }, { 'Idempotency-Key': key }));
if (o.sched.s >= 400) o.sched2 = sh(await api('POST', `${P}/scheduled-replies`, { idempotency_key: key + 'b', mode: 'reply', to: ['mmohamed@anyware.software'], cc: [], bcc: [], subject: 'Re: QA GL W2 scheduled', body_html: '<p>QA GL W2 scheduled reply</p>', schedule: at }, { 'Idempotency-Key': key + 'b' }));
const sl = await api('GET', '/desk/scheduled-replies'); const items = (sl.j && sl.j.data && sl.j.data.scheduled_replies) || []; o.schedList = items.map(x => ({ id: x.id, st: x.status, at: x.send_at || x.scheduled_at || x.schedule, mine: x.ticket_id === tk })); 
const mine = items.find(x => x.ticket_id === tk); if (mine) { o.schedCancel = sh(await api('DELETE', `/desk/scheduled-replies/${mine.id}`)); if (o.schedCancel.s >= 400) o.schedCancel2 = sh(await api('POST', `/desk/scheduled-replies/${mine.id}/clear`, {})); const sl2 = await api('GET', '/desk/scheduled-replies?status=all'); o.schedAfter = ((sl2.j && sl2.j.data && sl2.j.data.scheduled_replies) || []).filter(x => x.ticket_id === tk).map(x => [x.status]); }
const sn = await api('POST', '/desk/snippets', { name: 'qa_gl_w2', title: 'QA GL W2 snippet', content_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>', scope: 'personal' }); o.snippet = sh(sn); const sid = sn.j && sn.j.data && (sn.j.data.id || (sn.j.data.snippet && sn.j.data.snippet.id));
if (sid) { CREATED.push({ k: 'snippet', id: sid }); o.resolve = sh(await api('POST', `${P}/snippets/resolve`, { snippet_ids: [sid], snippet_id: sid, content_html: '<p>Hello {{customer_name}}, ticket #{{ticket_number}}</p>' })); }
// follow
o.follow = sh(await api('PUT', `${P}/follow`, {})); o.followers = sh(await api('GET', `${P}/followers`)); o.unfollow = sh(await api('DELETE', `${P}/follow`));
// tags
o.tagAdd = sh(await api('POST', `${P}/tags`, { tags: ['qa-gl-w2'], names: ['qa-gl-w2'] })); o.tagList = sh(await api('GET', `${P}/tags`));
const tl = o.tagList; let tagId = null; try { const a = JSON.parse(tl.d || '[]'); const arr2 = Array.isArray(a) ? a : (a.items || a.tags || []); const t = arr2.find(x => (x.name || x.tag) === 'qa-gl-w2'); tagId = t && (t.id || t.tag_id); } catch (e) {}
o.tagId = tagId; if (tagId) o.tagRemove = sh(await api('DELETE', `${P}/tags/${tagId}`));
// spam
o.spam = sh(await api('POST', `${P}/spam`, {})); const sp = await api('GET', P); o.spamFlag = sp.j && sp.j.data && sp.j.data.spam; o.unspam = sh(await api('DELETE', `${P}/spam`)); const sp2 = await api('GET', P); o.spamAfter = sp2.j && sp2.j.data && sp2.j.data.spam;
// merge / unmerge
o.merge = sh(await api('POST', '/desk/tickets/merge', { master_ticket_id: MM, ticket_ids: [MC], source_ticket_ids: [MC] }));
const mc = await api('GET', `/desk/tickets/${MC}`); o.childMerged = mc.j && mc.j.data && [mc.j.data.merged_into_ticket_id, mc.j.data.status, mc.j.data.unmerge_available_until];
o.unmerge = sh(await api('POST', `/desk/tickets/${MC}/unmerge`, {})); const mc2 = await api('GET', `/desk/tickets/${MC}`); o.childAfterUnmerge = mc2.j && mc2.j.data && [mc2.j.data.merged_into_ticket_id, mc2.j.data.status];
// parent-child
o.link = sh(await api('POST', `/desk/tickets/${PA}/children`, { child_ids: [C1, C2], ticket_ids: [C1, C2] })); o.hier = sh(await api('GET', `/desk/tickets/${PA}/parent-child`));
o.unlink = sh(await api('DELETE', `/desk/tickets/${PA}/children/${C2}`)); o.hier2 = sh(await api('GET', `/desk/tickets/${PA}/parent-child`));
return fin(o);
