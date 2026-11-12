const grab = async () => [...new Set(await page.locator('a[href]').evaluateAll(as => as.map(a => (a.innerText.trim().replace(/\s+/g, ' ').slice(0, 40)) + ' => ' + a.getAttribute('href'))))];
await go('/settings', 9000); out.settings = (await grab()).filter(s => /=> \/settings/.test(s));
await go('/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4', 9000); out.customers = (await grab()).filter(s => /modules|customers|accounts|contracts/i.test(s)).slice(0, 30);
out.custTabs = (await page.locator('nav a, [role=tab], aside a').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40);
await go('/analytics', 12000); out.analytics = (await grab()).filter(s => /analytics|report|dashboard/i.test(s)).slice(0, 30); out.anaText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 600);
await shot('w5/probe-analytics');
await go('/calendar', 8000); out.cal = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300);
await go('/activities', 8000); out.act = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 300);
return fin({ out });
