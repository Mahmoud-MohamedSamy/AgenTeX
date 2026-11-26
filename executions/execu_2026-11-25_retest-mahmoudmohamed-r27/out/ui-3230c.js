const o = { req: [] };
page.on('request', r => { if (/\/workflow\/rules\/8c218015-630e-4f71-bc81-d902029863db/.test(r.url()) && ['PUT', 'PATCH', 'POST'].includes(r.method())) { const b = r.postData() || ''; let j = {}; try { j = JSON.parse(b); } catch (e) {} o.req.push(r.method() + ' keys=' + Object.keys(j).join(',') + ' criteria=' + ('criteria' in j ? JSON.stringify(j.criteria).slice(0, 80) : 'ABSENT')); } });
const openR = async () => { await page.goto(H + '/settings/automation/workflow-rules/8c218015-630e-4f71-bc81-d902029863db', { waitUntil: 'commit' }); await page.getByText('QA RT27 3230').first().waitFor({ timeout: 120000 }); await sleep(4000); };
// A: change only the action value
await openR();
const val = page.getByText('QA NDC Agency code').first().locator('xpath=ancestor::*[.//input][1]').locator('input').last();
o.valBefore = await val.inputValue().catch(() => 'n/a'); await val.fill('A3 editor'); await sleep(500);
await page.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(5000); o.afterA = (await text()).match(/(Saved|Rule saved|updated)[^\n]{0,60}/i)?.[0] || '';
await shot('3230-editor-action-saved');
// B: remove the only condition and save
await openR();
await page.getByRole('button', { name: 'Remove condition' }).first().click(); await sleep(800);
o.afterRemoveText = ((await text()).match(/No conditions[^\n]{0,120}/) || [null])[0];
await shot('3230-editor-condition-removed');
await page.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(5000);
o.afterB = ((await text()).match(/(No conditions[^\n]{0,100}|Saved[^\n]{0,40})/i) || [null])[0];
await openR(); o.reopened = ((await text()).match(/No conditions[^\n]{0,100}/) || ['condition still shown: ' + (await page.getByText('Subject').count())])[0];
await shot('3230-editor-reopened');
return o;
