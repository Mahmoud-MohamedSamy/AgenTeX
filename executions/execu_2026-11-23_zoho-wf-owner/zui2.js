eval(require('fs').readFileSync('zlib.js', 'utf8'));
await openWizard('QA ZWF edit probe'); await shot('zui2-1-exec');
await F().getByText('Edit', { exact: true }).first().click(); await sleep(1200); await shot('zui2-2-edit');
await next(); out.crit = await until(/3 Criteria/, 60); await sleep(2500); await shot('zui2-3-criteria');
const f = F(); out.critHtml = (await f.locator('body').innerHTML()).match(/.{0,200}Select field.{0,600}/s)?.[0]?.replace(/\s+/g, ' ').slice(0, 900);
await f.getByText('--Select field--').first().click().catch(e => out.selErr = String(e.message).slice(0, 120)); await sleep(2000); await shot('zui2-4-fieldlist');
out.afterClick = (await body(f)).replace(/^.*?3 Criteria/, '3 Criteria').slice(0, 600);
