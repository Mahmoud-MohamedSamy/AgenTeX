const fs=require('fs');
module.exports = async ({ page, api, log, RUN }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'domcontentloaded' }); await page.waitForTimeout(15000);
  const L = p => fs.appendFileSync(RUN+'/ledger-zoho-crm.md', `- ${new Date().toISOString()} ${p}\n`); const S=JSON.parse(fs.readFileSync(RUN+'/out/zoho-2806.json'));
  const f = await api('GET', '/crm/v8/settings/fields/'+S.field+'?module=Leads'); const fj = JSON.parse(f.body).fields[0]; S.api = fj.api_name; log('field', S.api, fj.pick_list_values.map(v=>v.display_value+':'+v.id).join(' '));
  S.vals = Object.fromEntries(fj.pick_list_values.map(v=>[v.display_value, v.id]));
  const g = await api('GET', '/crm/v8/settings/global_picklists/'+S.gs); const gj=JSON.parse(g.body).global_picklists[0]; S.gvals = Object.fromEntries((gj.pick_list_values||[]).map(v=>[v.display_value,v.id])); log('gs vals', S.gvals);
  const r = await api('POST', '/crm/v8/Leads', { data: [{ Last_Name: 'QA RT15 2806 green lead', Company: 'QA RT15', [S.api]: 'Green' }] }); S.lead = JSON.parse(r.body).data?.[0]?.details?.id; log('lead', r.status, S.lead); if (S.lead) L(`Lead "QA RT15 2806 green lead" ${S.lead}`);
  const cv = await api('POST', '/crm/v8/settings/custom_views?module=Leads', { custom_views: [{ name: 'QA RT15 2806 Green view', fields: [{ api_name: 'Last_Name' }, { api_name: S.api }], criteria: { field: { api_name: S.api }, comparator: 'equal', value: ['Green'] } }] });
  log('cv', cv.status, cv.body.slice(0,300)); S.cv = JSON.parse(cv.body).custom_views?.[0]?.details?.id; if (S.cv) L(`Leads custom view "QA RT15 2806 Green view" ${S.cv}`);
  fs.writeFileSync(RUN+'/out/zoho-2806.json', JSON.stringify(S));
};
