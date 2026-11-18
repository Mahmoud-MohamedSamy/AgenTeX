await page.getByText('Not Now').first().click({ timeout: 3000 }).catch(()=>{});
await page.getByText(/^Advanced Web Form$/).first().click(); await page.waitForTimeout(12000);
out.url = page.url(); out.frames = page.frames().map(f => f.url().slice(0, 120));
const fr = page.frames().find(f => /webform|WebForm|setup/i.test(f.url()) && f !== page.mainFrame());
const t = fr ? (await fr.innerText('body').catch(() => '')) : await body(page); out.txt = t.replace(/\s+/g, ' ').slice(0, 1500);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-webforms2.png' });
