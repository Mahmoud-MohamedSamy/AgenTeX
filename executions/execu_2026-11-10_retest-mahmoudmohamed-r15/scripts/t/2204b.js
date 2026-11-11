await page.goto(H + '/settings/roles', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/CEO/.test(await text())) break; } await sleep(2000);
let t = await text(); log('ROLES PAGE', t.slice(t.indexOf('Roles', 1500), t.indexOf('Roles',1500)+800)); await shot('2204-desk-roles.png');
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (k.startsWith('workflow-rule-draft')) localStorage.removeItem(k); });
await page.goto(H + '/settings/automation/workflow-rules/new?moduleId=88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/This rule will be executed|Add action/.test(await text())) break; }
const sf = page.getByRole('button', {name:'Start fresh'}); if (await sf.count()) { await sf.click(); await sleep(2000); }
await page.getByText('Add action').first().click(); await sleep(1500);
await page.getByText(/^Owner Assignment/).first().click(); await sleep(2500);
await shot('2204-owner-assign.png');
const tabs = await page.$$eval('[role=tab], button', bs => bs.map(b=>b.innerText.trim()).filter(x=>/^(Users|Roles|Profiles|User Fields|Teams)$/.test(x))); log('tabs', tabs);
await page.getByRole('button', {name:'Roles', exact:true}).or(page.getByRole('tab', {name:'Roles', exact:true})).first().click(); await sleep(1500);
const sel = page.getByText(/^Select…$|^Select\.\.\.$|^Select$/).last(); await sel.click().catch(()=>{}); await sleep(1500);
t = await text(); log('after roles', t.slice(-1500)); await shot('2204-roles-list.png');
