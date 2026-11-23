const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(require('fs').readFileSync('vr/ids.json','utf8')); const R={}; try {
await page.goto(H+'/modules/'+T+'/records/new?layout='+I.layout,{waitUntil:'domcontentloaded'}); await page.waitForSelector('[data-rule-field]',{timeout:90000}); await sleep(4000);
for(let k=0;k<3;k++){ await page.locator('[data-rule-field="department"] button').first().click(); await sleep(1500); const si=page.locator('input[placeholder*="Search" i]').last(); if(await si.isVisible().catch(()=>false)){ await si.fill('QA AO Dept A'); await sleep(1500);} await page.getByRole('option',{name:'QA AO Dept A',exact:true}).first().click({timeout:8000}).catch(()=>{}); await sleep(4000); if(await page.locator('[data-rule-field="qa_rt20vr_type"]').count()) break; await page.keyboard.press('Escape'); }
await page.waitForSelector('[data-rule-field="qa_rt20vr_type"]',{timeout:30000}); await sleep(1500);
const opts=async(field)=>{ await page.locator(`[data-rule-field="${field}"] button`).first().click(); await sleep(1200); const oo=await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); await sleep(500); return oo.map(s=>s.trim()); };
const pick=async(field,opt)=>{ await page.locator(`[data-rule-field="${field}"]`).scrollIntoViewIfNeeded(); await page.locator(`[data-rule-field="${field}"] button`).first().click(); await sleep(1200); await page.getByRole('option',{name:opt,exact:true}).first().click(); await sleep(1500); };
const vis=async(f)=>page.locator(`[data-rule-field="${f}"]`).evaluate(e=>({hidden:e.hidden||!e.offsetParent, label:(e.querySelector('label')||{}).innerText})).catch(()=>'absent');
R.layoutName=(await text()).match(/Create Ticket[^\n]*/)?.[0];
R.before={order:await vis('qa_rt20vr_order'), refundSection: await page.getByText('QA RT20 VR Refund section').isVisible().catch(()=>false)};
await page.locator('[data-rule-field="qa_rt20vr_type"]').scrollIntoViewIfNeeded(); await shot('1988-1a-before.png');
await pick('qa_rt20vr_type','Refund'); R.after={order:await vis('qa_rt20vr_order'), refundSection: await page.getByText('QA RT20 VR Refund section').isVisible().catch(()=>false)};
await page.getByText('QA RT20 VR Refund section').scrollIntoViewIfNeeded().catch(()=>{}); await shot('1988-1b-refund.png');
R.priorityOpts=await opts('priority'); await page.locator('[data-rule-field="priority"]').scrollIntoViewIfNeeded(); await page.locator('[data-rule-field="priority"] button').first().click(); await sleep(1000); await shot('1988-3e-priority-options.png'); await page.keyboard.press('Escape');
await pick('qa_rt20vr_l1','A1'); R.l2opts=await opts('qa_rt20vr_l2'); await page.locator('[data-rule-field="qa_rt20vr_l2"] button').first().click(); await sleep(1000); await shot('1988-5b-l2-options.png'); await page.keyboard.press('Escape'); await sleep(400);
await pick('qa_rt20vr_l2','A2'); await pick('qa_rt20vr_l3','A3'); await pick('qa_rt20vr_l4','A4'); await pick('qa_rt20vr_l5','A5'); await pick('qa_rt20vr_l6','A6'); R.l7opts=await opts('qa_rt20vr_l7');
await page.locator('[data-rule-field="qa_rt20vr_l7"] button').first().click(); await sleep(1000); await shot('1988-5c-l7-options.png'); await page.keyboard.press('Escape'); await sleep(400);
// validation rule message
await page.locator('[data-rule-field="subject"] input').first().fill('QA RT20 VR 1988 UI');
const ord=page.locator('[data-rule-field="qa_rt20vr_order"] input').first(); await ord.scrollIntoViewIfNeeded(); await ord.fill('BAD-ui'); 
await page.getByRole('button',{name:/^Save$/}).last().click(); await sleep(4000);
R.save={orderText:(await page.locator('[data-rule-field="qa_rt20vr_order"]').innerText()).replace(/\s+/g,' '), url:page.url(), alerts:await page.getByRole('alert').allInnerTexts()};
await page.locator('[data-rule-field="qa_rt20vr_order"]').scrollIntoViewIfNeeded(); await shot('1988-2a-vr-refused.png');
} catch(e){ R.err=String(e.message).split('Call log')[0]; await shot('1988-err.png'); } return R;
