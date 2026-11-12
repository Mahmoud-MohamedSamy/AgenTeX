await go('/views/all/tickets/48326997-5fc4-49c4-8303-ce5c9429bad0', 8000); await page.getByText('CUSTREPLY99').first().waitFor({ timeout: 40000 }).catch(e => out.wait = 'no CUSTREPLY99 after 40s');
const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ');
out.hasCust = t.includes('CUSTREPLY99'); out.hasAgent = t.includes('AGENTVISIBLE77'); out.hasPriv = t.includes('PRIVHIDDEN88');
const i = t.indexOf('QA GL W4 portal 01'); out.text = t.slice(Math.max(0, i), i + 1200);
await shot('w4/W4-45-desk-thread');
const r = await api('GET', '/modules/' + TM + '/records/48326997-5fc4-49c4-8303-ce5c9429bad0'); const f = flat(D(r.j) || {}); out.desc = String(f.description || f.body || '').slice(0, 200); out.keys = Object.keys(f).join(',').slice(0, 600);
return fin({ out });
