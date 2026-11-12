const list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates;
out.ack = list.map(x => [x.id.slice(0, 8), x.name, x.department_id ? x.department_id.slice(0, 8) : 'All', x.is_active, x.is_system || x.system || '']);
const base = await api('GET', '/desk/email-templates/0f472a78-e303-4644-9cd7-ef35c013382d'); out.baseKeys = Object.keys(D(base.j) || {}).join(',');
const TK = ['6f9037a0-15b3-4f21-a584-2e21b3b5259e','271150d9-49fd-4de1-a7d8-068b14d3927f','89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23','48326997-5fc4-49c4-8303-ce5c9429bad0','7f2eca8f-d870-4cbf-b555-54d0d2605d29','5ca7d2b3','8283eaa6','4c4ff756','ef64ab85','c3bb4fe3','9050f3a8','0b34176e','c6b24085'];
let items = []; for (const q of ['?limit=200&app=desk', '?limit=200']) { const b = await api('GET', '/audit/recycle-bin/items' + q); items = items.concat(arr(D(b.j))); }
const seen = new Set(); items = items.filter(x => !seen.has(x.id) && seen.add(x.id));
const full = new Set(['6f9037a0-15b3-4f21-a584-2e21b3b5259e','271150d9-49fd-4de1-a7d8-068b14d3927f','89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23','48326997-5fc4-49c4-8303-ce5c9429bad0','7f2eca8f-d870-4cbf-b555-54d0d2605d29']);
const LED = ["c6b24085-19a4-42b5-b127-f52bc2463ef0","0b34176e-c1e5-420d-95c9-a54e125b2c0e","9050f3a8-3280-435a-9ac7-94f1ee016ac1","c3bb4fe3-d192-41e0-b68f-5829250f53fd","ef64ab85-b711-4722-acbf-e79634e388b9","4c4ff756-4b10-420a-8315-2e89fc64ad19","8283eaa6-67b8-42a2-993b-c0d40b29251c","5ca7d2b3-ce79-4cd4-b0ae-d132d70f5746","7f2eca8f-d870-4cbf-b555-54d0d2605d29","48326997-5fc4-49c4-8303-ce5c9429bad0","89a1b22a-6eb7-4f30-ad15-8bdfc9f06d23","271150d9-49fd-4de1-a7d8-068b14d3927f","6f9037a0-15b3-4f21-a584-2e21b3b5259e"];
for (const id of LED) full.add(id);
const pick = items.filter(x => full.has(x.record_id) && x.record_label === 'mmohamed@anyware.software');
out.pick = pick.map(x => x.record_id.slice(0, 8));
if (pick.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) }); out.purge = p.s; }
return fin({ out });
