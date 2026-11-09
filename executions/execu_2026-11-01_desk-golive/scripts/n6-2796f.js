const o = {};
await page.goto(H + '/views/all/tickets/2263ab8f-bf14-4ce7-9c39-20639c162868', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA RT 2796 ADM form/.test(t) && /Ticket Owner/.test(t)) break; }
await sleep(3000); const t = (await txt()).replace(/\s+/g, ' ');
o.admFields = ['QA NDC IATA Source', 'QA NDC ADM Number', 'QA NDC Airline Code', 'QA NDC ADM Reason'].filter(f => t.includes(f));
o.layoutMentions = t.match(/.{0,40}(Layout|layout).{0,60}/g)?.slice(0, 5);
o.shot = await shot('rt/2796-ticket-adm');
const more = page.locator('button[aria-label*="ore actions"], button[aria-label*="More"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1200); o.menu = await page.$$eval('[role=menuitem]', es => es.map(e => e.innerText.trim())); o.shot2 = await shot('rt/2796-ticket-menu'); await page.keyboard.press('Escape'); }
return JSON.stringify(o);
