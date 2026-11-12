const IDS = {"address":{"aaadcce0-bbda-4c33-86bd-0d78c0bd5828":"qa-gl-w4@help-staging.anyware.software"},"spam-contact":{"029ec576-d4f3-40cc-8d45-07eabb13f93b":"qa-gl-w4-blocked@example.com"},"email-template-folder":{"5c2d51b3-8a21-4f10-9dd4-cf0015925bc9":"QA GL W4 folder"},"email-template":{"9dfb198b-8f5c-4c38-9dcc-2a4d0ebdc34d":"QA GL W4 template","15567cb2-67fd-45d6-941c-01726e02d9b3":"QA GL W4 قالب عربي","1cf6b3f6-c03a-4bc2-9048-c994cbb788a3":"QA GL W4 script","595e47ac-6eeb-4733-97f0-4848f0eb8b27":"QA GL W4 template (copy)","0f472a78-e303-4644-9cd7-ef35c013382d":"QA GL W4 reply ack"},"web-form":{"c0f5ca78-1fb6-4649-905c-3056adc27555":"QA GL W4 widget","74fd3081-f5d2-4ad4-aa5d-8f1131254cb1":"QA GL W4 form"},"ticket":{"c6b24085-19a4-42b5-b127-f52bc2463ef0":"3198 QA GL W4 form 01","0b34176e-c1e5-420d-95c9-a54e125b2c0e":"3197 QA GL W4 form xss <img src=x onerror=ale","9050f3a8-3280-435a-9ac7-94f1ee016ac1":"3196 QA GL W4 LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL","c3bb4fe3-d192-41e0-b68f-5829250f53fd":"3203 QA GL W4 disabled submit","ef64ab85-b711-4722-acbf-e79634e388b9":"3202 QA GL W4 form embed 01","4c4ff756-4b10-420a-8315-2e89fc64ad19":"3201 QA GL W4 نموذج عربي ٠١","8283eaa6-67b8-42a2-993b-c0d40b29251c":"3200 QA GL W4 نموذج عربي ٠١","5ca7d2b3-ce79-4cd4-b0ae-d132d70f5746":"3199 QA GL W4 captcha unsolved","7f2eca8f-d870-4cbf-b555-54d0d2605d29":"QA GL W4 portal 02","48326997-5fc4-49c4-8303-ce5c9429bad0":"QA GL W4 portal 01","89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23":"QA GL W4 mail 01","271150d9-49fd-4de1-a7d8-068b14d3927f":"QA GL W4 ar mail","6f9037a0-15b3-4f21-a584-2e21b3b5259e":"QA GL W4 mail to new address"},"help-widget":{"d26b3a14-5ff5-4a68-b103-1cd2002306e3":"QA GL W4 widget"},"kb-category":{"fc9e7878-c973-4787-b223-fd9bc6610062":"QA GL W4 KB","17852f21-d689-4c6f-a1fa-c9083871aa20":"QA GL W4 KB hidden","2dda6133-f8ba-40e3-842e-a43d09faf9a5":"QA GL W4 KB review"},"kb-article":{"0f683d99-2d89-4846-ae0a-ed741692cc83":"QA GL W4 article","eee6b273-d475-419f-8fe7-dede7a661816":"QA GL W4 draft","f14dcb38-c658-45f2-b5f9-0ce4496994c2":"QA GL W4 مقال عربي","8a0e4ef1-51ae-43f3-8ce4-d938014aec66":"QA GL W4 script","67c9ef3e-d1c8-4cce-854b-c8c04f0b1a3b":"QA GL W4 hidden","3f07f22d-1c3d-41c5-855a-fdaf330361dd":"QA GL W4 expiring","52f0f3f8-ae3e-47de-b4ce-9969c24b403a":"QA GL W4 agents only","a42174d4-fa09-4a2b-bb6d-b1dbd102da1c":"QA GL W4 review article"},"kb-template":{"65f5417e-5e53-4db4-9f71-10b849d637ee":"QA GL W4 tpl"},"community-category":{"c857d003-b625-4a8d-b9bd-44500ad30f0a":"QA GL W4 cat"},"community-topic":{"604d7a0c-6e28-44cc-af76-9d68b1576888":"QA GL W4 agent topic","696f86ef-c63f-4914-a911-d28a6580906f":"QA GL W4 topic","94282336-749e-4bfb-991a-4402d09f38cf":"QA GL W4 arabic topic"}};
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
