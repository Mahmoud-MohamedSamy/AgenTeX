await go('/views/all/tickets'); await sleep(8000);
await page.mouse.click(965,28);await sleep(2000);await shot('pc-new-menu');
const t=(await text()).replace(/\s+/g,' ');log('after plus',t.slice(0,300));
const it=page.getByText(/^Ticket$/).first();if(await it.count()){await it.click();await sleep(4000);}
await shot('pc-new-form');log('url',page.url());
log('fields',await page.locator('input,textarea,select,[contenteditable=true]').evaluateAll(a=>a.filter(x=>x.offsetParent).map(x=>x.tagName+'|'+(x.name||x.id||x.placeholder||x.getAttribute('aria-label')||'')).slice(0,30)));
return {ok:1};
