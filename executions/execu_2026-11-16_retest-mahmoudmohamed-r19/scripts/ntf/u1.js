await page.goto(H + '/settings/customization/notifications', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await text(); if (/Agent Notifications/.test(t)) break; }
await sleep(2000);
const t=(await text()).replace(/\s+/g,' ');
const combos=await page.locator('select, [role=combobox], button[aria-haspopup]').evaluateAll(es=>es.map(e=>e.tagName+' '+(e.getAttribute('aria-label')||'')+' '+(e.innerText||e.value||'').slice(0,60)));
await shot('2864-0-notif-page.png');
return {head:t.slice(0,1500),combos};
