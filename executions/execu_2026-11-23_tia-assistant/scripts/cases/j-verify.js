const M = { leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', contacts:'6f553963-01d6-4b68-9fb3-143d23044c41' };
const flat = x => { const o = {}; for (const f of (x?.data || [])) o[f.field] = f.value?.value ?? f.value; return o; };
const l1 = flat((await api('GET', `/modules/${M.leads}/records/${CRMIDS['QA TIA Lead 1']}`)).j?.data);
const rows = arr((await api('GET', `/modules/${M.leads}/records?page=1&page_size=100`)).j?.data).map(x => ({ id: x.id, ...flat(x) }));
const j01 = rows.find(o => o.last_name === 'J01');
if (j01) ledger(`CRM lead "QA TIA J01" ${j01.id} (J-02, via Tia)`);
const notes = await api('GET', `/modules/${M.contacts}/records/${CRMIDS['QA TIA Contact A']}/notes`);
return { lead1: { name: l1.name, first: l1.first_name, last: l1.last_name, src: l1.lead_source }, j01: j01 && { id: j01.id, name: j01.name, company: j01.company, email: j01.email, owner: j01.owner, created_by: j01.created_by }, notes: notes.s + ' ' + JSON.stringify(arr(notes.j?.data).map(n => (n.content || n.body || n.text || '').slice(0, 40) + '|' + (n.created_by_name || n.createdByName || n.created_by))).slice(0, 300) };
