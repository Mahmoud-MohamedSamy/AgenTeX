const cap = []; const onW = r => { const u = r.url(); if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && u.includes('/api/v1/') && !/heartbeat|resolved-batch|presence|\/iam\/auth/.test(u)) cap.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 400)); };
page.on('request', onW);
await go('/settings/organization/departments/new', 7000);
await page.locator('input[type=text]:visible').nth(0).fill('QA MF Dept');
const hc = page.locator('label', { hasText: 'Display in Help Center' }).locator('input[type=checkbox]'); if (await hc.count() && await hc.isChecked()) await hc.uncheck();
const added = [];
for (const q of ['ndc-staging-owner', 'mahmoud.mohamed1']) { const s = page.getByPlaceholder('Search agents by name or email'); await s.fill(q); await sleep(1500); const opt = page.locator('label, li, [role=option], tr', { hasText: q }).filter({ has: page.locator('input[type=checkbox]') }).first(); if (await opt.count()) { await opt.locator('input[type=checkbox]').check().catch(() => {}); added.push(q); } await s.fill(''); await sleep(500); }
const s1 = await shot('dept-filled');
await page.getByRole('button', { name: /Configure Channels/ }).click(); await sleep(3500);
const step2 = (await txt()).replace(/\s+/g, ' '); const btns = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(-8);
const s2 = await shot('dept-step2');
page.off('request', onW);
rec('DEPT.create1', 'INFO', `agents ticked: ${added.join(', ')}; url ${page.url().replace(H, '')}; step-2 buttons [${btns.join(' | ')}]; writes ${cap.join(' || ').slice(0, 700)}; step2 text ${step2.slice(step2.indexOf('New Department'), step2.indexOf('New Department') + 400)}`, { shot: s2 });
return done();
