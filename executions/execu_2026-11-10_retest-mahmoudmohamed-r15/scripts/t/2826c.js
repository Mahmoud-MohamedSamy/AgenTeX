await page.goto(H + '/settings/automation/sla', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/SLA/.test(await text())) break; } await sleep(4000);
await shot('2826-list.png'); log('list', (await text()).slice(-900).split('\n').join(' | '));
const dsel = page.getByRole('button', {name:/Department|Customer Support/}).first(); log('dept buttons', await page.$$eval('button, select', bs => bs.map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(x=>/Department|Customer Support|QA AO/i.test(x)).slice(0,8)));
