const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
// W5-03 empty save first, then W5-02
await go('/modules/' + CM + '/records/new', 9000);
out.form = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 600);
const n0 = NET.length;
await page.getByRole('button', { name: /^Save$/ }).first().click().catch(e => out.e0 = e.message.slice(0, 60)); await sleep(2500);
out.emptyMsg = (await page.locator('main').last().innerText()).replace(/s+/g, ' ').match(/.{0,60}(required|enter|cannot be empty).{0,60}/i)?.[0] || 'no message';
out.emptyNet = NET.slice(n0).filter(x => /records/.test(x.u)).map(x => x.m + ' ' + x.s);
await shot('w5/W5-03-empty');
const lab = l => (l === 'Email' ? page.getByLabel('Email', { exact: true }) : page.getByLabel(new RegExp(l, 'i'))).first();
await lab('First Name').fill('QA GL W5'); await lab('Last Name').fill('Contact 1');
await lab('Email').fill('abc@'); await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(2500);
out.badEmail = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').match(/.{0,80}(valid|email).{0,80}/i)?.[0];
await shot('w5/W5-03-bad-email');
await lab('Email').fill('qa-gl-w5-c1@example.com'); await lab('Phone').fill('+201000000501').catch(() => {});
const n1 = NET.length; await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(5000);
const cr = NET.slice(n1).find(x => x.m === 'POST' && /records/.test(x.u)); out.create = cr ? cr.s + ' ' + cr.b.slice(0, 400) : 'none';
out.after = page.url().replace(H, '');
try { const id = JSON.parse(cr.t).data.id; CREATED.push({ kind: 'contact', id, name: 'QA GL W5 Contact 1' }); out.id = id; } catch (e) { out.idErr = (cr && cr.t || '').slice(0, 200); }
await shot('w5/W5-02-created');
return fin({ out });
