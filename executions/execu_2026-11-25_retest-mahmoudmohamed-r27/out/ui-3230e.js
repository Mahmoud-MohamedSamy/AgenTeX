const o = { req: [] };
page.on('request', r => { if (/\/workflow\/rules\/8c218015-630e-4f71-bc81-d902029863db/.test(r.url()) && ['PUT', 'PATCH', 'POST'].includes(r.method())) { const b = r.postData() || ''; let j = {}; try { j = JSON.parse(b); } catch (e) {} o.req.push(r.method() + ' criteria=' + ('criteria' in j ? JSON.stringify(j.criteria).slice(0, 80) : 'ABSENT')); } });
try {
await page.goto(H + '/settings/automation/workflow-rules/8c218015-630e-4f71-bc81-d902029863db', { waitUntil: 'commit' }); await page.getByText(/Subject.{0,3} starts with/).first().waitFor({ timeout: 120000 }); await sleep(2500);
await page.getByText(/Subject.{0,3} starts with/).first().click(); await sleep(1500);
const rm = page.getByRole('button', { name: 'Remove condition' }).first(); await rm.click({ timeout: 15000 }); await sleep(1000);
o.afterRemove = ((await text()).match(/(No conditions[^\n]{0,140}|All Tickets[^\n]{0,40})/) || [null])[0];
const done = page.getByRole('button', { name: 'Done', exact: true }); if (await done.count()) await done.first().click().catch(() => {}); await sleep(1000);
await shot('3230-editor-condition-removed');
await page.getByRole('button', { name: 'Save', exact: true }).first().click(); await sleep(5000); o.urlAfterSave = page.url().replace(H, '');
await page.goto(H + '/settings/automation/workflow-rules/8c218015-630e-4f71-bc81-d902029863db', { waitUntil: 'commit' }); await page.getByText('QA RT27 3230').first().waitFor({ timeout: 120000 }); await sleep(3000);
o.reopened = ((await text()).match(/(No conditions[^\n]{0,140}|Subject starts with[^\n]{0,40})/) || [null])[0]; await shot('3230-editor-reopened');
} catch (e) { o.err = String(e).slice(0, 200); }
return o;
