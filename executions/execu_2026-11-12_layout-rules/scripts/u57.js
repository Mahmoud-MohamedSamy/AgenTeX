async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const mods = JSON.parse((await api('GET', '/modules')).t || '{}'); R.modsN = (mods.data || []).length; const list = (mods.data || []).map(m => [m.id, m.moduleKey, (m.labels && (m.labels.en || m.labels.plural)) || m.name]);
  R.mods = list.map(x => x[1]).join(',');
  // B11 + B1: open layout rules on a few other modules
  const pickM = ['customers', 'transactions', 'tasks', 'agency_code'].map(k => list.find(x => x[1] === k)).filter(Boolean);
  R.B11 = {};
  for (const m of pickM) { await page.goto(HOST + '/settings/modules-and-fields/' + m[0] + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000); const t = await bodyText(); const i = t.indexOf('Layout Rules Show'); R.B11[m[1]] = (i < 0 ? t.slice(t.indexOf('Summary'), t.indexOf('Summary') + 200) : t.slice(i, i + 300)).slice(0, 300); }
  await shot('crm-B1');
  // B9: block GET
  await page.route('**/layout-rules*', r => r.request().method() === 'GET' ? r.abort() : r.continue());
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); const t9 = await bodyText(); const k = t9.indexOf('Layout Rules Show'); R.B9 = t9.slice(k, k + 400); await shot('crm-B9'); await page.unroute('**/layout-rules*');
  return R; }
