// NDC-2406 on Anyware: QA contact created in DESK → linked CRM contact appears (Desk → CRM sync works) → delete the CRM contact
// (on_crm_delete = delete) → the Desk contact must be in the Desk recycle bin and restorable.
const out = {}; const DC = '0bbb599e-013b-4465-a41e-85a324a4e3ac'; const t = String(Date.now()).slice(-5); const em = `qa.rt.2406.${t}@example.com`;
const lay = arr((await api('o', 'GET', `desk:/modules/${DC}/layouts`)).j?.data)[0]?.id; out.deskLayout = lay;
const enc = v => ({ kind: 'string', value: String(v) });
const d = await api('o', 'POST', `desk:/modules/${DC}/records`, { layout_id: lay, data: [['first_name', 'QA RT'], ['last_name', '2406 desk ' + t], ['email', em]].map(([f, v]) => ({ field: f, value: enc(v) })) });
const did = d.j?.data?.id; out.deskContact = d.s + ' ' + (did || d.t.slice(0, 250)); if (!did) return out; ledger(`Desk contact ${did} "QA RT 2406 desk ${t}" (${em})`);
let link = null; for (let i = 0; i < 36 && !link; i++) { await sleep(5000); for (let p = 1; p <= 10 && !link; p++) { const l = arr((await api('o', 'GET', `desk:/desk/integrations/crm/links?kind=contact&page_size=200&page=${p}`)).j?.data); link = l.find(x => x.desk_record_id === did); if (l.length < 100) break; } }
out.linkedAfterSec = link ? 'yes' : 'no link after 180 s'; if (!link) return out;
const cid = link.crm_record_id; out.crmContact = cid; ledger(`CRM contact ${cid} (partner of Desk contact ${did})`);
out.deleteCrm = (await api('o', 'DELETE', `/modules/${T.CONTACTS}/records/${cid}`)).s;
let gone = false; for (let i = 0; i < 30 && !gone; i++) { const g = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); gone = g.s === 404 || g.j?.data?.is_deleted === true; if (!gone) await sleep(3000); }
const raw = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); out.deskAfterDelete = raw.s + ' is_deleted=' + raw.j?.data?.is_deleted;
let item = null, via = null;
for (let i = 0; i < 10 && !item; i++) {
  for (const p of ['desk:/audit/recycle-bin/items?limit=200&app_key=desk', '/audit/recycle-bin/items?limit=200&app_key=desk']) { const r = await api('o', 'GET', p); const h = arr(r.j?.data).find(x => JSON.stringify(x).includes(did)); if (h) { item = h; via = p; break; } }
  if (!item) await sleep(3000);
}
out.recycleBinItem = item ? JSON.stringify({ label: item.record_label, app: item.app_key, module: item.module_key || item.entity_type }) : null;
out.crmContactInCrmBin = !!arr((await api('o', 'GET', '/audit/recycle-bin/items?limit=200&app_key=crm')).j?.data).find(x => JSON.stringify(x).includes(cid));
if (item) { const rs = await api('o', 'POST', (via.startsWith('desk:') ? 'desk:' : '') + '/audit/recycle-bin/restore', { ids: [item.id] }); out.restore = rs.s;
  let back = false; for (let i = 0; i < 20 && !back; i++) { const g = await api('o', 'GET', `desk:/modules/${DC}/records/${did}`); back = g.s === 200 && g.j?.data?.is_deleted !== true; if (!back) await sleep(3000); } out.deskContactBack = back; }
return out;
