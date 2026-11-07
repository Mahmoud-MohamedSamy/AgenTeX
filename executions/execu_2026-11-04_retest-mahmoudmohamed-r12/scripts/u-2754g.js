const o = {}; const posts = [];
page.on('request', r => { if (r.method() === 'POST' && /blueprint-transitions|owners/.test(r.url())) posts.push(r.url().replace(/^.*api\/v1/, '') + ' ' + (r.postData() || '').slice(0, 700)); });
page.on('response', async r => { if (r.request().method() === 'POST' && /blueprint-transitions|owners/.test(r.url())) posts.push('→ ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/views/all/tickets/f50e00dc-3f08-4d01-8a41-6e81f2db9fdd', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2754F t4 share/.test(await text()) && /QA alt/.test(await text())) break; } await sleep(4000);
await shot('2754-k-ticket-buttons.png');
o.buttons = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(s => /^QA (alt|go|hold|rate)$/.test(s));
o.assignOwners = await page.getByText(/Assign owners/i).count();
await page.getByRole('button', { name: 'QA alt', exact: true }).first().click(); await sleep(4000);
await page.getByRole('button', { name: 'Add department' }).first().click(); await sleep(2000);
const cd = page.getByText('Choose a department').first(); await cd.click(); await sleep(1500); o.opts = (await page.getByRole('option').allInnerTexts()).slice(0, 8);
const op = page.getByRole('option', { name: 'QA RT11 Dept B' }); if (await op.count()) await op.first().click(); else { await page.keyboard.type('QA RT11 Dept B'); await sleep(1500); await page.keyboard.press('Enter'); }
await sleep(2000); await shot('2754-m-share-filled.png'); o.formNow = (await page.locator('xpath=//*[normalize-space(text())="Shared with"]/ancestor::*[self::div][3]').first().innerText().catch(() => '')).slice(0, 500);
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(6000); await shot('2754-n-share-run.png');
o.posts = posts; return o;
