const d = page.locator('[role=dialog]').last();
await d.locator('input').nth(0).fill('QA RT partners'); await sleep(600);
let body = null; const f = r => { if (r.method() === 'POST' && /teamspaces\/.*\/modules/.test(r.url())) body = r.postData(); }; page.on('request', f);
await d.getByRole('button', { name: 'Create' }).click(); await sleep(3000); page.off('request', f);
const b = JSON.parse(body);
const r = await api('POST', '/teamspaces/5ea90671-4df5-4642-939d-49494f8e4d6e/modules', { ...b, pluralForm: 'QA RT partners', singularForm: b.singularForm || 'QA RT partner' });
await d.getByRole('button', { name: 'Cancel' }).click().catch(() => {}); await sleep(800);
return done({ uiBody: body, api: r.s + ' ' + r.t.slice(0, 600) });
