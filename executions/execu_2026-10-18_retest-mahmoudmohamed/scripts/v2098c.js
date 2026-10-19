const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
await page.goto(H + '/modules/' + L + '?view=0b48bfa9-555c-40e4-b744-6e5eb702b8a4', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 120; i++) { await sleep(250); const t = await txt().catch(() => ''); const m = t.match(/[^\n]*(no longer available|not available|default view)[^\n]*/i); if (m) { out.toast = m[0]; await shot('NDC-2098-deleted-toast'); break; } }
await sleep(3000); out.url = page.url().replace(H, ''); out.view = (await page.locator('button[aria-label="Custom views"]').innerText().catch(() => '')).trim();
return done(out);
