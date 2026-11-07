const o = {}; const reqs = [];
page.on('request', r => { if (['PUT', 'PATCH', 'POST'].includes(r.method()) && /layouts|fields/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^.*api\/v1/, '') + ' ' + (r.postData() || '').length); });
// FLY-WT Refund create form: does it mark TKT number required and refuse an empty one?
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=238085b7-78da-4805-8fb6-6063855256f0', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
const row = lbl => page.locator(`xpath=//*[normalize-space(text())="${lbl}"]/ancestor::*[self::div][2]`).first();
o.flyLayout = await page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::select[1]').first().evaluate(x => x.selectedOptions[0]?.text);
o.flyTktLabel = (await page.locator('xpath=//*[contains(normalize-space(.),"QA NDC TKT number") and not(*)]/..').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('2791-a-fly-form.png', { fullPage: true });
o.edit = await page.getByText('Edit Page Layout').first().getAttribute('href').catch(() => null);
await page.getByText('Edit Page Layout').first().click(); await sleep(8000); o.editUrl = page.url();
await shot('2791-b-editor.png');
o.editorText = (await text()).slice(0, 1500);
o.reqs = reqs;
return o;
