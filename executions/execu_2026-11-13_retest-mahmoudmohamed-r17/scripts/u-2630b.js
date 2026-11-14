const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const ID='383e3fc5-6154-4cf5-8117-f3b9f3a05abc';
const red=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
await page.goto(H + '/modules/'+L+'/records/'+ID, { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/2630 send real/.test(await text())) break; }
await sleep(3000);
const tab = page.getByRole('tab', {name:/^Emails/}).first(); if (await tab.count()) { await tab.click(); await sleep(5000); }
let t = await text(); const k = t.indexOf('QA RT17 2630 refused sender'); log('emails', red(t.slice(Math.max(0,k-300), k+300)));
await shot('2630-record-emails-refused.png');
const it = page.getByText('QA RT17 2630 refused sender').first();
if (await it.count()) { await it.click(); await sleep(3000); await shot('2630-email-detail-refused.png');
  const dlg = page.locator('[role=dialog]').last(); const dt = await dlg.innerText().catch(()=>'');
  log('detail', red(dt).slice(0,700)); log('chips Sent', (dt.match(/\bSent\b/g)||[]).length, 'Failed', (dt.match(/\bFailed\b/g)||[]).length);
  await page.keyboard.press('Escape'); await sleep(1000); }
const tl = page.getByRole('tab', {name:/^Timeline/}).first(); if (await tl.count()) { await tl.click(); await sleep(4000); await shot('2630-timeline-refused.png'); t = await text(); log('timeline', /Email ?Sent|sent an email/i.test(t) ? 'HAS EMAIL SENT' : 'no email-sent entry'); }
await page.getByRole('button', {name:'Send Email'}).first().click(); await sleep(4000);
const d = page.locator('[role=dialog]').last(); const ct = (await d.innerText().catch(()=>'')) || (await text()).slice(-1500);
log('compose', red(ct).slice(0,900));
await shot('2630-compose-refused.png');
const sendBtn = d.getByRole('button', {name:/^Send$/}); log('send enabled', await sendBtn.count() ? await sendBtn.first().isEnabled() : 'no send button');
await page.keyboard.press('Escape');
