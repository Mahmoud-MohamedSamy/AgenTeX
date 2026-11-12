async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.locator('input').filter({hasNot:page.locator('[type=search]')}).nth(1).fill('QA SR1112 Lead form').catch(()=>{});
 await page.mouse.click(580,321); await page.keyboard.type('QA SR1112 Lead form');
 await page.mouse.click(580,391); await page.waitForTimeout(1200); out.opts=(await page.locator('[role=option], [role=menuitem], li').allInnerTexts()).filter(s=>s.trim()).slice(0,25);
 const lo=page.locator('[role=option], [role=menuitem], li').filter({hasText:/^Leads$/}).first(); if(await lo.count()) await lo.click(); await page.waitForTimeout(2000);
 await page.mouse.click(580,485); await page.waitForTimeout(1200); out.lays=(await page.locator('[role=option], [role=menuitem]').allInnerTexts()).slice(0,15);
 const st=page.locator('[role=option], [role=menuitem]').filter({hasText:/^Standard$/}).first(); if(await st.count()) await st.click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
 await page.screenshot({path:EV+'uw3-setup.png'}); return out; }
