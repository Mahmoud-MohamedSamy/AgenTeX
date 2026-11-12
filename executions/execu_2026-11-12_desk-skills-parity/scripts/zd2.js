const r = await z('GET', `/workflows?module=tickets&departmentId=${DEPT}`); return [r.s, r.t.slice(0, 1200)];
