await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/usermanagement/agents', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(9000);
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
await page.getByText('test agent 2', { exact: true }).first().click().catch(e => out.e = e.message.slice(0, 60)); await page.waitForTimeout(6000);
out.u = page.url(); out.t = (await body(page)).replace(/\s+/g, ' ').match(/.{0,100}(Role|Permission).{0,400}/)?.[0]; await shotZ(page, 'ac2-agent2-detail');
