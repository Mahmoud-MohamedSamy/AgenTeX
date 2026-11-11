// Reply composer: type recipients only, never send (sends are blocked)
const fs=require('fs'); const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const I=JSON.parse(fs.readFileSync(RUN+'/out/2830-ids.json','utf8'));
const blocked=[]; await page.route('**/api/v1/**', r => { const m=r.request().method(); const u=r.request().url(); if (m!=='GET' && /send|repl|thread|mail|draft/i.test(u)) { blocked.push(m+' '+u.replace(/.*api\/v1/,'')); return r.abort(); } return r.continue(); });
await page.goto(H + '/views/all/tickets/'+I.ticket.id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2830/.test(await text())) break; } await sleep(3000);
await page.getByRole('button', {name:/^Reply All$/}).first().click(); await sleep(3000);
await shot('2831-composer-open.png');
const t0 = await text(); log('composer initial', t0.split('\n').filter(l=>/example\.com|not a valid|Recipients|To/i.test(l)).slice(0,10));
const addrs = ['qa.rt2636@example.com','info@example.org','user@sub.example.com','user@mail.test','user@company.example','user@localhost','qa.rt15@anyware.software','first.last+tag@gmail.com','qa.rt2636@'];
const res = {};
const inp = page.locator('input[placeholder*="mail" i], input[aria-label*="ecipient" i], input[placeholder*="ecipient" i]').first();
log('recipient input found', await inp.count());
for (const a of addrs) { await inp.fill(a); await page.keyboard.press('Enter'); await sleep(1200); const t = await text(); res[a] = /not a valid email/i.test(t) && t.includes(a+' is not') ? 'REFUSED' : (t.includes(a) ? 'accepted/shown' : 'not shown'); const errs = t.split('\n').filter(l=>/not a valid|valid email|enter a valid/i.test(l)); if (errs.length) res[a] += ' :: '+errs.join(' / ').slice(0,140); await page.keyboard.press('Escape').catch(()=>{}); }
log('results', res);
await shot('2831-composer-recipients.png');
log('blocked', blocked);
