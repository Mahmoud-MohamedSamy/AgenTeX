const R={muts:[],step:[]};page.on('request',q=>{const u=q.url();if(/\/api\/v1\/desk\/(skill|agent-skill)/.test(u)&&q.method()!=='GET')R.muts.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,'')+' '+(q.postData()||'').slice(0,300));});
try{
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'});await page.getByText('tier_1_support').first().waitFor({timeout:90000});await sleep(3000);R.step.push('list');
await page.getByText('QA RT21 SK 3116 ok').first().click({timeout:15000});await sleep(3000);R.step.push('opened');
await page.getByText('ndc-staging-owner',{exact:true}).last().click({timeout:15000});await sleep(800);R.step.push('ticked');
await page.getByRole('button',{name:'Save',exact:true}).last().click({timeout:15000});await sleep(4000);R.step.push('saved');
await page.getByText('Agent Skills',{exact:true}).first().click({timeout:15000});await sleep(5000);R.step.push('tab');
const pens=page.locator('main button:has(svg)');R.pens=await pens.count();
await page.locator('div:has(> div > span:text-is("ndc-staging-owner")) button, div:has(span:text-is("ndc-staging-owner")) > button').last().click({timeout:15000});await sleep(2500);R.step.push('pen');await shot('3116-r1-c-agent-edit.png',{timeout:90000});
await page.getByText('QA RT21 SK 3116 ok',{exact:true}).last().click({timeout:15000});await sleep(800);R.step.push('untick');
await page.getByRole('button',{name:/^Save/}).last().click({timeout:15000});await sleep(4000);R.step.push('saved2');
}catch(e){R.err=e.message.slice(0,150);await shot('3116-r1-dbg.png',{timeout:60000}).catch(()=>{});}
return R;
