const CON = '0924eb24-e42a-4eab-8efd-e3428f19e882'; const R = JSON.parse(fs.readFileSync('bs/2841.json', 'utf8')); const o = {};
const s = await api('GET', '/modules/' + CON + '/records?search=' + encodeURIComponent('QA RT20 BS Contract 2841') + '&page_size=50');
o.names = arr(s.j?.data).map(x => (x.data || []).find(z => z.field === 'contract_name')?.value?.value || JSON.stringify(x).match(/QA RT20 BS Contract[^"]*/)?.[0]).filter(Boolean);
for (const k of ['c1id', 'c2id', 'c3id']) { const c = await api('GET', '/desk/sla/contracts/' + R.ids[k] + '/coverage'); o[k] = c.s + ' ' + JSON.stringify(c.j?.data).slice(0, 350); }
const pl = await api('GET', '/desk/sla/support-plans?department_id=6edaf8a3-7e99-4213-bd90-451802d63be6'); o.plansA = arr(pl.j?.data).map(x => x.name + ' c=' + JSON.stringify(x.contract_count ?? x.contracts_count ?? x.contracts));
const plB = await api('GET', '/desk/sla/support-plans?department_id=09b9df1d-2345-44c5-9e4e-6778e219fd7e'); o.plansB = arr(plB.j?.data).map(x => x.name + ' c=' + JSON.stringify(x.contract_count ?? x.contracts_count ?? x.contracts));
return o;
