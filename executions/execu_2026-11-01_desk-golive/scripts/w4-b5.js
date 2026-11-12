const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 160));
await go('/settings/channels/email', 12000);
out.enAccess = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 120);
let n0 = NET.length;
await page.getByRole('button', { name: /^EN/ }).first().click(); await sleep(1200);
out.langs = (await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').allInnerTexts()).map(s => s.trim()).slice(0, 10);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').filter({ hasText: /العربية|Arabic/ }).first().click(); await sleep(6000);
out.langNet = nn(n0);
const scan = async () => { const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' '); return { dir: await page.evaluate(() => document.documentElement.dir), text: t.slice(0, 400), latin: (t.match(/[A-Za-z]{4,}/g) || []).filter(w => !/help|staging|anyware|software|customer|support|tech|Desk|Zoho|SendGrid|SMTP|DNS|SPF|DKIM|Tavi|reply/i.test(w)).slice(0, 25), keys: (t.match(/\b[a-z]+(\.[a-z_]+){2,}\b/g) || []).slice(0, 10) }; };
out.overview = await scan(); await shot('w4/W4-11-email-ar');
for (const tab of ['addresses', 'blocked-addresses', 'spam']) { await go('/settings/channels/email/' + tab, 9000); out[tab] = await scan(); }
await shot('w4/W4-11-spam-ar');
// back to English
n0 = NET.length;
await page.getByRole('button', { name: /^(AR|ع)/ }).first().click().catch(async () => { await page.locator('header button').filter({ hasText: /AR|العربية/ }).first().click(); }); await sleep(1200);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').filter({ hasText: /English|الإنجليزية/ }).first().click().catch(e => out.backErr = e.message.slice(0, 80)); await sleep(5000);
out.backNet = nn(n0); out.dirAfter = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
return fin({ out });
