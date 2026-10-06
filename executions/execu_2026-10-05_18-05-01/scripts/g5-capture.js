// Group 5 setup — add one Single Line field through the builder and capture the save requests (QA module only).
const QA = arr((await api('GET', '/modules')).j.data).find(m => m.moduleKey === 'desk_qa_mf_assets');
const DEF = arr((await api('GET', `/modules/${QA.id}/layouts`)).j.data).find(x => x.isDefault);
const cap = [];
const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/modules/')) cap.push({ m: r.method(), u: r.url().replace(API, ''), b: (r.postData() || '').slice(0, 4000) }); };
page.on('request', onW);
await go(`/settings/modules-and-fields/${QA.id}/layouts/${DEF.id}`, 10000);
const left0 = ((await txt()).match(/Custom Fields Left: (\d+)/) || [])[1];
const pal = await page.locator('[aria-label^="Drag or click to add"], [title^="Drag or click to add"]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.title).replace('Drag or click to add ', '')));
const sysOnly = await page.locator('[title$="— system only"]').evaluateAll(es => es.map(e => e.title));
await page.locator('[aria-label="Drag or click to add Single Line"], [title="Drag or click to add Single Line"]').first().click(); await sleep(1200);
const left1 = ((await txt()).match(/Custom Fields Left: (\d+)/) || [])[1];
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(5000);
page.off('request', onW);
const f = arr((await api('GET', `/modules/${QA.id}/fields`)).j.data).filter(x => x.isCustomField);
page.off('request', onReq);
return JSON.stringify({ left0, left1, palette: pal, sysOnly, customFields: f.map(x => `${x.labels.en}|${x.fieldName}|${x.datatypeKey}|${x.id}`), requests: cap });
