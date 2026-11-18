await page.goto(H + '/settings/customization/notifications', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await text(); if (/Agent Notifications/.test(t)) break; }
await page.locator('select').first().selectOption({label:'QA RT19 NTF Dept'});await sleep(5000);
const row=async(sec,name)=>{const s=page.getByRole('combobox',{name:sec+' — Template: '+name});const r=s.locator('xpath=ancestor::*[self::tr or self::li or contains(@class,"row")][1]');return (await r.innerText().catch(()=>'')).replace(/\s+/g,' ');};
const o={closing:await row('Contact Notifications','Closing a ticket'),assign:await row('Agent Notifications','Assigning a ticket'),comment:await row('Agent Notifications','Adding a comment'),team:await row('Team Notifications','Assigning a ticket')};
await page.getByText('Contact Notifications',{exact:false}).first().scrollIntoViewIfNeeded();await sleep(800);await shot('3053-1-closing-off-never-saved.png');
await page.getByText('Agent Notifications',{exact:false}).first().scrollIntoViewIfNeeded();await sleep(800);await shot('2864-1-agent-rules-default-builtin.png');
await page.getByText('Team Notifications',{exact:false}).first().scrollIntoViewIfNeeded();await sleep(800);await shot('2864-2-team-rules-default-builtin.png');
return o;
