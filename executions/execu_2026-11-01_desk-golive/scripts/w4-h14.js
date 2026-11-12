await go('/settings/self-service/help-widgets/d26b3a14-5ff5-4a68-b103-1cd2002306e3', 12000);
await page.getByRole('tab', { name: /^Install/ }).first().click().catch(() => page.getByText('Install', { exact: true }).first().click()); await sleep(3000);
out.install = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').replace(/hc1\.[\w.-]+|hw1\.[\w.-]+/g, 'KEY').slice(0, 900);
out.code = await page.locator('main pre, main code, main textarea').evaluateAll(es => es.map(e => (e.innerText || e.value || '').replace(/hc1\.[\w.-]+|hw1\.[\w.-]+/g, 'KEY').slice(0, 300)));
const z = {};
for (const p of ['/chat', '/social', '/settings/channels/phone', '/settings/channels/instant-messaging', '/settings/channels/guided-conversations', '/settings/channels/asap']) { await go(p, 9000); z[p] = page.url().replace(H, '') + ' :: ' + (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); }
out.z = z;
await go('/settings', 10000); const s = (await txt()).replace(/\s+/g, ' '); out.hub = ['Phone', 'Instant Messaging', 'Guided', 'ASAP', 'Live Chat', 'Social', 'Help widgets', 'Telephony', 'WhatsApp'].map(k => k + '=' + s.includes(k)).join(' ');
return fin({ out });
