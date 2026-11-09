// NDC-2711: create a lead on a deleted layout / random layout id → expect 404 "layout not found" or 422 naming the layout (not 403).
const out = {}; const t = String(Date.now()).slice(-5);
const std = (await api('o', 'GET', `/modules/${T.LEADS}/layouts/${T.LEADS_STD}`)).j?.data;
const c = await api('o', 'POST', `/modules/${T.LEADS}/layouts`, { name: 'QA RT 2711 layout ' + t, views: std?.views, assignedProfiles: [], accessMode: 'all_users', status: 'active' });
const lid = c.j?.data?.id; out.createLayout = c.s + ' ' + (lid || c.t.slice(0, 200));
if (lid) { ledger(`layout ${lid} "QA RT 2711 layout ${t}" (Leads) — deleted in the same script`); out.deleteLayout = (await api('o', 'DELETE', `/modules/${T.LEADS}/layouts/${lid}`)).s; }
const body = layout => ({ layout_id: layout, data: [['first_name', 'QA RT 2711'], ['last_name', 'QA RT 2711'], ['phone', '0100002711' + t.slice(-1)]].map(([f, v]) => ({ field: f, value: { kind: 'string', value: v } })) });
const tryAs = async (who, layout) => { const r = await api(who, 'POST', `/modules/${T.LEADS}/records`, body(layout)); if (r.j?.data?.id) ledger(`lead ${r.j.data.id} "QA RT 2711" by ${who} (unexpected create)`); return r.s + ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 140); };
if (lid) { out.deletedLayoutAsU1 = await tryAs('u1', lid); out.deletedLayoutAsOwner = await tryAs('o', lid); }
out.randomLayoutAsU1 = await tryAs('u1', '0f0f0f0f-1111-4222-8333-444444444444');
const ctl = await api('u1', 'POST', `/modules/${T.LEADS}/records`, body(T.LEADS_STD)); out.controlLiveLayout = ctl.s; if (ctl.j?.data?.id) ledger(`lead ${ctl.j.data.id} "QA RT 2711" by u1 (control)`);
return out;
