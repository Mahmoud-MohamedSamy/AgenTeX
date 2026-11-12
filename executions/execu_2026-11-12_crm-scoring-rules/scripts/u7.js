async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; await page.getByRole('button',{name:/^EN/}).first().click(); await page.waitForTimeout(800); out.langs=(await page.locator('[role=menuitem], [role=option], [role=menuitemradio]').allInnerTexts()).join('|');
 await page.locator('[role=menuitem], [role=option], [role=menuitemradio]').filter({hasText:/عرب|Arabic/}).first().click(); await page.waitForTimeout(4000);
 out.dir=await page.evaluate(()=>document.documentElement.dir); const main=(await page.locator('main').innerText()); const tail=main.slice(main.indexOf('QA')-700);
 out.list=tail.replace(/\s+/g,' ').slice(0,700); out.latin=(main.match(/[A-Za-z][A-Za-z ]{6,}/g)||[]).filter(s=>!/QA SR1112|ndc-staging|Leads/.test(s)).slice(0,30);
 await page.screenshot({path:EV+'u7-ar-list.png'});
 await page.getByRole('button',{name:/قاعدة|Scoring Rule/}).filter({hasText:/جديد|New/}).first().click().catch(()=>{}); await page.waitForTimeout(2500);
 const d=page.getByTestId('scoring-rule-drawer'); if(await d.count()){out.drawer=(await d.innerText()).replace(/\s+/g,' ').slice(0,700); out.drawerLatin=((await d.innerText()).match(/[A-Za-z][A-Za-z ]{6,}/g)||[]).slice(0,20); await page.screenshot({path:EV+'u7-ar-drawer.png'}); await page.keyboard.press('Escape');}
 return out; }
