const {execFileSync}=require('child_process');const W='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/scripts';
const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
R.before=execFileSync('bash',['x56/runo.sh','t3007.js'],{cwd:W,encoding:'utf8'}).replace(/\s+/g,' ').slice(-200);
await page.goto(H+'/views/all/tickets/99728d5a-748a-4e4a-a171-4a4e9d641a0c',{waitUntil:'commit'});await page.getByText('QA RT22 3007 customer question').first().waitFor({timeout:120000});await sleep(5000);
await page.getByRole('button',{name:/Post reply to forum/}).first().click({timeout:15000});await sleep(2500);await shot('3007-r1-b-forum-composer.png',{timeout:90000});
await page.mouse.click(1130,450);await sleep(300);await page.keyboard.type('QA RT22 3007 agent answer posted from the ticket');await sleep(500);
const send=page.getByRole('button',{name:'Post',exact:true}).first();R.sendLabel=await send.innerText().catch(()=>'?');await send.click({timeout:10000});await sleep(6000);await shot('3007-r1-c-after-post.png',{timeout:90000});
R.after=execFileSync('bash',['x56/runo.sh','t3007.js'],{cwd:W,encoding:'utf8'}).replace(/\s+/g,' ').slice(-300);return R;
