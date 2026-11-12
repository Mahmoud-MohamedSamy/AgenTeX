async (page, ctx) => {
  const { p } = globalThis.__hc; const seen = [];
  const h = async r => { const u = r.url(); if (/help-center\/public/.test(u) && !/assets/.test(u)) { let t = ''; try { t = (await r.text()).slice(0, 1500); } catch (e) {} seen.push(r.status() + ' ' + u.replace(/hc1\.[A-Za-z0-9._-]+/, '<key>') + ' :: ' + t.replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 700)); } };
  p.on('response', h);
  await p.goto('https://staging-crm.taviportal.com/help/hc1.a7a7a7a7000000000000000000000004.rDvrZfW_-TBcbb_XkySGodjzQfiQLj80dsTNfdLteDw/tickets/new', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  await p.locator('#hc-department').click(); await p.waitForTimeout(700); await p.getByRole('option', { name: 'Customer Support' }).first().click(); await p.waitForTimeout(4000);
  p.off('response', h);
  return seen.filter(s => /form|field|layout|depart|ticket/i.test(s)).slice(0, 6);
}
