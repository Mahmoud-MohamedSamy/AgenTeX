const HC = 'e74f2abb-e28d-400e-908c-f2c54862e389'; const del = out.del = {}; const K = o => Object.keys(o || {});
const D_ = async (k, p, h) => { const r = await api('DELETE', p, undefined, h); (del[k] = del[k] || []).push(r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 100) : '')); return r; };
// tickets: ledger + any "QA GL W4" subject
const tk = { ...IDS.ticket };
const s = await api('GET', '/modules/' + TM + '/records?limit=100&q=' + encodeURIComponent('QA GL W4')); for (const t of arr(D(s.j)).map(flat)) if (/^QA GL W4/.test(t.subject || '')) tk[t.id] = t.subject;
out.ticketCount = K(tk).length;
for (const id of K(tk)) await D_('ticket', '/modules/' + TM + '/records/' + id);
// community
for (const id of K(IDS['community-topic'])) await D_('topic', '/desk/community/topics/' + id);
for (const id of K(IDS['community-category'])) await D_('ccat', '/desk/community/categories/' + id);
// KB
for (const id of K(IDS['kb-article'])) await D_('kbart', '/desk/kb/articles/' + id);
for (const id of K(IDS['kb-category'])) await D_('kbcat', '/desk/kb/categories/' + id);
for (const id of K(IDS['kb-template'])) await D_('kbtpl', '/desk/kb/article-templates/' + id);
// help widget
for (const id of K(IDS['help-widget'])) await D_('widget', '/help-centers/' + HC + '/widgets/' + id);
// web forms (need if-match)
for (const id of K(IDS['web-form'])) { const g = await api('GET', '/web-forms/' + id); const rv = D(g.j) && D(g.j).row_version; await D_('webform', '/web-forms/' + id, rv ? { 'if-match': String(rv) } : undefined); }
// email templates (reply ack first deactivated by delete attempt; fall back noted)
for (const id of K(IDS['email-template'])) await D_('etpl', '/desk/email-templates/' + id);
for (const id of K(IDS['email-template-folder'])) await D_('efolder', '/desk/email-templates/folders/' + id);
// address + blocked
for (const id of K(IDS.address)) await D_('address', '/desk/channels/addresses/' + id);
for (const id of K(IDS['spam-contact'])) await D_('spam', '/desk/channels/spam-contacts?address=' + encodeURIComponent(IDS['spam-contact'][id]));
await sleep(3000);
// purge bin: exact match on our ids AND "QA GL W4" label
const ours = new Set([...K(tk), ...K(IDS['community-topic']), ...K(IDS['community-category']), ...K(IDS['kb-article']), ...K(IDS['kb-category']), ...K(IDS['kb-template']), ...K(IDS['web-form']), ...K(IDS['email-template'])]);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const pick = items.filter(x => ours.has(x.record_id) && /QA GL W4/i.test(x.record_label || ''));
out.binPicked = pick.length; out.binOursOtherLabel = items.filter(x => ours.has(x.record_id) && !/QA GL W4/i.test(x.record_label || '')).map(x => [x.record_id.slice(0, 8), x.record_label]);
if (pick.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) }); out.purge = p.s + ' ' + p.t.slice(0, 150); }
return fin({ out });
