// NDC-2630 screen: open the QA lead, Send Email → what the compose window says for a sender without a connection. Nothing is sent.
await page.goto(`${H}/modules/${T.LEADS}/records/f06da22b-45bf-41ad-9458-04c3a0acf960`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
await page.click('button:has-text("Send Email")').catch(() => page.click('text=Send Email'));
await sleep(5000); await shot('2630-compose.png');
const t = await text();
const send = await page.$('button:has-text("Send")');
return { warn: (t.match(/.{0,80}(can't send|cannot send|no (email )?provider|not connected).{0,160}/i) || [''])[0], sendDisabled: send ? await send.isDisabled() : 'no button' };
