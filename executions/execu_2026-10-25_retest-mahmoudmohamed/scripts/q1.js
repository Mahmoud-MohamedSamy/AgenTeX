await go('/workqueue/activities/tasks', 8000);
await page.getByRole('button', { name: 'Add a queue' }).click(); await sleep(2500);
const d1 = (await page.locator('[role=dialog]').allInnerTexts()).join('|').slice(0, 800);
await shot('1837-01-create-queue');
return done({ d1, url: page.url() });
