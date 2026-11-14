await page.getByLabel('Product Name').fill('QA GL W5 Product'); await page.getByLabel('Product Code').fill('QA-GL-W5');
out.btns = await page.locator('main').last().getByRole('button').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(x => /save|create|cancel/i.test(x)));
const n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
out.net = NET.slice(n0).filter(x => /records/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 150));
const m = out.net.join(' ').match(/"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'product', id: m[1], name: 'QA GL W5 Product', mod: PM }); out.pid = m[1]; }
out.url = page.url().replace(H, '');
// link to ticket #3403 through Product Name field
const TM = '88e8ea44-1658-4df3-9930-d0902b91073d', T = 'f64e2ab2-83ae-4ec8-9441-ee94d302d8bd';
if (out.pid) { const tf = await api('GET', '/modules/' + TM + '/fields'); const pf = arr(D(tf.j)).find(f => /product/i.test(f.api_name || f.key || f.name || '')); out.pfield = pf && (pf.api_name || pf.key || pf.name);
  const up = await api('PATCH', '/modules/' + TM + '/records/' + T, { data: [{ field: out.pfield || 'product_id', value: { kind: 'string', value: out.pid } }] }); out.link = up.s + ' ' + up.t.slice(0, 200);
  await go('/tickets/' + T, 12000); out.ticketShows = (await mtxt()).includes('QA GL W5 Product'); await shot('w5/W5-60-ticket-product'); }
return fin({ out });
