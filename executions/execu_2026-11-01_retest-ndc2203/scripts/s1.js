// A4: Private Thread options in the editor; capture the body for "Incoming" (request aborted, nothing saved).
const bodies = [];
await page.route('**/api/v1/workflow/rules**', async route => { const q = route.request(); if (q.method() !== 'GET') { bodies.push({ m: q.method(), b: q.postData() }); return route.abort(); } return route.continue(); });
page.on("dialog", d => d.accept().catch(() => {})); await api("GET","/desk/departments");
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("workflow-rule-draft")).forEach(k => localStorage.removeItem(k)));
await go("/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d", 12000);
const fresh = page.getByRole("button", { name: "Start fresh" }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
await page.getByText("This rule will be executed", { exact: false }).first().click(); await sleep(1500);
await page.getByText("A Ticket Event", { exact: true }).click(); await sleep(1000);
await page.getByText('Private Thread', { exact: true }).first().click(); await sleep(1200);
await shot('a4-private-thread-options');
const lines = (await txt()).split('\n').filter(l => /incoming|outgoing|both|private thread/i.test(l)).slice(0, 12);
const inc = page.getByText(/^Incoming$/).first(); const hasInc = await inc.count(); if (hasInc) { await inc.click(); await sleep(800); await shot('a4-incoming-selected'); }
await page.getByRole('button', { name: 'Done', exact: true }).first().click().catch(() => {}); await sleep(1000);
const add = page.getByText('Add comment', { exact: true }).first(); if (await add.count()) { await add.click({ force: true }); await sleep(1500); }
const tb = page.locator('textarea, [contenteditable=true]').last(); if (await tb.count()) await tb.fill('QA WF probe').catch(() => {});
await page.getByRole('button', { name: /^Save/ }).first().click().catch(() => {}); await sleep(3000);
await page.unroute('**/api/v1/workflow/rules**');
return done({ lines, hasInc, trig: bodies.map(b => { try { return JSON.parse(b.b).trigger; } catch (e) { return b.b?.slice(0, 300); } }) });
