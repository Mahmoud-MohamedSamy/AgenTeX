const o = {};
await page.getByRole('option', { name: /QA Team 1/ }).first().click().catch(e => o.e0 = e.message.slice(0, 50)); await sleep(800);
await page.mouse.click(371, 777).catch(() => {}); 
await page.locator('button', { hasText: /^\s*Save\s*$/ }).last().click({ timeout: 10000 }).catch(e => o.e = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 10; i++) { await sleep(700); t = (await txt()).replace(/\s+/g, ' '); if (/member|must be|not in|error|saved/i.test(t)) break; }
o.msg = t.match(/.{0,100}(must be a member|not a member|member of the team|isn't|is not)[^.]{0,120}/i)?.[0];
o.url = page.url().replace(H, '');
o.shot = await shot('rt/2794-nonmember');
return JSON.stringify(o);
