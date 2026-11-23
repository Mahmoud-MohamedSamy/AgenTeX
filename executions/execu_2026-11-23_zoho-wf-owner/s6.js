const F = () => page.frames().find(f => /ShowHomePage/.test(f.url()));
const until = async (re, sec = 60) => { for (let k = 0; k < sec; k++) { const f = F(); if (f && re.test(await body(f))) return true; await sleep(1000); } return false; };
const notNow = async () => { const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {}); };
const next = async () => { const b = F().locator('button:has-text("Next"), input[value="Next"], span:text-is("Next")').locator('visible=true'); out['nextCount' + Object.keys(out).length] = await b.count(); await b.first().click(); };
const wf = page.getByText('Workflows', { exact: true }); out.tries = 0; for (let a = 0; a < 3; a++) { out.tries++; await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {}); try { await wf.first().waitFor({ timeout: 150000 }); break; } catch (e) { await shot('load-fail-' + a); } } await sleep(3000); await notNow();
await wf.first().click(); out.list = await until(/Create Rule|Workflow Rules/);
const box = await page.getByText('Rules', { exact: true }).first().boundingBox(); await page.mouse.click(181, box.y + box.height / 2);
out.form = await until(/Basic Information/); await sleep(2000);
await page.mouse.click(497, 325); await page.keyboard.type('QA tmp owner check'); await sleep(800);
await next(); out.s2 = await until(/Execute on/); await sleep(2500);
await F().getByText('Create', { exact: true }).first().click(); await sleep(1000); await shot('5b-create-ticked');
await next(); out.s3 = await until(/3 Criteria/); await sleep(2500); await shot('6b-criteria');
await page.mouse.click(324, 842); out.s4 = await until(/All Actions/); if (!out.s4) { await page.mouse.click(324, 842); out.s4b = await until(/All Actions/); out.s4 = out.s4b; } await sleep(3000); await notNow(); await shot('7b-actions');
if (out.s4) { await page.mouse.click(1297, 526); out.menu = await until(/Assign Ticket/, 20); await sleep(1500); await shot('8b-action-menu');
  await F().getByText('Assign Ticket', { exact: true }).locator('visible=true').first().click(); await sleep(6000); await notNow(); await shot('9-assign-ticket');
  out.assign = (await body(F())).replace(/^.*?All Actions/, 'All Actions').slice(0, 1200);
  const dd = F().locator('select, [role=combobox], .zdselect, input[readonly]').locator('visible=true'); out.dd = await dd.count(); }
if (out.assign) { const f = F(); const dd = f.locator('[placeholder="Select Assignee"]').or(f.getByText('Select Assignee')).locator('visible=true'); out.ddFound = await dd.count();
  if (out.ddFound) { await dd.first().click(); await sleep(3000); await shot('10-assignee-options');
    out.optList = (await f.locator('li').locator('visible=true').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 25);
    out.opts = (await body(f)).replace(/^.*?Assign Ticket/, 'Assign Ticket').slice(0, 500);
    await page.keyboard.press('Escape'); await sleep(800); await f.getByText('Cancel', { exact: true }).locator('visible=true').first().click().catch(() => {}); await sleep(3000); await shot('11-cancelled'); }
  else { out.html = (await f.locator('body').innerHTML()).match(/.{0,300}Assignee.{0,500}/s)?.[0]?.replace(/s+/g, ' ').slice(0, 900); } }
