const o = {};
await page.goto(H + '/settings/automation/workflow-rules/8c218015-630e-4f71-bc81-d902029863db', { waitUntil: 'commit' }); await page.getByText('QA RT27 3230').first().waitFor({ timeout: 120000 }).catch(() => o.err = 'not loaded'); await sleep(4000);
o.text = (await page.locator('main').first().innerText()).replace(/^[\s\S]*?Email Providers\n/, '').slice(0, 2000);
o.buttons = (await page.locator('main').getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean))).filter(t => !/^(Setup Home|GENERAL|USER MANAGEMENT|CHANNELS|SELF SERVICE|CUSTOMIZATION|AUTOMATION|DATA ADMINISTRATION|COLLABORATION|INTEGRATIONS)$/.test(t)).slice(-40);
await shot('3230-editor');
return o;
