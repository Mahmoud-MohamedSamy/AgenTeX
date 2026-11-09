const d = page.locator('[role=dialog]').last(); const resp = [];
page.on('response', r => { if (/\/teamspaces\/.*\/modules/.test(r.url()) && r.request().method() === 'POST') resp.push(r.status()); });
await d.locator('#module-label-input').fill('QA RT partners'); await sleep(1200);
const auto = { plural: await d.getByPlaceholder('e.g. Partners', { exact: true }).inputValue(), singular: await d.getByPlaceholder('e.g. Partner', { exact: true }).inputValue(), key: await d.locator('#module-key-input').inputValue() };
await shot('2384-03-filled');
await d.getByRole('button', { name: 'Create', exact: true }).click(); await sleep(5000); await shot('2384-04-after-create');
const toasts = (await txt()).split('\n').filter(l => /created|required|error|already|success/i.test(l)).slice(0, 5);
const m = arr((await api('GET', '/modules')).j?.data).find(x => /qa_rt_partners|qa rt partners/i.test((x.apiName || '') + ' ' + JSON.stringify(x.labels || x.name || '')));
return done({ auto, resp, toasts, module: m ? { id: m.id, api: m.apiName, labels: m.labels || m.name } : null });
