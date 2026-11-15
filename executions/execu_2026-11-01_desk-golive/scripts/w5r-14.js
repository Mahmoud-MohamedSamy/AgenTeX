await sleep(20000);
out.dlgOpen = await page.locator('[role=dialog]').count(); out.dlg = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
out.toast = (await page.locator('[role=status],[data-sonner-toast],[role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300);
await shot('w5r/W5-08-after-30s');
await page.keyboard.press('Escape');
await go('/settings/channels/help-center/users', 10000); out.users = (await mtxt()).slice(0, 1200);
return fin({ out });
