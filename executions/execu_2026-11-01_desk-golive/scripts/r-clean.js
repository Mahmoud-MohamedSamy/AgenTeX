// Wave 2 cleanup: soft-delete our tickets, delete template + snippet, purge ONLY exact-match bin items (record_id ours AND label has "QA GL W2"), then verify.
const o = { del: {}, purge: {}, verify: {} }; const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const TICKETS = { 3105: 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9', 3106: '9804a4f1-b4d3-4b76-8638-3837001ceedc', 3107: 'a958ebfc-4a5f-489b-9019-a25db0610df0', 3108: '30bb8716-cd9a-4e0b-8d49-8a2aa67db1d6', 3119: 'f2fa192d-843d-4deb-b967-7383e71e882f', 3120: 'e4c207d8-cda7-43a1-946d-4d2626759b7e', 794: '5daa40f1-bd4c-424a-930b-d4bb5759201b', 3159: '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5', 3166: '0b337d8e-0f37-4170-bfb9-1ea70281d6c7', 3167: '9f7d1eae-bbc0-4530-865b-32a84477266c' };
const EXTRA = (typeof EXTRA_IDS !== 'undefined') ? EXTRA_IDS : {};
const OLD2NOV = ['16720dfc-eb4d-4231-b84b-464372b58d0b','4597b28f-8b03-45c3-a4b5-ad99baeee70b','7b730e71-6594-45b8-9b7d-96d10969ca00','5d2af5df-5efe-41bc-b822-7d82ade01719','95272caf-c101-4dc5-8351-faffa36f828b','495f3f67-904b-420a-9631-9ee2afb50e74','b62244d3-2509-4611-9df1-d1ceb812e41c','dca8f1fd-c427-4ad6-b3c4-1622e1485820','4a957724-e128-4c01-8380-b5a65fa541d9','aab97950-4415-45b2-8a8d-932f4309527f','28303528-17f6-4611-9298-68ae0c843594','e1267f7d-9cee-4f6d-b905-3b70c41073ba','f723e149-1ef7-4987-af11-6edee2b61580','7bc907e3-7066-4e33-b1b6-3637c9dd193f','b60b8010-8718-45a3-95cd-43b8fc89426b','e806b5ce-c550-4301-becc-f8252fd467f4'];
const ALL = { ...TICKETS, ...EXTRA };
for (const [n, id] of Object.entries(ALL)) { const g = await api('GET', `/desk/tickets/${id}`); const subj = g.j && g.j.data && (g.j.data.subject || ''); o.del[n] = [g.s]; if (g.s === 200) { const d = await api('DELETE', `/modules/${TM}/records/${id}`); o.del[n].push(d.s); } }
// template + snippet (2 Nov)
o.tpl = (await api('DELETE', '/desk/ticket-templates/84afac47-75e9-4386-91f7-37134b9f59e6')).s;
o.snip = (await api('DELETE', '/desk/snippets/4e152318-390d-4d91-b943-99fb33328f64')).s; o.snip2 = (await api('DELETE', '/desk/snippets/f642b176-8017-4475-8837-2f9d0140728b')).s;
await sleep(3000);
// purge from bin: exact match only
const ours = new Set([...Object.values(ALL), ...OLD2NOV, '691e8a2a-784f-4828-af18-5eaf115d631e']);
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(b.j && b.j.data)); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const pick = items.filter(x => ours.has(x.record_id) && /QA GL W2/i.test(x.record_label || ''));
o.binTotal = items.length; o.purge.picked = pick.map(x => [x.record_id.slice(0, 8), x.record_label, x.deleted_at]);
o.purge.skippedOurIdsWrongLabel = items.filter(x => ours.has(x.record_id) && !/QA GL W2/i.test(x.record_label || '')).map(x => [x.record_id.slice(0, 8), x.record_label]);
if (pick.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) }); o.purge.res = p.s + ' ' + p.t.slice(0, 200); }
// verify
for (const [n, id] of Object.entries(ALL)) { const g = await api('GET', `/desk/tickets/${id}`); o.verify[n] = g.s + (g.j && g.j.data && g.j.data.is_deleted ? ' deleted' : ''); }
const l = await api('GET', `/modules/${TM}/records?limit=50&q=` + encodeURIComponent('QA GL W2')); o.verify.listQA = arr(l.j && l.j.data).map(fl).filter(x => /QA GL W2/.test(x.subject || '')).map(x => [x.ticket_number, x.subject]);
const s1 = await api('GET', '/desk/snippets'); o.verify.snippets = arr(s1.j && s1.j.data && s1.j.data.snippets).filter(x => /qa_gl|QA GL/i.test(JSON.stringify(x))).length;
const t1 = await api('GET', '/desk/ticket-templates'); o.verify.templates = arr(t1.j && t1.j.data && t1.j.data.templates).filter(x => /QA GL/i.test(JSON.stringify(x))).length;
for (const p of ['/desk/macros', '/desk/tags', `/modules/${TM}/views`, '/desk/scheduled-replies']) { const r = await api('GET', p); o.verify[p] = (r.t.match(/QA GL W2/g) || []).length; }
o.verify.sig = (await api('GET', '/mail/signatures/me')).t.slice(0, 80);
const b2 = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); o.verify.binOurs = arr(b2.j && b2.j.data).filter(x => ours.has(x.record_id)).map(x => [x.record_id.slice(0, 8), x.record_label]);
const st = await api('GET', '/desk/ticket-access/settings'); o.verify.access = st.t.slice(0, 200);
return done(o);
