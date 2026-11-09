const o={};await openTab('');await pick('QA AS6 Dept B');await page.waitForTimeout(1500);
o.controls=await page.locator('main button:visible,main [role=combobox]:visible,main select:visible').evaluateAll(e=>e.map(x=>(x.innerText||x.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,14));
const f=page.getByRole('button',{name:/all (skill )?types|skill type/i}).first();o.filterBtn=await f.count();if(o.filterBtn){await f.click({timeout:8000});await page.waitForTimeout(1200);o.filterOpts=await page.locator('[role=option],[role=menuitem],[role=menuitemcheckbox]').evaluateAll(e=>e.map(x=>x.innerText.trim()));await page.screenshot({path:S+'c13-filter.png'});}
const au=await api('GET','/audit/events?app_key=desk&limit=100');const ev=((au.j&&au.j.data)||[]).filter(e=>/skill_type/i.test(JSON.stringify(e))).slice(0,2);o.audit=ev.map(e=>JSON.stringify(e).slice(0,420));
return o;
