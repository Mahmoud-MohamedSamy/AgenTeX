const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=602826bb-1d89-4aaf-82a9-1ab5e469c628', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 90; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /QA NDC Agent id/.test(t)) break; }
await sleep(2000); o.form = await shot('a6/tavi-create-form');
o.stars = await page.evaluate(() => [...document.querySelectorAll('label')].filter(l => /\*/.test(l.innerText)).map(l => l.innerText.replace(/\s+/g, ' ').trim()).slice(0, 20));
const subj = page.locator('xpath=//*[normalize-space(text())="Subject"]/ancestor::*[self::div][2]//input').first(); o.subj = await subj.count(); if (o.subj) await subj.fill('QA NDC smoke UI required missing');
const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); if (await ctl.count()) { await ctl.click().catch(() => {}); await sleep(1200); const opt = page.getByRole('option', { name: /^Open$/ }).first(); if (await opt.count()) await opt.click().catch(() => {}); await sleep(800); }
const save = page.locator('button', { hasText: /^Save$/ }).last(); await save.click().catch(e => o.saveErr = e.message.slice(0, 80));
let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt(); if (/\/records\/[0-9a-f-]{36}/.test(page.url())) break; }
o.afterUrl = page.url().replace(H, ''); o.msgs = [...new Set((t.match(/[^.\n]{0,50}is required/gi) || []))].slice(0, 15);
o.after = await shot('a6/tavi-create-after');
return JSON.stringify(o);
