const TK='d120a6c2-2596-4254-968b-a1bcd3a000bf';
await page.goto(H+'/modules/'+TK+'/records/new',{waitUntil:'domcontentloaded'}); await page.waitForSelector('[data-rule-field]',{timeout:40000}).catch(()=>{}); await sleep(3000);
log('dept label', (await page.locator('[data-rule-field="department"]').innerText()).replace(/\s+/g,' '));
const opts=async()=>{ await page.locator('[data-rule-field="owner"] button').first().click(); await sleep(2500); const o=await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(800); return o.map(s=>s.replace(/\s+/g,' ').trim()); };
const before=await opts(); log('owners before', before.length, before.slice(0,6));
await page.locator('[data-rule-field="department"] button').first().click(); await sleep(1200); const s=page.locator('input[placeholder*="Search" i]').last(); if(await s.isVisible().catch(()=>false)) await s.fill('QA AO Dept A'); await sleep(1200); await page.getByRole('option',{name:'QA AO Dept A',exact:true}).first().click(); await sleep(2000);
const after=await opts(); log('owners after Dept A', after.length, after);
await page.locator('[data-rule-field="owner"] button').first().click(); await sleep(2000); await shot('2635-5-task-owner-deptA.png'); await page.keyboard.press('Escape');
