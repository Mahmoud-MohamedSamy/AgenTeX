const T = '88e8ea44-1658-4df3-9930-d0902b91073d', TID = '871b4b07-10d6-42cf-ab51-7e9876aff370';
const me = await api('GET', '/iam/me'); const out = { me: me.s + ' ' + JSON.stringify((me.j?.data?.profiles || []).map(p => p.name)) };
out.ticket = (await api('GET', `/modules/${T}/records/${TID}`)).s;
out.info = (await api('GET', '/desk/integrations/crm/context/contact/x/info')).s;
await page.goto(H + `/modules/${T}/records/${TID}`, { waitUntil: 'commit', timeout: 120000 }); await page.waitForTimeout(9000);
const body = () => page.evaluate(() => document.body.innerText);
out.rail = await page.evaluate(() => [...document.querySelectorAll('button[aria-label], [role=tab]')].map(b => b.getAttribute('aria-label') || b.innerText.trim()).filter(t => /crm/i.test(t)));
const crm = page.getByRole('button', { name: /CRM/ }).first(); if (await crm.count()) { await crm.click().catch(() => {}); await page.waitForTimeout(6000); }
const t = await body(); out.pane = t.split('\n').filter(l => /CRM Contact|Loading|cannot open|No access|permission|Could not load/i.test(l)).slice(0, 6);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-25_retest-mahmoudmohamed-r4/screenshots/raw/2407-02-agent-default-access.png' });
return out;
