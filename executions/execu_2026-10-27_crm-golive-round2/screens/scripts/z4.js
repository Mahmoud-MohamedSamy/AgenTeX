const O = 'https://crm.zoho.com/crm/org943261092';
const ready = (re) => async () => { const t = await page.innerText('body').catch(() => ''); return re.test(t) && !/^\s*Loading/.test(t); };
const screens = [['Home', '/tab/Home/begin', /Hello|Welcome/], ['Leads list', '/tab/Leads', /Lead Name|Total Records|records/i], ['Deals list', '/tab/Potentials', /Deal Name|Total Records|records/i],
  ['Create form (lead)', '/tab/Leads/create', /Lead Information|Lead Owner/], ['Setup', '/settings/index', /Modules and Fields/], ['Reports', '/tab/Reports', /All Reports|Report/], ['Workqueue', '/tab/Workqueue', /Workqueue|My Open/i]];
out.s = [];
for (const [n, p, re] of screens) { const runs = [];
  for (let i = 0; i < 3; i++) { const t0 = Date.now(); await page.goto(O + p, { waitUntil: 'commit', timeout: 60000 }); let ms = -1;
    for (let k = 0; k < 300; k++) { await sleep(100); const t = await page.innerText('body').catch(() => ''); if (re.test(t) && t.length > 300 && !/^\s*Loading/.test(t)) { ms = Date.now() - t0; break; } }
    runs.push(ms); await sleep(1500); }
  out.s.push({ n, runs }); await page.screenshot({ path: RAW + 'z-perf-' + n.replace(/\W+/g, '_') + '.png' }); }
