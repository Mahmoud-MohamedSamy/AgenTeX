async (page) => {
  const fails = [], pend = new Map();
  page.on('requestfailed', r => fails.push(r.url().replace(/[?].*$/, '').slice(0, 120) + ' ' + (r.failure() || {}).errorText));
  page.on('request', r => pend.set(r, r.url().replace(/[?].*$/, '').slice(0, 120)));
  page.on('requestfinished', r => pend.delete(r));
  await page.goto('https://crm.zoho.com/crm/org946877290/tab/Home/begin', { waitUntil: 'commit', timeout: 120000 }).catch(e => fails.push('goto ' + e.message.slice(0, 80)));
  await page.waitForTimeout(60000);
  const t = await page.innerText('body').catch(() => '');
  return { fails: fails.slice(0, 25), pending: [...pend.values()].slice(0, 25), text: t.slice(0, 300) };
}
