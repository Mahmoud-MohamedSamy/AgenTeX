const o = {};
for (const p of ['/settings/customization/ticket-statuses', '/settings/tickets/statuses', '/settings/customization/ticket-status', '/settings/tickets/status']) {
  await page.goto(H + p, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(5000);
  const t = (await txt()).replace(/\s+/g, ' ').replace(/^.*?Email Providers/, ''); o[p] = t.slice(0, 160); if (/Status/.test(t.slice(0, 200)) && !/not found|404/i.test(t.slice(0, 200))) break; }
return JSON.stringify(o);
