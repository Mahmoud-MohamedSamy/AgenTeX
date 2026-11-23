const R={reqs:[]};page.on('request',q=>{const u=q.url();if(/\/audit\/events/.test(u))R.reqs.push(u.replace(/^https:\/\/[^/]+/,''));});
const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/security/audit-log',{waitUntil:'commit'});await sleep(10000);
for(let i=0;i<6;i++){const m=page.getByRole('button',{name:/Load more|Show more/i}).first();if(await m.count()){await m.click().catch(()=>{});await sleep(3000);}else break;}
const t=await bt();R.len=t.length;R.desk=[...new Set(t.match(/[^.]{0,30}(QA RT22 BS|Ticket named|ticket access|Ticket Access|data sharing|RecordVisibility|Tickets'|desk:|Desk Administrator|Customer Support|department)[^.]{0,80}/gi)||[])].slice(0,12);
R.sample=t.slice(t.indexOf('TODAY'),t.indexOf('TODAY')+700);await shot('crm-3103-a-audit.png',{timeout:90000});return R;
