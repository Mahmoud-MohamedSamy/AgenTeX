const N = []; const on = r => { const q = r.request(); if (q.method() !== 'GET' && /api\/v1/.test(r.url())) N.push(q.method() + ' ' + r.status() + ' ' + r.url().replace(/^.*?api\/v1\//, '') + ' ' + (q.postData() || '').slice(0, 300)); }; page.on('response', on);
await page.getByText('TechEgySolutions', { exact: true }).last().click(); await page.waitForTimeout(2500);
out.panel = (await body(page)).match(/Share Ticket.{0,500}/)?.[0]; await shotZ(page, 'ac-share-picked');
const btn = page.getByRole('button', { name: /^Share$|^Save$/ }); out.nb = await btn.count();
if (out.nb) { await btn.last().click(); } else { await page.getByText(/^(Share|Save)$/).last().click().catch(() => {}); }
await page.waitForTimeout(4000); out.after = (await body(page)).match(/Share Ticket.{0,400}/)?.[0]; await shotZ(page, 'ac-share-saved');
page.off('response', on); out.N = N;
