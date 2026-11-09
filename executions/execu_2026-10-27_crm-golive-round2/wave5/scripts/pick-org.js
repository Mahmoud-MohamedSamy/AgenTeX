await page.click('text=Wonder Travel'); await sleep(1500);
await page.click('button:has-text("Continue")').catch(() => {});
for (let i = 0; i < 30; i++) { await sleep(1000); if (!/\/login/.test(page.url())) break; }
await sleep(3000);
return { url: page.url(), tenant: await page.evaluate(() => localStorage.getItem('aw_auth_tenant_id')), hasCookie: !!(await ctx.cookies()).find(c => c.name === 'aw_staging_access_token') };
