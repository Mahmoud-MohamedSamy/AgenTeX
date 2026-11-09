const O = 'https://crm.zoho.com/crm/org943261092';
await page.goto(O + '/tab/Leads/mass-delete', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1500); const t = await page.innerText('body').catch(() => ''); if (/Mass Delete/i.test(t) && t.length > 300) break; }
await sleep(3000);
out.url = page.url(); out.text = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,40}Mass Delete.{0,600}/i)?.[0];
await page.screenshot({ path: RAW + 'z-mass-delete.png' });
