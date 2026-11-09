const o = {};
await page.goto(H + '/views/all/tickets/f22316f3-028c-4703-83a1-52be68fda37e', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA RT 2797 allowed status/.test(t) && /Ticket Owner/.test(t)) break; }
await sleep(2500);
const st = page.locator('button', { hasText: /^QA NDC Pending/ }).first(); o.st = await st.count(); await st.click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1500);
o.opts = await page.$$eval('[role=option], [role=menuitem], [role=menuitemradio]', es => es.map(e => e.innerText.trim()).filter(Boolean));
o.shot = await shot('rt/2797-ticket-status');
await page.keyboard.press('Escape');
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new?layout=602826bb-1d89-4aaf-82a9-1ab5e469c628', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /Create Ticket/.test(t)) break; }
await sleep(2000);
const ctl = page.locator('xpath=//*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//button | //*[normalize-space(text())="Status"]/ancestor::*[self::div][2]//*[@role="combobox"]').first(); await ctl.click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(1500);
o.createOpts = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
o.shot2 = await shot('rt/2797-create-status');
await page.keyboard.press('Escape');
return JSON.stringify(o);
