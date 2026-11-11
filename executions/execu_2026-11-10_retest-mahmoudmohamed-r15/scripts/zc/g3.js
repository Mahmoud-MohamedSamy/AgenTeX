const fs=require('fs');
module.exports = async ({ page, api, log, RUN }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'domcontentloaded' }); await page.waitForTimeout(15000);
  const L = p => fs.appendFileSync(RUN+'/ledger-zoho-crm.md', `- ${new Date().toISOString()} ${p}\n`); const S=JSON.parse(fs.readFileSync(RUN+'/out/zoho-2806.json'));
  for (const at of ['only_to_me','public']) {
    const cv = await api('POST', '/crm/v8/settings/custom_views?module=Leads', { custom_views: [{ name: 'QA RT15 2806 Green view', access_type: at, fields: [{ api_name: 'Last_Name' }, { api_name: S.api }], criteria: { field: { api_name: S.api }, comparator: 'equal', value: ['Green'] } }] });
    log('cv', at, cv.status, cv.body.slice(0,300)); S.cv = JSON.parse(cv.body).custom_views?.[0]?.details?.id; if (S.cv) { L(`Leads custom view "QA RT15 2806 Green view" ${S.cv}`); break; }
  }
  fs.writeFileSync(RUN+'/out/zoho-2806.json', JSON.stringify(S));
};
