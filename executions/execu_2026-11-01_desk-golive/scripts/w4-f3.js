await go('/settings/channels/web-forms', 10000);
await page.getByRole('button', { name: /^New feedback widget/ }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last();
out.html = (await d.evaluate(e => e.innerHTML)).replace(/class="[^"]*"/g, '').replace(/<svg.*?<\/svg>/g, '').slice(0, 3000);
return fin({ out });
