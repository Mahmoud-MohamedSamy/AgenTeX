await go('/settings/developer/custom-actions', 10000);
await page.getByRole('button', { name: 'Actions for QA GL W3 echo', exact: true }).click(); await sleep(1200); await page.getByRole('menuitem', { name: /^Access/ }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); await d.getByText(/Only selected/).first().click(); await sleep(1200);
await d.getByRole('textbox', { name: 'Search Profiles' }).fill('Owner'); await sleep(1200);
const lab = d.locator('label').filter({ hasText: /^\s*Owner\s*$/ }).first(); if (await lab.count()) await lab.click(); else await d.getByText('Owner', { exact: true }).first().click(); await sleep(800);
await shot('w3/W3-18-owner-only'); await d.getByRole('button', { name: 'Save access' }).click(); await sleep(3000);
out.toast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
out.access = JSON.stringify(D((await api('GET', '/workflow/custom-actions/c0e196f8-7ad6-4978-a910-7ae0bf8513ca')).j).access);
return fin({ out });
