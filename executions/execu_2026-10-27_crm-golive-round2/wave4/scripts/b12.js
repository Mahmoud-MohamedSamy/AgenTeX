// Round 2 Wave 4 batch 12: delete the exact QA R2W4 objects listed in after/b11-list.json and after/created.json.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const targets = [
  ...['d64f5b90-17cb-4f08-a928-a13b87334752', 'dc556763-707d-4552-98ae-6b4f4457d51f', '4bf232b6-9a79-4763-85bb-15302e294128', '00e2054f-a0dc-47bb-b697-f35b2173629a',
    'd199f5f1-c068-411a-9df1-6ce8ef545a99', 'f2f6fb81-30a6-42d2-923a-32283f07fcff', 'b23606df-c050-4354-8107-f6387ca68bca', 'a8aaba4b-b332-49e6-a44c-b1a1aaeef287'].map(id => `/modules/${L}/records/${id}`),
  ...['b8e9b038-e2f1-4020-b3f7-df99f0ab216b', '36dced7d-fb31-49e4-8eb9-78643bd9a8be'].map(id => `/modules/${T}/records/${id}`),
  '/mail/templates/33854615-e46c-45d0-ba37-8e5bc0fcdfea',
  '/web-forms/ffc11512-870e-48d8-b8e8-971a0c056d8a', '/web-forms/8dbb3e94-94bb-410c-bac8-63663c5041e3',
  '/record-portals/bf87e0e1-c7c1-4e99-9d06-74a472a3e5de'];
const out = { now: new Date().toISOString(), del: [] };
for (const p of targets) { const g = await call('GET', p); const name = JSON.stringify(g.j || '').match(/QA R2W4[^"]*/); if (g.s === 200 && !name) { out.del.push(`${p} SKIPPED (not a QA R2W4 object)`); continue; }
  const r = await call('DELETE', p); out.del.push(`${p} [${name ? name[0] : 'GET ' + g.s}] -> ${r.s}`); }
return out;
