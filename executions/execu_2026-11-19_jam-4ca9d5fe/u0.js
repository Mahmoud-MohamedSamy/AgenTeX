const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }); page.on('requestfailed', r => errs.push('FAILED ' + r.url().slice(0, 120))); page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 120)); });
await page.goto(H + '/settings/automation/assignment-rules?view=round-robin', { waitUntil: 'commit' }); await sleep(30000);
log('url', page.url()); log('text', (await text()).replace(/\s+/g, ' ').slice(0, 300)); log('errs', errs.slice(0, 20)); await shot('JAMR-0.png');
