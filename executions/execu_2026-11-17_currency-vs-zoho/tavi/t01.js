const c = await api('GET', '/currencies'); const p = await api('GET', '/iam/tenant/company-profile');
return { cur: c.s, curData: c.j && c.j.data, prof: p.s, profCurrency: p.j && p.j.data && p.j.data.currency };
