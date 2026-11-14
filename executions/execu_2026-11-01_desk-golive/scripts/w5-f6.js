await go('/team-feeds/' + MK + '/mentions', 12000); out.mentions = (await mtxt()).slice(0, 500); await shot('w5/W5-32-B-mentions');
await go('/team-feeds/messages/6d9b6292-ca12-449c-b794-9522c60f79ec', 10000); out.dm = (await mtxt()).slice(0, 400); await shot('w5/W5-32-B-dm');
await page.getByRole('button', { name: 'Notifications' }).click(); await sleep(2500); out.notif = (await page.locator('[role=dialog], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w5/W5-32-B-notif'); await page.keyboard.press('Escape');
return fin({ out });
