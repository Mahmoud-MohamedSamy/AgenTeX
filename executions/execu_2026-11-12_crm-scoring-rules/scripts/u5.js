async (page, ctx) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const toast=async()=>{await page.waitForTimeout(1500);return (await page.locator('[role=status], [role=alert]').allInnerTexts()).join('|').slice(-200);};
 // B6 toggle
 const tg=page.getByRole('switch',{name:/Active: QA SR1112 UI Web/}); await tg.click(); out.off=await toast(); await tg.click(); out.on=await toast();
 // C13 edit + H1 conflict: open edit in page, open same in second page and save there first
 const row=page.getByRole('row').filter({hasText:'QA SR1112 UI Web'}); await row.getByRole('button',{name:/Actions for/}).click(); await page.waitForTimeout(600);
 out.menu=(await page.locator('[role=menuitem]').allInnerTexts()).join('|'); await page.getByRole('menuitem',{name:'Edit'}).click(); await page.waitForTimeout(2000);
 const d=page.getByTestId('scoring-rule-drawer'); out.editTitle=(await d.innerText()).slice(0,40).replace(/\s+/g,' ');
 const p2=await ctx.newPage(); await p2.goto(page.url()); await p2.waitForTimeout(6000);
 const r2=p2.getByRole('row').filter({hasText:'QA SR1112 UI Web'}); await r2.getByRole('button',{name:/Actions for/}).click(); await p2.getByRole('menuitem',{name:'Edit'}).click(); await p2.waitForTimeout(2000);
 const d2=p2.getByTestId('scoring-rule-drawer'); await d2.locator('[aria-label="Points of entry 1"]').fill('15'); await d2.getByRole('button',{name:/^Save$/}).click(); await p2.waitForTimeout(2500); out.tab2=(await p2.locator('[role=status], [role=alert]').allInnerTexts()).join('|').slice(-120); await p2.close();
 await d.locator('[aria-label="Points of entry 1"]').fill('20'); await d.getByRole('button',{name:/^Save$/}).click(); await page.waitForTimeout(2500);
 out.conflict=(await d.innerText().catch(()=>'')).match(/Another admin[^.]*\.|Load their version/g); await page.screenshot({path:EV+'u5-conflict.png'});
 const rl=d.getByRole('button',{name:/Load their version/}); if(await rl.count()){await rl.click(); await page.waitForTimeout(2000); out.reloaded=await d.locator('[aria-label="Points of entry 1"]').inputValue(); await d.locator('[aria-label="Points of entry 1"]').fill('20'); await d.getByRole('button',{name:/^Save$/}).click(); out.saveAfter=await toast();}
 await page.waitForTimeout(1500); out.points=(await page.getByRole('row').filter({hasText:'QA SR1112 UI Web'}).innerText()).replace(/\s+/g,' ');
 // C17 close without saving
 await page.getByRole('row').filter({hasText:'QA SR1112 UI Web'}).getByRole('button',{name:/Actions for/}).click(); await page.getByRole('menuitem',{name:'Edit'}).click(); await page.waitForTimeout(1500);
 await d.locator('[aria-label="Points of entry 1"]').fill('99'); await page.keyboard.press('Escape'); await page.waitForTimeout(1200); out.afterEsc={drawerOpen:await d.isVisible().catch(()=>false), dialog:(await page.locator('[role=dialog], [role=alertdialog]').allInnerTexts()).join('|').slice(0,150)};
 if(await d.isVisible().catch(()=>false)){const c=d.getByRole('button',{name:/^Cancel$/}); if(await c.count()) await c.click(); await page.waitForTimeout(800);}
 out.pointsAfterEsc=(await page.getByRole('row').filter({hasText:'QA SR1112 UI Web'}).innerText()).replace(/\s+/g,' ');
 return out; }
