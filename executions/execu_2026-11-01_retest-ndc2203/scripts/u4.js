// Capture the body the editor sends for a Ticket Event rule; the request is aborted, nothing saved.
const bodies = [];
await page.route('**/api/v1/workflow/rules**', async route => { const q = route.request(); if (q.method() !== 'GET') { bodies.push({ m: q.method(), b: q.postData() }); return route.abort(); } return route.continue(); });
page.on("dialog", d => d.accept().catch(() => {})); await api("GET","/desk/departments");
await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith("workflow-rule-draft")).forEach(k => localStorage.removeItem(k)));
await go("/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d", 12000);
const fresh = page.getByRole("button", { name: "Start fresh" }); if (await fresh.count()) { await fresh.click(); await sleep(1500); }
await page.getByText("This rule will be executed", { exact: false }).first().click(); await sleep(1500);
await page.getByText("A Ticket Event", { exact: true }).click(); await sleep(1000);
for (const e of ['Customer Reply', 'Agent Response', 'Private Thread', 'Comment', 'Happiness Rating']) { await page.getByText(e, { exact: true }).first().click().catch(() => {}); await sleep(700); }
await shot('a4-events-all');
const sub = (await txt()).split('\n').filter(l => /incoming|outgoing|both|good|okay|bad|all ratings|any/i.test(l)).slice(0, 12);
await page.getByRole('button', { name: 'Done', exact: true }).first().click().catch(() => {}); await sleep(1000);
// pick the first action offered: Add comment
const add = page.getByText('Add comment', { exact: true }).first(); if (await add.count()) { await add.click({ force: true }); await sleep(1500); }
await shot('a5-add-comment-form');
const form = (await txt()).split('\n').filter(l => l.trim()).slice(-40);
const tb = page.locator('textarea, [contenteditable=true]').last(); if (await tb.count()) { await tb.fill('QA WF probe comment').catch(() => {}); }
await page.getByRole('button', { name: /^Save/ }).first().click().catch(() => {}); await sleep(3000); await shot('a6-after-save-click');
await page.unroute('**/api/v1/workflow/rules**');
const toast = (await txt()).split('\n').filter(l => /required|error|select|choose|add an action|condition/i.test(l)).slice(0, 8);
return done({ sub, form, bodies, toast });
