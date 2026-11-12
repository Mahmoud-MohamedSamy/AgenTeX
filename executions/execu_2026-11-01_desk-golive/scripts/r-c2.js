const o = {};
for (const [k, id] of [['unassigned', 'e4c207d8-cda7-43a1-946d-4d2626759b7e'], ['ownerA', 'f2fa192d-843d-4deb-b967-7383e71e882f'], ['ownerB_3105', 'd09976e5-45fc-460c-b7d5-2e7bd261ecc9'], ['cs_3108', '30bb8716-cd9a-4e0b-8d49-8a2aa67db1d6']]) o[k] = (await api('GET', '/desk/tickets/' + id)).s;
return done(o);
