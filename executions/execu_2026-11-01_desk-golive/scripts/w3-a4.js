const a = await mk(AM, 'account', 'QA GL W3 Account', { account_name: 'QA GL W3 Account' }); out.acc = a;
const c = await mk(CM, 'contact', 'QA GL W3 Contact', { first_name: 'QA GL W3', last_name: 'Contact', email: 'qa-gl-w3-c1@example.com', account_id: a.id }); out.con = c;
await go('/modules/' + KM, 9000); out.list = (await mtxt()).slice(0, 300);
const nb = page.getByRole('button', { name: /^(New|Create|Add)/i }).first(); out.nb = await nb.innerText().catch(() => 'none'); await nb.click().catch(e => out.e = 'no new btn'); await sleep(6000);
out.url = page.url().replace(H, ''); out.form = (await mtxt()).slice(0, 1800); await shot('w3/W3-05-contract-form');
return fin({ out });
