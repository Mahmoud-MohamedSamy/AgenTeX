await page.goto(H + '/settings/automation/assignment-rules', { waitUntil: 'commit' }); await page.getByText('Direct Assignment').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.mouse.click(1066, 28); await sleep(1500); const langOpts = (await page.locator('[role=menuitem]:visible, [role=option]:visible, [role=menuitemradio]:visible').allInnerTexts().catch(() => [])).map(s => s.trim()); log('langOpts', langOpts.join(' | '));
const ar = page.locator('[role=menuitem]:visible, [role=option]:visible, [role=menuitemradio]:visible').filter({ hasText: /العربية|Arabic|AR/ }).first(); await ar.click().catch(() => {}); await sleep(8000);
const dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction); const main = await page.locator('main').innerText().catch(() => '');
const eng = (main.match(/\b(Direct Assignment|Round Robin|New Rule|Assignment Rules|Team Assignment|Notifications|On Ticket Create|Target 1|Coming to)\b/g) || []);
log('arabic', 'dir=' + dir, 'english words left:', eng.length, [...new Set(eng)].join(','), 'sample:', main.slice(0, 300).replace(/\s+/g, ' ')); await shot('AR-UI-15-arabic.png');
await page.mouse.click(1600 - 1066, 28); await sleep(1500); const en = page.locator('[role=menuitem]:visible, [role=option]:visible, [role=menuitemradio]:visible').filter({ hasText: /English|EN|الإنجليزية/ }).first(); await en.click().catch(() => {}); await sleep(5000);
log('restored', await page.evaluate(() => document.documentElement.dir || 'ltr'));
// NDC-2813 New Ticket form owner
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit' }); await sleep(10000);
await page.locator('header button').filter({ hasText: '' }).first(); await page.mouse.click(965, 28); await sleep(5000);
const form = await text(); const oi = form.search(/Ticket Owner/); log('newTicketOwnerField', oi >= 0 ? form.slice(oi, oi + 120).replace(/\s+/g, ' ') : 'owner field not found'); await shot('AR-UI-16-new-ticket.png');
