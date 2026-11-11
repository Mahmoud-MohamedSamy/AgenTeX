// T-24 one file at a time with network capture: png, pdf, exe, small txt; then 10 files at once (FILES env).
const L=require('./lib');const F='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad/files/';
module.exports=async()=>{const R={log:[]};pg.on('requestfailed',r=>{if(/s3|files/.test(r.url()))R.log.push('FAILED '+r.method()+' '+r.url().slice(0,80)+' '+(r.failure()||{}).errorText);});const {id}=JSON.parse(require('fs').readFileSync(OUT+'/t24.json'));
 pg.on('response',async r=>{const u=r.url();if(r.request().method()!=='GET'&&/(file|upload|attach|storage|blob|s3)/i.test(u)){let b='';try{b=(await r.text()).slice(0,160);}catch(e){}R.log.push(r.request().method()+' '+r.status()+' '+u.replace(H,'').slice(0,90)+' '+b);}});
 const toast=async()=>{let s='';for(let i=0;i<30&&!s;i++){await pg.waitForTimeout(500);s=await pg.evaluate(()=>[...document.querySelectorAll('[data-sonner-toast],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));}return s;};
 const list=async()=>arr(((await api('GET','/desk/tickets/'+id+'/attachments')).j||{}).data).map(f=>f.file_name);
 await L.gotoTicket(id);const a=pg.locator('[role=tab]').filter({hasText:/attachment/i}).first();await a.click();await pg.waitForTimeout(3000);
 const groups=process.env.FILES?[process.env.FILES.split('|')]:[['qa-man-small.txt'],['qa-man-photo.png'],['qa-man-doc.pdf'],['qa-man-setup.exe']];
 R.res=[];for(const g of groups){const inp=pg.locator('main input[type=file]').first();await inp.setInputFiles(g.map(f=>F+f));const t=await toast();for(let i=0;i<150;i++){await pg.waitForTimeout(1000);const p=await pg.evaluate(()=>document.body.innerText);if(!/Uploading/.test(p))break;}await pg.waitForTimeout(2000);R.res.push({files:g.join(','),toast:t,stored:await list()});await pg.evaluate(()=>document.querySelectorAll('[data-sonner-toast] button').forEach(b=>b.click()));await pg.waitForTimeout(1500);}
 await L.shot('t24-c-list');return R;};
