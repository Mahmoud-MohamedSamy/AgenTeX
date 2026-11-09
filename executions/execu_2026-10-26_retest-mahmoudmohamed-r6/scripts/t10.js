const u = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data); const me = u.find(x => x.email === 'mahmoud.mahamed1515@gmail.com'), v = u.find(x => x.email === 'valafo4080@94an.com');
return done({ myOU: me?.orgUnitId, u2OU: v?.orgUnitId, ous: arr((await api('GET', '/iam/org-units')).j?.data).map(o => (o.id || o.orgUnitId) + ' ' + o.name).slice(0, 12) });
