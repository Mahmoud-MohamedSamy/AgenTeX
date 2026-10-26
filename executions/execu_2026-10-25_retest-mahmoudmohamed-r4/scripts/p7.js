// NDC-1302: what the user sees after the refused save (scroll to top).
await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollTop > 0) e.scrollTop = 0; }));
await sleep(800); await shot('1302-05-error-top');
const t = await txt();
return done({ errs: t.split('\n').filter(l => /not one of|invalid|allowed|error|failed/i.test(l)).slice(0, 6) });
