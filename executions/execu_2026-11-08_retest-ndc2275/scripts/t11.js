// Import through the wizard twice: automation off / on, rows with no owner. Bounded waits.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t11.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
await page.setViewportSize({width:1600,height:1100});
const body0=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const clk=async re=>{const b=page.getByRole('button',{name:re}).last();await b.click({timeout:15000});await page.waitForTimeout(5000);};
const find=async sub=>{for(let pg=1;pg<=3;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100&sort=-created_at');for(const x of arr(r.j&&r.j.data)){const o=fl(x);if(String(o.subject)===sub)return o;}}return null;};
const run=async(file,auto,tag,subs)=>{const x={};
 await page.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});for(let i=0;i<30;i++){await page.waitForTimeout(3000);if(/Start import/i.test(await body0()))break;}
 await page.locator('input[type=file]').nth(1).setInputFiles(OUT+'/../evidence/'+file,{timeout:20000});await page.waitForTimeout(6000);
 const so=page.getByRole('button',{name:/^Start over$/});if(await so.count()){x.startOver=true;await so.first().click({timeout:8000});await page.waitForTimeout(5000);const inp=page.locator('input[type=file]');if(await inp.count()){await inp.last().setInputFiles(OUT+'/../evidence/'+file,{timeout:20000});await page.waitForTimeout(5000);}}
 await page.screenshot({path:RAW+tag+'-1.png'});
 await clk(/^Next$/);await clk(/^Next$/);await clk(/^Next$/);
 if(auto){await page.getByRole('checkbox').first().check({timeout:8000}).catch(async()=>{await page.getByText('Trigger automation and process management').click();});x.checked=true;await page.waitForTimeout(800);}
 await clk(/^Save & next$/);
 await page.getByText('I confirm I have permission').click({timeout:10000});await page.waitForTimeout(800);const sb=page.getByRole('button',{name:/^Submit$/}).last();const t1=Date.now();while(Date.now()-t1<30000&&await sb.isDisabled().catch(()=>true))await page.waitForTimeout(1500);
 await page.screenshot({path:RAW+tag+'-review.png'});x.submitEnabled=!(await sb.isDisabled().catch(()=>true));x.summary=(await body0()).match(/File .{0,260}/)?.[0];save();
 await sb.click({timeout:15000});const t0=Date.now();let t='';while(Date.now()-t0<70000){await page.waitForTimeout(3000);t=await body0();if(/(records? (created|added)|created \d|added \d|\d+ (created|added|imported)|Undo|complete)/i.test(t.slice(-900))&&!/Review and submit/.test(t))break;}
 x.result=t.slice(-420);await page.screenshot({path:RAW+tag+'-result.png'});save();await W(6000);
 x.tickets=[];for(const s of subs){const o=await find(s);if(o){LED('ticket "'+s+'" '+o.id+' import');x.tickets.push({s:s.slice(13),no:o.ticket_number,owner:nm(o.owner),auto:(await act(o.id)).filter(a=>a.action==='ticket.auto_assigned').map(a=>a.summary.rule_name)});}else x.tickets.push({s,notFound:true});}
 return x;};
try{R.autoOff=await run('impA.csv',false,'impA',[PX+' RT15SEQ impA no owner',PX+' RT15NOMATCH impA no owner']);}catch(e){R.autoOffErr=String(e.message).slice(0,240);await page.screenshot({path:RAW+'impA-err.png'});}save();
try{R.autoOn=await run('impB.csv',true,'impB',[PX+' RT15SEQ impB no owner',PX+' RT15NOMATCH impB no owner']);}catch(e){R.autoOnErr=String(e.message).slice(0,240);await page.screenshot({path:RAW+'impB-err.png'});}save();
return 'ok';
