const out = { req: [] };
page.on('request', r => { const u = r.url(); if (/scoring/.test(u) && r.method() !== 'GET') out.req.push(r.method() + ' ' + u.replace(/.*\/api\/v1/, '') + ' BODY ' + (r.postData() || '').slice(0, 600)); });
page.on('response', r => { const u = r.url(); if (/scoring/.test(u) && r.request().method() !== 'GET') out.req.push('<- ' + r.status() + ' ' + u.replace(/.*\/api\/v1/, '')); });
await go('/settings/automation/scoring-rules?module=' + MID, 9000);
out.banner = ((await bodyText()).match(/(Last scoring run|Scoring the records)[^)]*\)?/) || [''])[0];
await page.getByRole('button', { name: /New Scoring Rule/ }).first().click(); await sleep(2000);
const dr = page.getByTestId('scoring-rule-drawer');
await dr.locator('input[type=text]').first().fill('QA RT20 SC R6 old ui');
await dr.getByRole('button', { name: 'Field of entry 1' }).click(); await sleep(1000);
const pop = page.locator('[role=listbox], [role=dialog], [data-radix-popper-content-wrapper]').last();
const si = pop.locator('input').first(); if (await si.count()) { await si.fill('Company'); await sleep(800); }
out.fieldOpts = (await page.locator('[role=option]').allInnerTexts()).slice(0, 10);
await page.locator('[role=option]').filter({ hasText: /^Company$/ }).first().click(); await sleep(800);
await dr.getByRole('button', { name: 'Condition of entry 1' }).click(); await sleep(800);
out.condOpts = (await page.locator('[role=option]').allInnerTexts()).slice(0, 20);
await page.locator('[role=option]').filter({ hasText: /^is$/ }).first().click(); await sleep(800);
out.controls = await dr.locator('input').evaluateAll(e => e.map(x => [x.type, x.getAttribute('aria-label') || x.getAttribute('data-testid') || x.placeholder].join(':')));
const val = dr.getByLabel(/Value of entry 1/).first(); if (await val.count()) await val.fill('QA RT20 SC old'); else out.noValueLabel = true;
await dr.getByLabel('Points of entry 1').fill('11');
await dr.getByTestId('scoring-rule-update-existing').check(); await sleep(500);
await shot('1483-7-create-update-existing.png');
await dr.getByRole('button', { name: /^Create$/ }).click(); await sleep(4000);
out.after = ((await bodyText()).match(/(Last scoring run|Scoring the records)[^)]*\)?/) || [''])[0];
out.toast = ((await bodyText()).match(/.{0,80}(created|scor(ing|ed) .{0,40}records).{0,80}/i) || [''])[0];
await shot('1483-8-after-create.png');
for (let i = 0; i < 12; i++) { await sleep(10000); await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(6000); const b = ((await bodyText()).match(/(Last scoring run|Scoring the records)[^)]*\)?/) || [''])[0]; out['poll' + i] = b; if (/Last scoring run/.test(b) && !/11:2/.test(b)) break; }
await shot('1483-9-run-done.png');
return out;
