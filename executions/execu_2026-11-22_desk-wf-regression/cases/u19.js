const out = {}; const clean = s => (s || '').replace(/\s+/g, ' ');
await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000);
if (await page.locator('input[type=password]').locator('visible=true').count()) return { stopped: 'session not valid' };
await page.locator('main tbody tr').first().waitFor({ timeout: 180000 }); await sleep(3000);
await shot('U19-list-top');
out.headerButtons = (await page.locator('main').getByRole('button').allInnerTexts()).map(t => t.trim()).filter(Boolean).slice(0, 15);
out.headerLinks = (await page.locator('main a').allInnerTexts()).map(t => t.trim()).filter(Boolean).slice(0, 15);
out.rows = await page.locator('main tbody tr').count(); out.tabs = clean(await page.locator('main .mf-tabbar').first().innerText().catch(() => ''));
await page.mouse.wheel(0, 30000); await sleep(2000); await shot('U19-list-bottom');
out.pager = clean(await page.locator('main').innerText()).match(/(Page \d+|\d+\s*[-–]\s*\d+ of \d+|Rows per page[^.]{0,40}|Next|Previous|Load more)/gi) || [];
// row menu
await page.mouse.wheel(0, -30000); await sleep(1000);
const kebab = page.locator('main tbody tr').first().locator('button').last(); await kebab.click(); await sleep(1200); await shot('U19-row-menu');
out.rowMenu = (await page.locator('[role=menu] [role=menuitem], [role=menu] button').allInnerTexts()).map(t => t.trim()).filter(Boolean);
await page.keyboard.press('Escape');
// setup menu
out.setupMenuHasExec = (await page.locator('nav, aside').getByText(/Execution History/i).count());
out.automationMenu = clean(await page.locator('aside, nav').filter({ hasText: /AUTOMATION/i }).first().innerText().catch(() => '')).match(/AUTOMATION.{0,300}/i)?.[0];
return out;
