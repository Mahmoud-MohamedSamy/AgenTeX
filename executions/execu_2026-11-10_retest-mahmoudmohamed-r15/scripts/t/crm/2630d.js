const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L+'/records/5eab324e-fa2b-49fa-a63b-07e0bfe38a35', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/2630 send real/.test(await text())) break; }
await sleep(3000);
const tab = page.getByRole('tab', {name:/^Emails/}).first(); if (await tab.count()) { await tab.click(); await sleep(5000); }
let t = await text(); const k = t.indexOf('QA RT15 2630 send result'); log('emails', t.slice(Math.max(0,k-400), k+400).replace(/[\w.+-]+@[\w.-]+/g,'<email>'));
await shot('NDC-2630-record-emails.png');
const it = page.getByText('QA RT15 2630 send result').first(); if (await it.count()) { await it.click(); await sleep(3000); await shot('NDC-2630-email-detail.png'); t = await text(); const j = t.indexOf('No Zoho'); log('detail', t.slice(Math.max(0,j-300), j+300).replace(/[\w.+-]+@[\w.-]+/g,'<email>')); await page.keyboard.press('Escape'); await sleep(1000); }
const tl = page.getByRole('tab', {name:/^Timeline/}).first(); if (await tl.count()) { await tl.click(); await sleep(4000); await shot('NDC-2630-timeline.png'); t = await text(); log('timeline', /Email ?Sent|sent an email/i.test(t) ? 'HAS EMAIL SENT' : 'no email-sent entry'); }
const comp = page.getByRole('button', {name:/Send Email|Compose|Email/}).first(); log('compose btn', await comp.count());
