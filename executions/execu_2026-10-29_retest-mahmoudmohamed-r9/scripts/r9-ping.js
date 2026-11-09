const t0 = Date.now(); const a = await api('o', 'GET', '/iam/me'); const t1 = Date.now(); const b = await api('o', 'GET', `/modules/${T.LEADS}/records?page=1&per_page=1`); const t2 = Date.now();
return { me: a.s + ' ' + (t1 - t0) + 'ms', records: b.s + ' ' + (t2 - t1) + 'ms' };
