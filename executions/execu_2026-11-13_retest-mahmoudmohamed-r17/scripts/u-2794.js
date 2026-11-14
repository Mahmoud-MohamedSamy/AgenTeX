
const I={id:'952e3f24-c0f2-4ba2-ab52-9fc6fcf9cc3e'};
await page.goto(H + '/views/all/tickets/'+I.id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT17 2794/.test(await text())) break; } await sleep(4000);
const t = await text(); const k = t.indexOf('Key Information'); log('key info', t.slice(k, k+500).replace(/\n+/g,' | '));
const tm = t.indexOf('Team'); log('team area', t.slice(tm-50, tm+120).replace(/\n+/g,' | '));
await shot('2794-ticket.png');
await page.getByText(/^History$/i).first().click().catch(()=>{}); await sleep(4000); await shot('2794-history.png');
const h = await text(); log('history lines', h.split('\n').filter(l=>/Team|Owner|owner|rule/i.test(l)).slice(0,20));
const tok = (await ctx.cookies()).find(c=>c.name==='aw_staging_access_token').value;
const r = await page.request.get(H+'/api/v1/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/'+I.id, {headers:{authorization:'Bearer '+tok,'x-app-key':'desk'}});
const d = (await r.json()).data; log('team fields', JSON.stringify((d.data||[]).filter(x=>/team|owner/i.test(x.field))));
