// NDC-2399: the bell with the two sync notices; config after reconnect.
const cfg = (await api('GET', '/desk/integrations/crm/config')).j?.data;
await go('/hq', 8000);
const bell = page.locator('button[aria-label*="otification" i]').first();
if (await bell.count()) { await bell.click(); await sleep(2500); }
await shot('2399-r2-05-bell');
const t = (await txt()).split('\n').filter(l => /sync finished|could not sync|Failure Log/i.test(l)).slice(0, 6);
return done({ bell: await bell.count(), t, cfg });
