const o = {};
const inp = page.locator('input').filter({ visible: true }).first(); await inp.fill('QA NDC GDS B2B'); await sleep(500); await inp.press('Enter').catch(() => {}); await sleep(800);
await page.locator('button', { hasText: /^\s*Save\s*$/ }).last().click().catch(e => o.e = e.message.slice(0, 60));
let t = ''; for (let i = 0; i < 12; i++) { await sleep(700); t = (await txt()).replace(/\s+/g, ' '); if (/already exists|unique|duplicate/i.test(t)) break; }
o.msg = t.match(/.{0,80}(already exists|unique|duplicate).{0,80}/i)?.[0];
o.shot = await shot('a1/tavi-dup-name');
return JSON.stringify(o);
