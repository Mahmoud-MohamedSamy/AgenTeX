// Cleanup of my QA RT15 objects in org944965048 (only ids from out/zoho-2806.json, out/zoho-2807.json and any extra ids in out/zoho-extra.json).
const fs = require('fs');
module.exports = async ({ page, api, log, RUN }) => {
  const L = p => fs.appendFileSync(RUN + '/ledger-zoho-crm.md', `- ${new Date().toISOString()} CLEANUP ${p}\n`);
  const A = JSON.parse(fs.readFileSync(RUN + '/out/zoho-2806.json')); const B = JSON.parse(fs.readFileSync(RUN + '/out/zoho-2807.json'));
  const X = fs.existsSync(RUN + '/out/zoho-extra.json') ? JSON.parse(fs.readFileSync(RUN + '/out/zoho-extra.json')) : { leads: [], views: [] };
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Home/begin', { waitUntil: 'commit', timeout: 90000 }).catch(() => {}); await page.waitForTimeout(20000); log('csr', /crmcsr=/.test(await page.evaluate(() => document.cookie)));
  for (const v of [A.cv, B.cv, ...(X.views || [])].filter(Boolean)) { const r = await api('DELETE', `/crm/v8/settings/custom_views/${v}?module=Leads`); log('view', v, r.status, r.body.slice(0, 120)); L(`view ${v} → ${r.status}`); }
  const leads = [A.lead, ...B.ids, ...(X.leads || [])].filter(Boolean); let ok = 0;
  for (let i = 0; i < leads.length; i += 100) { const r = await api('DELETE', `/crm/v8/Leads?ids=${leads.slice(i, i + 100).join(',')}&wf_trigger=false`); const d = JSON.parse(r.body).data || []; ok += d.filter(x => x.status === 'success').length; log('leads batch', r.status, d.length); }
  L(`leads deleted ${ok}/${leads.length}`);
  const f = await api('DELETE', `/crm/v8/settings/fields/${A.field}?module=Leads`); log('field', f.status, f.body.slice(0, 200)); L(`field ${A.field} → ${f.status}`);
  const g = await api('DELETE', `/crm/v8/settings/global_picklists/${A.gs}`); log('gs', g.status, g.body.slice(0, 200)); L(`global set ${A.gs} → ${g.status}`);
  // recycle bin: purge only my lead ids
  const rb = await api('GET', '/crm/v8/settings/recycle_bin?per_page=200'); log('rb list', rb.status, rb.body.slice(0, 300));
  let mine = []; try { mine = (JSON.parse(rb.body).recycle_bin || []).filter(x => leads.includes(String(x.id)) || /^QA RT15 /.test(x.display_name || '')).map(x => x.id); } catch (e) {}
  log('rb mine', mine.length);
  for (let i = 0; i < mine.length; i += 100) { const r = await api('DELETE', `/crm/v8/settings/recycle_bin?ids=${mine.slice(i, i + 100).join(',')}`); log('rb purge', r.status, r.body.slice(0, 160)); }
  L(`recycle bin purge of my items: ${mine.length} ids`);
  const g2 = await api('GET', '/crm/v8/settings/global_picklists'); log('gs left', (JSON.parse(g2.body).global_picklists || []).map(x => x.display_label).join(', '));
  const c = await api('GET', '/crm/v8/Leads/search?criteria=(Company:equals:QA RT15 2807)'); log('2807 leads left', c.status, c.body.slice(0, 100));
};
