const sel = page.getByRole('button', { name: /Which open activities to count/ });
await sel.click(); await sleep(800); await page.locator('[role=option], [role=menuitem], [role=listbox] li').filter({ hasText: /^Today & Overdue$/ }).first().click(); await sleep(7000);
const railHtml = await page.locator('nav, aside, section').filter({ hasText: 'My Open Activities' }).first().innerText().catch(() => '');
const taskBtn = await page.locator('button').filter({ hasText: /^Tasks/ }).first().evaluate(e => e.outerHTML.replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 400)).catch(() => 'n/a');
await shot('1819-02-rail-today-overdue');
const api1 = (await api('GET', '/workqueue/activities?module_id=a9d87b62-b704-4c2e-b2d5-1b745d7c2065&bucket=today_and_overdue')).j?.meta?.total_count;
await sel.click(); await sleep(800); await page.locator('[role=option], [role=menuitem], [role=listbox] li').filter({ hasText: /^All open$/ }).first().click(); await sleep(3000);
return done({ rail: railHtml.slice(0, 300), taskBtn, apiTodayOverdue: api1 });
