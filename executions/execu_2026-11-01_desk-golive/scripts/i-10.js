const o = {}; const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const deps = await api('GET', '/desk/departments'); const sales = arr(deps.j.data).find(d => d.name === 'Sales'); o.sales = sales && sales.id;
const sales2 = await api('GET', '/desk/departments/' + sales.id); o.ownerInSales = JSON.stringify(sales2.j.data.agent_user_ids || []).includes(ME);
const c = await mkRec(T, { subject: 'QA GL W2 img move', status: 'Open', department: MK, contact_id: 'de7195a2-369e-48c5-b03f-b8e37d6c5fb2', channel: 'Phone', description: 'Go-live wave 2 image ticket (12 Nov). Safe to delete.' }, 'img-move'); o.create = [c.s, c.id, c.e];
if (c.id) { const P = '/desk/tickets/' + c.id; o.assign = (await api('POST', `${P}/assign`, { owner_id: ME })).s;
  const b = await api('GET', P); o.before = [b.j.data.department_id, b.j.data.owner_id || JSON.stringify(b.j.data.owner || '').slice(0, 80)];
  o.move = (await api('POST', `${P}/move`, { department_id: sales.id })).s; await sleep(2000);
  const a = await api('GET', P); o.after = [a.j.data.department_id, a.j.data.owner_id || JSON.stringify(a.j.data.owner || '').slice(0, 80)];
  await page.goto(H + '/views/all/tickets/' + c.id, { waitUntil: 'commit' }).catch(() => {}); await sleep(12000);
  const hist = page.locator('[role=tab]', { hasText: /^HISTORY$/i }); o.ht = await hist.count();
  o.shotMove = await shot('../wave2n/i-move-after');
  const tabs = page.getByText('HISTORY', { exact: true }); if (await tabs.count()) { await tabs.first().click().catch(() => {}); await sleep(5000); o.shotHist = await shot('../wave2n/i-move-history'); o.histText = (await txt()).replace(/\s+/g, ' ').match(/Ticket History.{0,900}/)?.[0]; } }
return done(o);
