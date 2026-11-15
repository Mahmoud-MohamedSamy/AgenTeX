const MID='841043e1-c078-41f9-8d6e-dfd61bee45c3', LID='c5bbf73c-0a86-48b4-a8bc-4f394b4e11e5'; const R={posts:[]};
page.on('response', async r => { if (r.request().method()==='POST' && /\/records(\?|$)/.test(r.url())) R.posts.push(r.status()+' '+(await r.text().catch(()=>'')).replace(/"ruleId":"[^"]+",/g,'').slice(0,500)); });
await page.goto(H+'/modules/'+MID+'/records/new?layout='+LID,{waitUntil:'domcontentloaded'}); await page.waitForSelector('[data-rule-field]',{timeout:30000}).catch(()=>{}); await sleep(3000);
await page.locator('[data-rule-field="first_name"] input').first().fill('QA RT18 3021 two ui2');
const ln=page.locator('[data-rule-field="last_name"] input').first(); if(await ln.count()) await ln.fill('3021 two ui2');
const tx=page.locator('[data-rule-field="qa_rt18v_text"] input').first(); await tx.scrollIntoViewIfNeeded(); await tx.fill('BAD ui');
const pk=page.locator('[data-rule-field="qa_rt18v_pick"]').first(); await pk.scrollIntoViewIfNeeded(); await pk.locator('button[role=combobox]').first().click(); await sleep(600); await page.getByRole('option',{name:'Reject',exact:true}).first().click(); await sleep(800);
await page.getByRole('button',{name:/^Save$/}).last().click(); await sleep(5000);
const cnt=async s=>page.evaluate(s=>[...document.querySelectorAll('body *')].filter(e=>e.childElementCount===0&&(e.innerText||'').includes(s)&&e.getBoundingClientRect().height>0).length, s);
R.e2=await cnt('E2 pick cannot be Reject'); R.text=await cnt('text cannot start with BAD');
await shot('3021-1-two-rules-field.png'); const top=page.getByText('E2 pick cannot be Reject').first(); if(await top.count()){ await top.scrollIntoViewIfNeeded(); await sleep(600);} R.topInfo=await page.evaluate(()=>{const e=[...document.querySelectorAll('body *')].find(e=>e.childElementCount===0&&(e.innerText||'').includes('E2 pick cannot be Reject')); if(!e) return null; const b=e.closest('[role=alert],[aria-live]'); const r=e.getBoundingClientRect(); return {top:Math.round(r.top),left:Math.round(r.left),live:b&&b.getAttribute('role'), txt:(e.closest('[role=alert]')||e.parentElement).innerText.slice(0,300)};}); await shot('3021-2-two-rules-top.png');

R.url=page.url().slice(-40); return R;
