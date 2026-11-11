module.exports = async ({ page, api, gotoReady, log }) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(15000);
  const v = await api('GET', '/crm/v8/settings/custom_views?module=Leads'); let names = []; try { names = JSON.parse(v.body).custom_views.filter(x => /QA RT15/.test(x.name)).map(x => x.name + ' ' + x.id); } catch (e) { names = ['parse ' + v.status]; } log('views', v.status, names);
  const g = await api('GET', '/crm/v8/settings/global_picklists'); let gs = []; try { gs = JSON.parse(g.body).global_picklists.map(x => x.display_label); } catch (e) { gs = ['parse ' + g.status]; } log('global sets', g.status, gs);
  const f = await api('GET', '/crm/v8/settings/fields/7687862000000750010?module=Leads'); log('field', f.status);
  const r = await api('GET', '/crm/v8/settings/recycle_bin?per_page=200'); let rb = []; try { rb = (JSON.parse(r.body).recycle_bin || []).filter(x => /QA RT15/.test(x.display_name)).map(x => x.display_name + ' ' + x.id); } catch (e) { rb = ['parse ' + r.status]; } log('bin QA RT15', r.status, rb);
};
