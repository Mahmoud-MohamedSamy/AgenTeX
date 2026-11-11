const fs=require('fs');
module.exports = async ({ page, api, log, RUN }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil:'domcontentloaded' }); await page.waitForTimeout(15000);
  const L = p => fs.appendFileSync(RUN+'/ledger-zoho-crm.md', `- ${new Date().toISOString()} ${p}\n`); const S={};
  const c = await api('POST', '/crm/v8/settings/global_picklists', { global_picklists: [{ display_label: 'QA RT15 GS Colors', pick_list_values: [{ display_value: 'Red', actual_value: 'Red' }, { display_value: 'Green', actual_value: 'Green' }, { display_value: 'Blue', actual_value: 'Blue' }] }] });
  log('create gs', c.status, c.body.slice(0,300)); S.gs = (JSON.parse(c.body).global_picklists||[])[0]?.details?.id; if (S.gs) L(`global set "QA RT15 GS Colors" ${S.gs}`);
  const f = await api('POST', '/crm/v8/settings/fields?module=Leads', { fields: [{ field_label: 'QA RT15 GS Color', data_type: 'picklist', global_picklist: { id: S.gs } }] });
  log('create field', f.status, f.body.slice(0,400)); S.field = (JSON.parse(f.body).fields||[])[0]?.details?.id; if (S.field) L(`Leads field "QA RT15 GS Color" ${S.field}`);
  fs.writeFileSync(RUN+'/out/zoho-2806.json', JSON.stringify(S));
};
