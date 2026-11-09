// NDC-2406: delete a linked CRM contact (on_crm_delete = delete) → Desk contact must be in the Desk recycle bin and restorable.
const out = {}; const DC = '0bbb599e-013b-4465-a41e-85a324a4e3ac', CL = '52b6c355-a083-4be5-8243-5c2e7b5c5f02';
const enc = v => ({ kind: 'string', value: String(v) });
const em = `qa.rt.2406.${Date.now() % 100000}@example.com`;
const c = await api('o', 'POST', `/modules/${T.CONTACTS}/records`, { layout_id: CL, data: [['first_name', 'QA RT'], ['last_name', '2406 contact'], ['email', em]].map(([f, v]) => ({ field: f, value: enc(v) })) });
out.crmContact = c.s + ' ' + (c.j?.data?.id || c.t.slice(0, 300)); const cid = c.j?.data?.id; if (!cid) return out;
ledger(`CRM contact ${cid} "QA RT 2406 contact" (${em})`);
const linkOf = async () => { for (let p = 1; p <= 5; p++) { const l = arr((await api('o', 'GET', `desk:/desk/integrations/crm/links?kind=contact&page_size=200&page=${p}`)).j?.data); const h = l.find(x => JSON.stringify(x).includes(cid)); if (h) return h; if (l.length < 200) break; } return null; };
let link = null; for (let i = 0; i < 30 && !link; i++) { link = await linkOf(); if (!link) await sleep(5000); }
const did = link && (link.desk_id || link.deskId || link.desk_record_id || Object.values(link).find(v => typeof v === 'string' && /^[0-9a-f-]{36}$/.test(v) && v !== cid && v !== link.id));
out.link = JSON.stringify(link).slice(0, 300); out.deskContact = did; if (!did) return out;
ledger(`Desk contact ${did} (partner of CRM contact ${cid})`);
out.deskBefore = (await api('o', 'GET', `desk:/modules/${DC}/records/${did}`)).s;
out.delete = (await api('o', 'DELETE', `/modules/${T.CONTACTS}/records/${cid}`)).s;
let gone = false; for (let i = 0; i < 30 && !gone; i++) { const g = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); gone = g.s === 404 || g.j?.data?.is_deleted === true; if (!gone) await sleep(3000); }
const raw = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); out.deskAfter = raw.s + ' is_deleted=' + raw.j?.data?.is_deleted;
let item = null;
for (let i = 0; i < 10 && !item; i++) {
  for (const p of ['desk:/audit/recycle-bin/items?limit=200&app_key=desk', '/audit/recycle-bin/items?limit=200&app_key=desk']) {
    const r = await api('o', 'GET', p); const items = arr(r.j?.data); const h = items.find(x => JSON.stringify(x).includes(did)); if (h) { item = h; out.binVia = p; break; }
    out['bin ' + p.slice(0, 5)] = r.s + ' n=' + items.length;
  }
  if (!item) await sleep(3000);
}
out.binItem = item ? JSON.stringify({ id: item.id, label: item.record_label, app: item.app_key, module: item.module_key || item.entity_type }).slice(0, 300) : null;
out.crmBin = !!arr((await api('o', 'GET', '/audit/recycle-bin/items?limit=200&app_key=crm')).j?.data).find(x => JSON.stringify(x).includes(cid));
if (item) {
  const rs = await api('o', 'POST', (out.binVia.startsWith('desk:') ? 'desk:' : '') + '/audit/recycle-bin/restore', { ids: [item.id] }); out.restore = rs.s + ' ' + rs.t.slice(0, 200);
  let back = false; for (let i = 0; i < 20 && !back; i++) { const g = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); back = g.s === 200 && g.j?.data?.is_deleted !== true; if (!back) await sleep(3000); }
  out.back = back; if (back) ledger(`Desk contact ${did} restored from the Desk recycle bin (delete at cleanup)`);
}
return out;
