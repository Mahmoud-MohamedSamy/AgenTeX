// Cleanup: delete only leads whose Last Name starts with "QA RT 2302".
module.exports = async ({ log, api, gotoReady }) => {
  await gotoReady('https://crm.zoho.com/crm/org943261092/tab/Leads', /Create Lead/);
  const r = await api('GET', '/crm/v2.2/Leads/search?criteria=' + encodeURIComponent('(Last_Name:starts_with:QA RT 2302)'));
  const data = r.status === 200 ? JSON.parse(r.body).data : [];
  const ids = data.filter(L => /^QA RT 2302/.test(L.Last_Name)).map(L => L.id);
  log('TO DELETE', data.map(L => L.id + ' ' + L.Last_Name).join(', '));
  if (ids.length) { const d = await api('DELETE', '/crm/v2.2/Leads?ids=' + ids.join(',')); log('DELETE', d.status, d.body.slice(0, 600)); }
  const r2 = await api('GET', '/crm/v2.2/Leads/search?criteria=' + encodeURIComponent('(Last_Name:starts_with:QA RT 2302)'));
  log('AFTER SEARCH', r2.status, r2.body.slice(0, 200));
};
