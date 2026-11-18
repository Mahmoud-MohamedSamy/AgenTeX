await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded'});await sleep(10000);
const pickDept=async name=>{const dd=page.locator('text=Department').locator('xpath=ancestor::*[self::div][2]').first();
 await page.getByText(/Select department…|QA SK13 Dept A|QA RT19 SK Dept|Sales/).first().click();await sleep(1200);
 const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill(name).catch(()=>{});await sleep(1200);}
 await page.locator('[role=option]').filter({hasText:new RegExp('^\s*'+name+'\s*$')}).first().click();await sleep(2500);};
const lab=page.getByText(/^Skills$/).first();
const chips=async()=>{const bb=await lab.boundingBox();const els=await page.locator('button, [role=option], [role=checkbox], span').evaluateAll((L,b)=>L.filter(e=>{const r=e.getBoundingClientRect();return r.y>b.y-10&&r.y<b.y+400&&r.x>b.x+30&&e.children.length===0&&e.innerText.trim();}).map(e=>{const s=getComputedStyle(e.closest('button,[role=option],[role=checkbox]')||e);return e.innerText.trim()+(/(37, 99, 235|29, 78, 216|59, 130, 246)/.test(s.backgroundColor)?' [SELECTED]':'');}),bb);return [...new Set(els)];};
const R={};
await pickDept('QA RT19 SK Dept');await lab.scrollIntoViewIfNeeded();await sleep(800);R.sk=await chips();
await shot('2933-1-new-ticket-skills-own-dept.png');
// html of skills control for structure
R.html=(await page.evaluate(()=>{const l=[...document.querySelectorAll('label,div,span')].find(e=>e.innerText&&e.innerText.trim()==='Skills');const c=l&&l.parentElement&&l.parentElement.parentElement;return c?c.outerHTML.slice(0,1500):'';}));
return R;
