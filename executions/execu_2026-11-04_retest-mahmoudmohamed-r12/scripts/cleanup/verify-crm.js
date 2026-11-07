const o = {}; const re = /QA RT1[12]/;
for (const [k, m] of [['leads', '841043e1-c078-41f9-8d6e-dfd61bee45c3'], ['deals', 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430']]) o['views_' + k] = arr((await api('o', 'GET', `/modules/${m}/views`)).j?.data?.views).filter(x => re.test(x.name)).length;
o.invited = arr((await api('o', 'GET', '/iam/users?status=invited')).j?.data).filter(z => /qa\.rt1/.test(z.email)).length;
o.binQA = arr((await api('o', 'GET', '/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=mail&app_key=workflow&limit=200')).j?.data).filter(x => /^QA RT1[12]/.test(x.record_label || '')).length;
o.lead359 = (await api('o', 'GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/359519af-9468-4c18-b715-d9b46c93e2b9')).s;
return o;
