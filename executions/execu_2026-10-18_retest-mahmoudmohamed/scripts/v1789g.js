const out = {};
await openWQ(); await pick(/^Tasks, /); let b = ''; for (let i = 0; i < 15; i++) { b = await badge(); if (/applied/.test(b)) break; await sleep(1000); }
await panel(); out.newLoginViaWQ = { badge: b, total: await total(), row: await rowTxt() }; await shot('NDC-1789-3-new-login');
await page.getByRole('button', { name: 'Clear filters' }).click(); await sleep(4000); out.cleared = { badge: await badge(), total: await total() };
await openWQ(); await pick(/^Tasks, /); await sleep(6000); out.afterClearReload = { badge: await badge(), total: await total() }; await shot('NDC-1789-4-cleared-stays');
return done(out);
