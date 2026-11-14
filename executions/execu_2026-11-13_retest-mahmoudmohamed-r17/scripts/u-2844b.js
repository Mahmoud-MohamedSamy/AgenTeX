const ID = process.env.TID, TAG = process.env.TAG;
const open = async () => { await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + ID, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 60; i++) { await sleep(2000); const t = await text(); if (/Reply All/.test(t) && !/Loading/.test(t)) break; } await sleep(4000); };
const rec = async () => { const t = await text(); return { rcpt: (t.match(/Recipients\n([\s\S]*?)\nCc/) || [, '?'])[1], cc: (t.match(/\nCc\n([\s\S]*?)\nBcc/) || [, ''])[1] }; };
await open();
// plain Reply from the split menu
await page.locator('button:right-of(:text("Reply All"))').first().click(); await sleep(1500);
log('reply menu:', await page.locator('[role=menuitem]').allInnerTexts());
await page.getByRole('menuitem', { name: /^Reply$/ }).first().click(); await sleep(4000);
log('plain Reply:', await rec()); await shot(TAG + '-reply.png');
if (process.env.SEND) {
  await page.locator('[contenteditable=true]').first().click(); await page.keyboard.type('QA RT16 2844 retest reply 1 — please ignore.'); await sleep(500);
  await page.getByRole('button', { name: 'Send', exact: true }).first().click(); await sleep(8000); await shot(TAG + '-sent.png');
  log('after send:', ((await text()).match(/\d+ CONVERSATION/) || [''])[0]);
  await open();
  await page.getByRole('button', { name: 'Reply All', exact: true }).first().click(); await sleep(5000);
  const t = await text(); log('ReplyAll after reply:', (t.match(/Recipients[\s\S]{0,200}/) || [''])[0]); await shot(TAG + '-replyall-after.png');
}
