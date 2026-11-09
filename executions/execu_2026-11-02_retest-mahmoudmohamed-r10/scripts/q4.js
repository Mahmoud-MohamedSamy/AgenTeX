const id='d8746d4e-923b-45a7-abbb-e826e9e0cf40', p='415bba11-491d-4951-b07b-e386f473e486'; const o={};
for (const u of [`/record-portals/${p}/access/${id}`,`/record-portals/${p}/records/${id}/access`,`/record-portals/${p}/accesses?record_id=${id}`,`/record-portals/${p}/users`,`/modules/${T.LEADS}/records/${id}/portal-access`,`/record-portals/access?module_id=${T.LEADS}&record_id=${id}`,`/record-portals/${p}/members`]) { const r=await api('o','GET',u); o[u.replace(id,'{rec}').replace(p,'{p}')]=r.s+' '+r.t.slice(0,250); }
return o;
