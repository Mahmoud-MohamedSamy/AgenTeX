const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 8);
await page.goto(H + '/views/all/tickets/' + IDS.base, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 90); await sleep(2000);
const lang = page.locator('button[aria-label="Switch language"], button:has-text("EN")').first(); o.btn = await lang.count(); await lang.click().catch(e => o.e1 = e.message.slice(0, 80)); await sleep(1500);
o.items = await page.$$eval('[role=menuitem], [role=menuitemradio], [role=option], [role=menu] button, [data-radix-popper-content-wrapper] *', es => [...new Set(es.filter(e => e.offsetParent !== null && e.childElementCount === 0).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 15));
const ar = page.locator('[role=menuitem], [role=menuitemradio], [role=option]').filter({ hasText: /العربية|Arabic|AR/ }).first(); o.ar = await ar.count();
if (o.ar) { await ar.click().catch(e => o.e2 = e.message.slice(0, 80)); } else { const any = page.getByText(/العربية|Arabic/).first(); o.any = await any.count(); if (o.any) await any.click().catch(e => o.e3 = e.message.slice(0, 80)); }
await sleep(9000); const ta = await txt(); o.dir = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang + '/' + getComputedStyle(document.body).direction);
o.arText = ta.replace(/\s+/g, ' ').slice(0, 900); o.arRaw = raw(ta); o.latin = (ta.match(/\b(CONVERSATION|RESOLUTION|HISTORY|Reply All|Pick up|Ticket Properties|Status|Priority|Channel|Contact Info|Due Date|Close ticket)\b/g) || []).slice(0, 12);
o.shotAr = await shot('../wave2n/ui-arabic'); await page.mouse.move(1000, 400); await page.mouse.wheel(0, 800); await sleep(1500); o.shotAr2 = await shot('../wave2n/ui-arabic-2');
const hist = page.locator('[role=tab]').nth(7); if (await hist.count()) { await hist.click().catch(() => {}); await sleep(4000); const th = await txt(); o.histAr = th.replace(/\s+/g, ' ').slice(th.length / 3, th.length / 3 + 500); o.histRawAr = raw(th); o.shotAr3 = await shot('../wave2n/ui-arabic-history'); }
// back to English
const l2 = page.locator('button[aria-label]').filter({ hasText: /^(AR|ع|عربي|العربية)$/ }).first(); const l3 = (await l2.count()) ? l2 : page.locator('header button').filter({ hasText: /AR|ع/ }).first();
await l3.click().catch(e => o.e4 = e.message.slice(0, 80)); await sleep(1500); const en = page.locator('[role=menuitem], [role=menuitemradio], [role=option]').filter({ hasText: /English|الإنجليزية|EN/ }).first(); if (await en.count()) await en.click().catch(() => {}); await sleep(6000);
o.after = await page.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang);
return done(o);
