const M = '6f553963-01d6-4b68-9fb3-143d23044c41'; const nm = 'QA TIA <img src=x onerror=alert(1)> XSS';
const r = await api('POST', `/modules/${M}/records`, { data: [['name', nm], ['first_name', 'QA TIA'], ['last_name', '<img src=x onerror=alert(1)> XSS'], ['email', 'qa.tia.xss@example.com']].map(([field, v]) => ({ field, value: { kind: 'string', value: v } })) });
const id = r.j?.data?.id; if (id) ledger(`CRM contact "${nm}" ${id} (K-16)`);
return { s: r.s, id, err: r.j?.error?.code };
