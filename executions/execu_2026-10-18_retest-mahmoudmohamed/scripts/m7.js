await go('/workqueue', 12000); await page.getByRole('button', { name: 'Arrange queues' }).click(); await sleep(1500);
const r = []; for (const e of await page.locator('[role=dialog]').last().locator('input[type=radio], [role=radio]').all()) r.push(await e.isChecked());
await page.locator('[role=dialog]').last().getByRole('button', { name: 'Cancel' }).click();
return done({ groupedChecked: r[0], listChecked: r[1] });
