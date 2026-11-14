const cs = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
for (const p of ['/desk/tickets?limit=1&department_id=' + cs, '/desk/tickets?limit=1&department_id=' + cs + '&status=Open', '/reporting/reports?limit=50', '/desk/views?module=tickets']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 350); }
return fin({ out });
