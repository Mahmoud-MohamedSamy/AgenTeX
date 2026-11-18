await page.goto(H+'/settings/users-control/agents',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByText('Test User 1',{exact:false}).first().click(); await sleep(7000);
log('url',page.url());
const t=await text(); log('has raw',/records\.views/.test(t)); const i=t.indexOf('Tickets owned'); log(t.slice(Math.max(0,i-100),i+400).replace(/\s+/g,' '));
await shot('A6-1-agent-overview.png');
const tabs=await page.locator('[role=tab],nav a,button').evaluateAll(es=>es.map(e=>e.innerText.trim()).filter(x=>x&&x.length<30)); log('tabs',tabs.slice(0,60).join('|'));
log('access words',(t.match(/[^\n]*(access|visib|Ticket access|unassigned)[^\n]*/gi)||[]).slice(0,10));
