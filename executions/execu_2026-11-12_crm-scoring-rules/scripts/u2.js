async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/';
 const out={}; const box=await page.locator('main button, main [role=combobox]').evaluateAll(els=>els.map(e=>(e.getAttribute('role')||e.tagName)+':'+(e.getAttribute('aria-label')||'')+':'+e.innerText.trim().slice(0,30)));
 out.controls=box.slice(0,12);
 const pk=page.locator('main [aria-label="Module"], main [role=combobox]').first(); await pk.click(); await page.waitForTimeout(1500);
 out.modules=(await page.locator('[role=option], [role=listbox] li').allInnerTexts()).join('|');
 await page.screenshot({path:EV+'u2-modules.png'}); await page.keyboard.press('Escape'); return out; }
