const o = await zf('GET', '/crm/v2.2/org'); const org = o.j.org[0]; log('edition', JSON.stringify(org.license_details || {}).slice(0, 300));
const l = await zf('GET', '/crm/v2.2/settings/layouts?module=Leads'); const lay = l.j.layouts[0]; log('layout', lay.id, lay.name);
const reqs = []; page.on('request', r => { if (/formula|function|syntax|validate/i.test(r.url())) reqs.push(r.method() + ' ' + r.url().slice(0, 200) + ' ' + (r.postData() || '').slice(0, 300)); });
await page.goto(`https://crm.zoho.com/crm/org946877290/settings/layouts/${lay.id}?module=Leads`, { waitUntil: 'domcontentloaded' }); await sleep(15000);
await page.screenshot({ path: RUN + '/zoho/z-layout.png' });
const t = await page.innerText('body'); log('has Formula', /Formula/.test(t), t.slice(0, 300).replace(/\n/g, ' | '));
log(reqs.slice(0, 10));
