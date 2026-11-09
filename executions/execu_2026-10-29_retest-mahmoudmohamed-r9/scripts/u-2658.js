// NDC-2658: Settings › Users › Invite user (qa.rt.2658@example.com) with all seats used → the message must be a sentence, not "iam.subscription.seat_limit_reached".
const calls = [];
page.on('response', async r => { if (/\/iam\/users\/invite|invitations/.test(r.url()) && r.request().method() !== 'GET') { let t = ''; try { t = (await r.text()).slice(0, 220); } catch (e) { } calls.push(r.status() + ' ' + t); } });
await page.goto(H + '/settings/general/users', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=Invite user', { timeout: 150000 }); await sleep(2000);
await page.click('text=Invite user'); await sleep(3000); await shot('2658-1-dialog.png');
const email = page.locator('[role=dialog] input[type=email], [role=dialog] input[placeholder*="mail" i]').first(); await email.fill('qa.rt.2658@example.com');
const dlgText = await page.locator('[role=dialog]').first().innerText();
// pick the first profile / org unit if required
for (const sel of await page.$$('[role=dialog] select')) { const opts = await sel.$$eval('option', o => o.map(x => x.value).filter(Boolean)); if (opts.length) await sel.selectOption(opts.find(v => /11111111-1111-1111-1111-111111111103/.test(v)) || opts[0]); }
await sleep(1000); await shot('2658-2-filled.png');
const send = page.locator('[role=dialog] button', { hasText: /^Send invitations/ }).last(); const out = { sendEnabled: await send.isEnabled().catch(() => 'no button') };
if (out.sendEnabled === true) { await send.click(); await sleep(6000); }
await shot('2658-3-result.png'); const t = await text();
out.message = (t.match(/.{0,40}(seat|iam\.subscription[\w.]*|limit|upgrade|billing).{0,160}/i) || [''])[0].replace(/\s+/g, ' ');
out.rawKey = /iam\.subscription\.seat_limit_reached/.test(t); out.calls = calls; out.dialogFields = dlgText.replace(/\s+/g, ' ').slice(0, 300);
return out;
