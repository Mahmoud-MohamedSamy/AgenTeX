const F = () => page.frames().find(f => /ShowHomePage/.test(f.url()));
await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 });
const wf = page.getByText('Workflows', { exact: true }); await wf.first().waitFor({ timeout: 150000 }); await sleep(3000);
await wf.first().click(); for (let k = 0; k < 60; k++) { const f = F(); const t = f ? await body(f) : ''; if (/Create Rule|Workflow Rules/.test(t)) { out.rules = t.replace(/^.*?Workflow Rules/, 'Workflow Rules').slice(0, 300); break; } await sleep(1000); }
await shot('12-rules-after');
