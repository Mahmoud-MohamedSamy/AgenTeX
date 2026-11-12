const t = (await findT('QA GL W4 portal 02'))[0]; if (!t) return fin({ out: { none: true } }); out.id = t.id; out.n = t.ticket_number; out.keys = Object.keys(t).join(',');
out.desc = String(t.description || '').slice(0, 200);
const rp = await api('GET', '/desk/tickets/' + t.id + '/replies'); out.replies = arr(D(rp.j)).map(x => String(x.body_html || '').replace(/<[^>]+>/g, ' ').slice(0, 150));
await go('/views/all/tickets/' + t.id, 8000); await page.getByText('QA GL W4 portal 02').first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(5000);
const txt = (await page.locator('main').last().innerText()).replace(/\s+/g, ' '); out.deskHas = txt.includes('DETAILS55'); out.deskText = txt.slice(0, 500);
await shot('w4/W4-44-portal02-desk');
return fin({ out });
