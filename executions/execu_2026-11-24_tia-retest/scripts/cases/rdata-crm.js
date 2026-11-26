const all = ids(); const out = {};
const find = async (mod, field, v) => arr((await api('GET', `/modules/${M[mod]}/records?page=1&per_page=50&filters=${encodeURIComponent(JSON.stringify([{ field, operator: 'starts_with', value: v }]))}`)).j?.data).map(x => x.id);
const leads = [...new Set([all.lead, ...(await find('leads', 'first_name', 'QA TIA RT')), ...(await find('leads', 'name', 'QA TIA RT'))].filter(Boolean))];
const deals = [...new Set([all.deal, ...(await find('deals', 'deal_name', 'QA TIA RT'))].filter(Boolean))];
out.leads = []; for (const id of leads) out.leads.push((await api('DELETE', `/modules/${M.leads}/records/${id}`)).s);
out.deals = []; for (const id of deals) out.deals.push((await api('DELETE', `/modules/${M.deals}/records/${id}`)).s);
out.leftLeads = (await find('leads', 'first_name', 'QA TIA RT')).length + (await find('leads', 'name', 'QA TIA RT')).length; out.leftDeals = (await find('deals', 'deal_name', 'QA TIA RT')).length;
ledger(`R-01 CRM: deleted leads ${JSON.stringify(out.leads)} deals ${JSON.stringify(out.deals)}`);
return out;
