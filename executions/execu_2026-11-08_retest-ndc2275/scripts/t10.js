// Import through the wizard twice: automation off / on. Bounded waits.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t10.json',JSON.stringify(R,null,1));const RAW=OUT+'/../screenshots/raw/';
await page.setViewportSize({width:1600,height:1100});
const body0=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const clk=async re=>{const b=page.getByRole('button',{name:re}).last();await b.click({timeout:15000});await page.waitForTimeout(5000);};
const find=async sub=>{for(let pg=1;pg<=3;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100&sort=-created_at');for(const x of arr(r.j&&r.j.data)){const o=fl(x);if(String(o.subject)===sub)return o;}}return null;};
const run=async(file,auto,tag,subs)=>{const x={};
 await page.goto(H+'/settings/data/import?module='+T,{waitUntil:'commit',timeout:120000});for(let i=0;i<30;i++){await page.waitForTimeout(3000);if(/Start import/i.test(await body0()))break;}
 await page.locator('input[type=file]').nth(1).setInputFiles(OUT+'/../evidence/'+file,{timeout:20000});await page.waitForTimeout(6000);
 await clk(/^Next$/);await clk(/^Next$/);await page.screenshot({path:RAW+tag+'-map.png'});await clk(/^Next$/);
 x.assignText=(await body0()).slice(-400);if(auto){await page.getByRole('checkbox').first().check({timeout:8000}).catch(async()=>{await page.getByText('Trigger automation and process management').click();});x.checked=true;await page.waitForTimeout(800);}
 await page.screenshot({path:RAW+tag+'-assign.png'});await clk(/^Save & next$/);await page.waitForTimeout(4000);
 x.review=(await body0()).slice(-700);await page.screenshot({path:RAW+tag+'-review.png'});
 x.btns=await page.$$eval('button',e=>e.filter(b=>b.offsetParent).map(b=>(b.innerText||'').trim()+(b.disabled?' (off)':'')).filter(Boolean).slice(-5));
 const go=page.getByRole('button',{name:/(Start|Run) import|^Import\b|Confirm|Import \d+/i}).last();x.goLabel=await go.innerText().catch(()=>null);
 await go.click({timeout:15000});const t0=Date.now();let t='';while(Date.now()-t0<60000){await page.waitForTimeout(3000);t=await body0();if(/Result/.test(t)&&/(created|added|imported|succeeded|completed|finished)/i.test(t.slice(-700)))break;}
 x.result=t.slice(-600);await page.screenshot({path:RAW+tag+'-result.png'});save();await W(5000);
 x.tickets=[];for(const s of subs){const o=await find(s);if(o){LED('ticket "'+s+'" '+o.id+' import');x.tickets.push({s:s.slice(13),no:o.ticket_number,owner:nm(o.owner),auto:(await act(o.id)).filter(a=>a.action==='ticket.auto_assigned').map(a=>a.summary.rule_name)});}else x.tickets.push({s,notFound:true});}
 return x;};
try{R.autoOff=await run('import.csv',false,'imp-off',[PX+' RT15SEQ import no owner',PX+' RT15NOMATCH import no owner',PX+' RT15SEQ import with owner']);}catch(e){R.autoOffErr=String(e.message).slice(0,240);await page.screenshot({path:RAW+'imp-off-err.png'});}save();
try{R.autoOn=await run('import2.csv',true,'imp-on',[PX+' RT15SEQ import2 no owner',PX+' RT15NOMATCH import2 no owner',PX+' RT15SEQ import2 with owner']);}catch(e){R.autoOnErr=String(e.message).slice(0,240);await page.screenshot({path:RAW+'imp-on-err.png'});}save();
return 'ok';
