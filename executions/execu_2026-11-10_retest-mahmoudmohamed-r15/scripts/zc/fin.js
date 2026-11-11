module.exports = async ({ page, api, log }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(15000);
  let r = await api('DELETE', '/crm/v8/settings/fields/7687862000000750010?module=Leads'); log('field', r.status, r.body.slice(0, 160));
  r = await api('DELETE', '/crm/v8/settings/recycle_bin?ids=7687862000000750261'); log('bin 0099', r.status, r.body.slice(0, 160));
  r = await api('DELETE', '/crm/v8/settings/recycle_bin?ids=7687862000000750022'); log('bin 2806 lead', r.status, r.body.slice(0, 120));
  const v = await api('GET', '/crm/v8/settings/custom_views?module=Leads'); log('views QA RT15', JSON.parse(v.body).custom_views.filter(x => /QA RT15/.test(x.name)).length);
  const f = await api('GET', '/crm/v8/settings/fields?module=Leads'); log('fields QA RT15', JSON.parse(f.body).fields.filter(x => /QA RT15/.test(x.field_label)).length);
  const g = await api('GET', '/crm/v8/settings/global_picklists'); log('gs QA RT15', JSON.parse(g.body).global_picklists.filter(x => /QA RT15/.test(x.display_label)).length);
  const s = await api('GET', '/crm/v8/Leads/search?word=QA%20RT15'); log('leads QA RT15', s.status, s.body.slice(0, 80));
  let n = 0; for (let pg = 1; pg <= 5; pg++) { const b = await api('GET', '/crm/v8/settings/recycle_bin?per_page=200&page=' + pg); let j; try { j = JSON.parse(b.body); } catch (e) { break; } n += (j.recycle_bin || []).filter(x => /QA RT15/.test(x.display_name)).length; if (!j.info || !j.info.more_records) break; } log('bin QA RT15', n);
};
