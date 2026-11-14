await go('/settings/organize-tabs', 15000);
out.url = page.url(); out.body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300);
return fin({ out });
