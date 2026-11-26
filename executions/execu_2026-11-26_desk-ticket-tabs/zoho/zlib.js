var F = () => page.frames().find(f => /ShowHomePage/.test(f.url()));
var until = async (re, sec = 60) => { for (let k = 0; k < sec; k++) { const f = F(); if (f && re.test(await body(f))) return true; await sleep(1000); } return false; };
var notNow = async () => { for (const t of ['Not Now']) { const nn = page.getByText(t, { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {}); } await page.keyboard.press('Escape').catch(() => {}); };
var api = (m, p, b) => page.evaluate(async ([m, p, b]) => { const csrf = (document.cookie.match(/crmcsr=([^;]+)/) || [])[1]; const r = await fetch(p, { method: m, headers: { 'X-ZCSRF-TOKEN': 'crmcsrfparam=' + csrf, orgId: '946801013', 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined, credentials: 'include' }); return { s: r.status, t: await r.text() }; }, [m, p, b]);
var B = '/supportapi/zd/techegysolutions/api/v1/', D = '1499272000000432293';
var next = async () => { await F().locator('button:has-text("Next"), input[value="Next"], span:text-is("Next")').locator('visible=true').first().click(); };
var openWizard = async name => { const wf = page.getByText('Workflows', { exact: true });
  for (let a = 0; a < 4; a++) { await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {}); try { await wf.first().waitFor({ timeout: 120000 }); break; } catch (e) { await shot('setup-fail-' + a); } }
  await sleep(4000); await notNow(); await wf.first().click(); if (!(await until(/Create Rule|Workflow Rules/, 90))) throw new Error('rules list did not load');
  await sleep(3000); const box = await page.getByText('Rules', { exact: true }).first().boundingBox(); await page.mouse.click(181, box.y + box.height / 2);
  if (!(await until(/Basic Information/, 90))) throw new Error('wizard did not open'); await sleep(3000);
  await page.keyboard.press('Escape'); await sleep(500); await page.mouse.click(497, 325); await sleep(500); await page.keyboard.type(name); await sleep(800); await shot('wiz-name');
  await next(); if (!(await until(/Execute on/, 60))) throw new Error('step 2 did not open'); await sleep(2500); };
