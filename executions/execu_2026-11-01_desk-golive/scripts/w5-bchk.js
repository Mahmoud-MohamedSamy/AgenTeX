out.me = (await api('GET', '/iam/me/permissions')).s;
for (const r of ['/analytics/reports', '/settings/data/import', '/settings/modules-and-fields', '/settings/data/export']) { await page.goto(H + r, { waitUntil: 'domcontentloaded' }).catch(() => {}); await sleep(6000); out[r] = page.url().replace(H, '') + ' :: ' + (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 160); }
return fin({ out });
