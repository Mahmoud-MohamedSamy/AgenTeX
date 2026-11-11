const fs=require('fs'); const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const I=JSON.parse(fs.readFileSync(RUN+'/out/2796-ticket.json','utf8'));
await page.goto(H + '/views/all/tickets/'+I.id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2796/.test(await text())) break; } await sleep(3000);
await shot('2796-ticket-page.png'); log('url', page.url()); const t0 = await text(); log('ADM fields on ticket', ['IATA Source','ADM Number','Airline Code','ADM Reason'].filter(f=>t0.includes(f)));
// the ⋮ menu in the ticket header
const cand = await page.$$eval('button', bs => bs.map((b,i)=>{const r=b.getBoundingClientRect(); return {i, a:b.getAttribute('aria-label')||'', t:b.innerText.trim().slice(0,15), x:Math.round(r.x), y:Math.round(r.y)};}).filter(o=>o.y>60 && o.y<200 && o.x>1300)); log('header buttons', cand); await page.getByRole('button', {name:'More ticket actions'}).click(); await sleep(1500); await shot('2796-more-menu.png');
const items = await page.$$eval('[role=menuitem], [role=menu] button, [role=menu] a', ms => ms.map(m=>m.innerText.trim())); log('menu', items);
await page.getByText(/Change Layout/i).first().click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last(); log('dialog', (await dlg.innerText()).slice(0,800));
const s = dlg.locator('select').first(); if (await s.count()) log('options', await s.evaluate(x=>[...x.options].map(o=>o.text)));
else { const cb = dlg.getByRole('combobox').first(); if (await cb.count()) { await cb.click(); await sleep(1000); log('options', await page.$$eval('[role=option]', os=>os.map(o=>o.innerText.trim()))); } }
await shot('2796-change-layout.png');
await dlg.getByText('QA NDC Accounting', {exact:true}).first().click(); await sleep(800);
await dlg.getByRole('button', {name:'Change layout'}).click(); await sleep(6000);
const t1 = await text(); log('after change: ADM fields', ['IATA Source','ADM Number','Airline Code','ADM Reason'].filter(f=>t1.includes(f)));
log('toast', await page.$$eval('[data-sonner-toast]', ts => ts.map(t=>t.innerText.trim())));
await shot('2796-after-change.png');
