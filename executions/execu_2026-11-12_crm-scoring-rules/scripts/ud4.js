async (page) => { const EV='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_crm-scoring-rules/evidence/desk-perm/';
 const out={}; const key=page.locator('button, a').filter({has:page.locator('svg')}).and(page.locator('[aria-label], [title]')); out.icons=await page.locator('[aria-label], [title]').evaluateAll(e=>e.filter(x=>x.getBoundingClientRect().top>180&&x.getBoundingClientRect().top<230).map(x=>(x.getAttribute('aria-label')||x.getAttribute('title'))+'|'+x.tagName+'|'+(x.getAttribute('href')||'')));
 await page.mouse.click(1209,204); await page.waitForTimeout(6000); out.url=page.url(); const t=(await page.innerText('body')).replace(/\s+/g,' '); out.text=t.slice(0,250)+' ... '+t.slice(-300); await page.screenshot({path:EV+'d3-key-click.png'});
 // expand hierarchy
 await page.goto('https://staging-desk.taviportal.com/settings/users-control/profiles'); await page.waitForTimeout(6000); await page.getByText('Expand all').click().catch(()=>{}); await page.waitForTimeout(1500); out.tree=(await page.innerText('main').catch(()=>'')).replace(/\s+/g,' ').slice(0,600); await page.screenshot({path:EV+'d4-expanded.png'});
 return out; }
