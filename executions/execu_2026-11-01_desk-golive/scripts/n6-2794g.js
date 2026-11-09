const o = {}; await page.mouse.click(1546, 843).catch(() => {}); await sleep(500);
await page.mouse.click(615, 707); await sleep(1500);
await page.getByRole('option', { name: /mahmoud\.mahamed1515/ }).first().click().catch(e => o.e0 = e.message.slice(0, 50)); await sleep(800);
await page.locator('button', { hasText: /^\s*Save\s*$/ }).last().click({ timeout: 10000 }).catch(e => o.e = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 10; i++) { await sleep(800); t = (await txt()).replace(/\s+/g, ' '); if (/not a member|saved|Workflow Rules for this module/i.test(t)) break; }
o.msg = t.match(/.{0,80}(not a member|saved)[^.]{0,80}/i)?.[0]; o.url = page.url().replace(H, '');
return JSON.stringify(o);
