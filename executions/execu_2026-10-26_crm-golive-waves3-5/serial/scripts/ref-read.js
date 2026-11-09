const g = async p => { const r = await call('GET', p); return r.s === 200 ? r.j.data : r.s + ' ' + r.t.slice(0, 200); };
const settings = await g('/iam/integrations/directory-sync/settings');
const runs = await g('/iam/integrations/directory-sync/runs?limit=20');
const mapping = await g('/iam/integrations/directory-sync/mapping-options');
const main = (await page.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ');
const i = main.indexOf('Schedule');
return { settings: JSON.stringify(settings).slice(0, 1200), runs: JSON.stringify(runs).slice(0, 1500), mapping: JSON.stringify(mapping).slice(0, 400), pageTail: main.slice(i, i + 900) };
