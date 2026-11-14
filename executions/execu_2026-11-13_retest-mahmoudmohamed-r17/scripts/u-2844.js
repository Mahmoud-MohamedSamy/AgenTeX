const ID = process.env.TID;
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + ID, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await text(); if (/Reply All/.test(t) && !/Loading/.test(t)) break; } await sleep(4000);
log('contact panel:', ((await text()).match(/Contact Info[\s\S]{0,200}/) || [''])[0]);
await page.getByRole('button', { name: 'Reply All', exact: true }).first().click(); await sleep(5000);
const ed = await text(); log('composer:', (ed.match(/(From|To\b|Recipients)[\s\S]{0,300}/) || [''])[0]);
await shot(process.env.TAG + '-replyall.png');
