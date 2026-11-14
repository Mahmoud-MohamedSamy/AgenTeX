const r = await api('POST', '/modules/' + PM + '/records', { data: [{ field: 'product_name', value: sv('QA GL W5 Product') }, { field: 'product_code', value: sv('QA-GL-W5') }, { field: 'departments', value: sv(MK) }] });
out.create = r.s + ' ' + r.t.slice(0, 160); const pid = r.j && r.j.data && r.j.data.id; if (pid) CREATED.push({ kind: 'product', id: pid, name: 'QA GL W5 Product', mod: PM }); out.pid = pid;
const TM = '88e8ea44-1658-4df3-9930-d0902b91073d', T = 'f64e2ab2-83ae-4ec8-9441-ee94d302d8bd';
const tr = await api('GET', '/modules/' + TM + '/records/' + T); out.tfields = (D(tr.j).data || []).map(d => d.field).join(',');
for (const f of ['product_id', 'product']) { const up = await api('PATCH', '/modules/' + TM + '/records/' + T, { data: [{ field: f, value: sv(pid) }] }); out['link_' + f] = up.s + ' ' + up.t.slice(0, 160); if (up.s < 300) break; }
await go('/tickets/' + T, 12000); out.ticketShows = (await mtxt()).includes('QA GL W5 Product'); await shot('w5/W5-60-ticket-product');
await go('/settings/organization/products', 10000); out.listed = (await mtxt()).includes('QA GL W5 Product');
return fin({ out });
