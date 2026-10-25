await page.getByRole('button', { name: /EveryLeadWithNoAnswerStatus/ }).click(); await sleep(5000);
const names = async () => (await page.locator('tbody tr').allInnerTexts()).map(r => r.split('\n').map(x => x.trim()).filter(Boolean)[0] || '').filter(Boolean);
const out = { url: page.url() };
out.all = await names(); out.total = (await txt()).match(/Total Records (\d+)/)?.[1];
const rail = await page.locator('button, [role=tab]').evaluateAll(es => es.map(e => e.innerText.trim()).filter(t => /^([A-Z]|All|#)$/.test(t)));
out.rail = rail.join('');
await shot('1819-10-az-rail');
const letters = [...new Set(out.all.map(n => (n[0] || '').toUpperCase()))].filter(Boolean);
out.letters = letters;
if (letters.length) { await page.locator('button, [role=tab]').filter({ hasText: new RegExp('^' + letters[0] + '$') }).first().click(); await sleep(3500); out.letter = letters[0]; out.letterRows = await names(); out.letterTotal = (await txt()).match(/Total Records (\d+)/)?.[1]; await shot('1819-11-az-letter'); }
return done(out);
