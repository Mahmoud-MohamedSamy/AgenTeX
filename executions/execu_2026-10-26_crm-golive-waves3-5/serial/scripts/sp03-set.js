const K = 'iam.security.session.max_concurrent', get = async () => (await call('GET', `/settings/resolved?app_key=iam&key=${K}&scope_type=Org`)).j.data;
const v0 = await get(); const p = await call('PUT', '/settings/values', { app_key: 'iam', key: K, scope_type: 'Org', scope_id: null, value_json: '25', expected_version: v0.version });
const v1 = await get(); await page.goto('https://staging-crm.taviportal.com/settings/security/policies', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/serial/evidence/raw/t-sp03-25.png' });
const txt = (await page.innerText('body')).replace(/\s+/g, ' '); const m = txt.match(/.{0,80}(concurrent|sessions).{0,80}/i);
return { before: v0.value_json, put: p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 150) : ''), after: v1.value_json, screen: m && m[0], ownerStillWorks: (await call('GET', '/iam/me/profile')).s };
