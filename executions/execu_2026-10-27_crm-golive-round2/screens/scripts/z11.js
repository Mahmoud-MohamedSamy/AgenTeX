const O = 'https://crm.zoho.com/crm/org943261092';
const wait = async () => { for (let i = 0; i < 40; i++) { await sleep(1500); const t = await page.innerText('body').catch(() => ''); if (!/^\s*Loading/.test(t) && t.length > 300) break; } await sleep(3000); };
await page.goto(O + '/tab/Leads', { waitUntil: 'domcontentloaded' }); await wait();
await page.locator('button:has-text("Actions"), span:has-text("Actions")').first().click().catch(e => out.e1 = String(e.message).slice(0, 80)); await sleep(2000);
out.actions = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,40}Mass Delete.{0,200}/)?.[0];
await page.screenshot({ path: RAW + 'z-leads-actions.png' }); await page.keyboard.press('Escape');
await page.goto(O + '/settings/personal-settings', { waitUntil: 'domcontentloaded' }); await wait();
out.personal = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,80}(Language|Locale).{0,300}/)?.[0];
await page.screenshot({ path: RAW + 'z-personal-locale.png' });
