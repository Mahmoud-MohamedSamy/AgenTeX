const o = {};
const lay = async () => page.evaluate(() => { const s = [...document.querySelectorAll('select')].find(e => e.getBoundingClientRect().y < 150); return s ? s.options[s.selectedIndex].text : null; });
for (const q of ['?department=c0e05c3e-aa51-47ef-be50-53fd4c6edcb1', '?departmentId=c0e05c3e-aa51-47ef-be50-53fd4c6edcb1']) {
  await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new' + q, { waitUntil: 'commit' }).catch(() => {});
  for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (!/Loading form/.test(t) && /Create Ticket/.test(t)) break; }
  await sleep(2500); o[q.slice(1, 11)] = { layout: await lay(), dept: (await txt()).replace(/\s+/g, ' ').match(/Department.{0,30}/)?.[0] }; }
// department switcher in header (Desk scope) then + New ticket
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit' }).catch(() => {}); await sleep(8000);
o.headerDept = (await txt()).replace(/\s+/g, ' ').slice(0, 200);
return JSON.stringify(o);
