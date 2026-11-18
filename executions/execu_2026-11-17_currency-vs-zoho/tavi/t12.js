const L = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/tavi/ledger.md', '- ' + m + '\n');
const out = {};
const p = (await api('GET', '/iam/tenant/company-profile')).j.data;
const body = { name: p.name, alias: p.alias, description: p.description, access_url: p.access_url, phone: p.phone, email: p.email, fax: p.fax, website: p.website, employee_count: p.employee_count, address: p.address, time_zone: p.time_zone, currency: 'AED', primary_contact_user_id: p.primary_contact && p.primary_contact.user_id };
const u = await api('PUT', '/iam/tenant/company-profile', body); out.put = [u.s, u.j && u.j.error ? u.j.error.message : u.j.data.currency];
if (u.s < 300) L('company profile currency EGP -> AED (revert to EGP)');
out.profileAfter = (await api('GET', '/iam/tenant/company-profile')).j.data.currency;
const c = (await api('GET', '/currencies')).j.data; out.currenciesHome = c.home_currency; out.status = c.home_currency_status;
// revert
const r = await api('PUT', '/iam/tenant/company-profile', { ...body, currency: 'EGP' }); out.revert = [r.s, r.j && r.j.data && r.j.data.currency];
if (r.s < 300) L('company profile currency reverted to EGP');
out.finalHome = (await api('GET', '/currencies')).j.data.home_currency;
return out;
