// Read-only: Setup → Agents page, capture the row of the test user (role / profile columns) and the API calls it makes.
const calls = [];
const onResp = async r => { const u = r.url(); if (u.includes('/api/v1/') && r.request().method() === 'GET' && /agent|user|member|role|org/i.test(u)) { try { calls.push(u.replace(API, '') + ' ' + r.status() + ' ' + (await r.text()).slice(0, 300)); } catch (e) { } } };
page.on('response', onResp);
await go('/settings/agents', 8000);
page.off('response', onResp);
const t = await txt();
const i = t.indexOf('mahamed1515');
const row = i >= 0 ? t.slice(Math.max(0, i - 200), i + 300) : 'not found';
const s = await shot('SETUP-agents-page');
page.off('request', onReq);
return JSON.stringify({ url: page.url(), row, calls: calls.slice(0, 12) });
