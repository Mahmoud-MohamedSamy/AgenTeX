const b = D((await api('GET', '/desk/tickets/spam/settings')).j); out.before = JSON.stringify(b);
const r = await api('PUT', '/desk/tickets/spam/settings', b); out.put = r.s + ' ' + r.t.slice(0, 160);
await go('/settings/tickets/archiving', 10000); out.saveBtns = await page.locator('#main-content button').evaluateAll(es => es.filter(e => /^Save/.test((e.innerText || '').trim())).map(e => e.innerText.trim() + (e.disabled ? ' (disabled until change)' : '')));
out.switchDisabled = await page.locator('#main-content [role=switch]').evaluateAll(es => es.map(e => e.getAttribute('aria-label') + '=' + (e.disabled ? 'DIS' : 'enabled')));
await shot('w3/W3-35-agentC-archiving');
return fin({ out });
