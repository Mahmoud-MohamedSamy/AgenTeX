let alerted = false; page.on('dialog', async d => { alerted = true; await d.dismiss().catch(() => {}); });
// Skills page: XSS skill names rendered as text
await page.goto(H + '/settings/customization/skills', { waitUntil: 'commit' }); await sleep(12000);
const sk = await text(); log('skillsPage', /onerror=alert/.test(sk) ? 'xss name shown as text' : 'xss name not visible', 'alert fired:', alerted, 'imgs with onerror:', await page.locator('img[onerror]').count());
await shot('AR-UI-13-skills.png');
// Notifications tab
await page.goto(H + '/settings/automation/assignment-rules', { waitUntil: 'commit' }); await page.getByText('Direct Assignment').first().waitFor({ timeout: 150000 }); await sleep(3000);
await page.getByText('Notifications', { exact: true }).first().click(); await sleep(3000); const nt = await text(); const ni = nt.indexOf('Notifications', nt.indexOf('Team Assignment')); log('notifTab', nt.slice(ni, ni + 900).replace(/\s+/g, ' ')); await shot('AR-UI-14-notifications.png');
// switches: accessible names
await page.getByText('Rules', { exact: true }).first().click(); await sleep(2500);
const sw = await page.locator('button[role=switch]:visible').evaluateAll(es => es.slice(0, 6).map(e => (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || '(no name)') + '=' + e.getAttribute('aria-checked')));
const drag = await page.locator('[aria-roledescription], button[aria-label*="Move" i], button[aria-label*="drag" i]').count();
log('switchNames', sw.join(' | '), 'reorder controls', drag);
await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); log('focus', await page.evaluate(() => document.activeElement && (document.activeElement.innerText || document.activeElement.getAttribute('aria-label') || document.activeElement.tagName).slice(0, 60)));
// Arabic
const lang = page.getByText(/^EN$/).first(); await lang.click().catch(() => {}); await sleep(1500); await page.getByText(/العربية|Arabic/).first().click().catch(() => {}); await sleep(6000);
const dir = await page.evaluate(() => document.documentElement.dir || getComputedStyle(document.body).direction); const at = await text(); const ai = at.search(/قواعد|التعيين/);
log('arabic dir', dir, 'sample', ai >= 0 ? at.slice(ai, ai + 400).replace(/\s+/g, ' ') : at.slice(0, 200)); await shot('AR-UI-15-arabic.png');
const en = (at.match(/Direct Assignment|Round Robin|New Rule|Assignment Rules/g) || []); log('english left on arabic page', en.length, [...new Set(en)].join(','));
await page.getByText(/^AR$|^ع$/).first().click().catch(() => {}); await sleep(1200); await page.getByText(/English|الإنجليزية/).first().click().catch(() => {}); await sleep(4000);
log('back to', await page.evaluate(() => document.documentElement.dir || 'ltr'));
