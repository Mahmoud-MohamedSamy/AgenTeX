const id = '9a4c89b1-4baa-4db5-bf29-f27abb32aa79';
const d1 = await call('POST', `/workflow/rules/${id}/deactivate`); const d2 = await call('DELETE', `/workflow/rules/${id}`);
const g = await call('GET', `/workflow/rules/${id}`);
return { deactivate: d1.s, del: d2.s, getAfter: g.s };
