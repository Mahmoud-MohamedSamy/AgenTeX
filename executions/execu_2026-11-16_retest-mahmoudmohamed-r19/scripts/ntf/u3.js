await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await text(); if (/QA|Ticket/.test(t) && !/Loading/.test(t)) break; }
await sleep(3000);
const btns=await page.locator('button, [role=tab], input[type=search], input[placeholder]').evaluateAll(es=>es.map(e=>(e.tagName+' '+(e.getAttribute('aria-label')||'')+' '+(e.getAttribute('placeholder')||'')+' '+(e.innerText||'').slice(0,30)).replace(/\s+/g,' ')).filter(x=>x.trim().length>7).slice(0,80));
await shot('2851-0-list.png');
return {url:page.url(),btns};
