page.on('dialog', d => d.accept().catch(() => {}));
const recent = arr((await api('GET', `/modules/${T}/records?page=1&per_page=30&sort_by=created_at&sort_dir=desc`)).j?.data).map(r => { const o = {}; for (const x of r.data || []) o[x.field] = val(x.value); return [(o.created_at || '').slice(11, 19), o.channel, o.subject].join(' | '); });
const cs = (await api('GET', '/desk/departments')).j?.data.find(d => d.id === CS);
const rp = (await api('GET', `/desk/tickets/6b1158b3-36f1-40dd-a5ba-688ef8f4df88/replies`)).j?.data; const r0 = arr(rp?.replies || rp)[0];
// replies on other QA tickets that got the earlier emails (B02, A2)
const other = {}; for (const [k, id] of [['B02', 'b7a7b3c6-f6e6-4abc-a4f9-3a2e7832689a'], ['A2', '30a2f098-c129-4229-abd0-d7af0594207a']]) { const x = (await api('GET', `/desk/tickets/${id}/replies`)).j?.data; other[k] = arr(x?.replies || x).map(r => r.direction + ' ' + r.created_at.slice(11, 19)); }
return fin({ recent: recent.slice(0, 12), csMail: cs?.email_addresses, replyMeta: r0 ? { from: r0.from, from_address_id: r0.from_address_id, reply_to: r0.reply_to, message_id: r0.message_id, keys: Object.keys(r0).join(',') } : null, other });
