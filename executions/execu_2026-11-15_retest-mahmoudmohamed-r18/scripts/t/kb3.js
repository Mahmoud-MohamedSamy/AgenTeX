const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const st={}; page.on('response', r => { const u=decodeURIComponent(r.url()); if (/\/modules\/[^/]+\/records\?/.test(u) && /lead_status|pick_list_4_9/.test(u)) { const k=r.status(); st[k]=(st[k]||0)+1; } });
await page.goto(H+'/modules/'+L, { waitUntil:'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/records/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', {name:'Kanban view', exact:true}).first().click(); await sleep(15000);
const t=await text(); await shot('2993-2-leads-kanban.png');
return { couldNot:(t.match(/Could not load these records/g)||[]).length, st, excerpt:t.slice(t.indexOf('Kanban'),t.indexOf('Kanban')+900).replace(/\s+/g,' ') };
