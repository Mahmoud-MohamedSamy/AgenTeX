const net = []; page.on('response', async r => { if (/blueprints/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 120); } catch (e) {} net.push(r.status() + ' ' + r.url().split('/api/v1')[1]?.slice(0, 70) + ' ' + b.replace(/eyJ\S+/g,'')); } });
await go('/settings'); await sleep(3000);
const side = await text(); log('menu has Blueprints', /\bBlueprints\b/.test(side), 'Workflow', /Workflow Rules/.test(side)); await shot('a2-settings');
const bid = 'f94d03ce-e9a5-49dc-ab41-b6b0fdd04b45';
for (const p of ['/settings/automation/blueprints', '/settings/automation/blueprints/' + bid, '/settings/automation/blueprints/new']) {
  net.length = 0; await go(p); await sleep(4000);
  const t = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  log(p.replace(bid,'{id}'), { url: page.url().replace(H, '').replace(bid,'{id}'), text: t.slice(-300), hasBpData: /Tickets from Mail|QA BP B10L/.test(t), net: net.slice(0, 5) });
  await shot('a2-' + (p.endsWith('new') ? 'new' : p.endsWith(bid) ? 'id' : 'list'));
}
