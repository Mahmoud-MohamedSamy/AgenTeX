// Shared helpers for ms-*.js modules (globals from ms.js: api, pg, H, OUT, arr, fl, W, LED, IDS, T).
const fs=require('fs'),path=require('path');
const MB=path.join('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/a17cf060-bd19-487d-b9db-8f4190183934/scratchpad','ms-mailboxes.json'); // outside the repo
const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const D={CS:'7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',MK:'2a73bbc0-efb3-4250-bf9b-2fdc98236794',HR:'08fd8684-c5c0-4d4d-86f9-2be70cf61e53'};
const enc=v=>v===null?{kind:'null'}:Array.isArray(v)?{kind:'array',items:v.map(x=>({kind:'string',value:x}))}:{kind:'string',value:v};
const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const MT='https://api.mail.tm';
const mj=async(u,o={})=>{const r=await fetch(MT+u,{...o,headers:{'content-type':'application/json',...(o.headers||{})}});return {s:r.status,j:await r.json().catch(()=>null)};};
const boxes=()=>{try{return JSON.parse(fs.readFileSync(MB,'utf8'));}catch(e){return {};}};
async function mailbox(name){const b=boxes();if(b[name])return b[name].address;
 const dom=(await mj('/domains')).j['hydra:member'][0].domain;const address='qa-man-'+name.toLowerCase()+'-'+Date.now().toString(36)+'@'+dom;const password=require('crypto').randomBytes(12).toString('hex');
 const ac=await mj('/accounts',{method:'POST',body:JSON.stringify({address,password})});if(ac.s>=300)throw new Error('mail.tm '+ac.s);
 b[name]={address,password,id:ac.j.id};fs.writeFileSync(MB,JSON.stringify(b));return address;}
async function inbox(name){const b=boxes()[name];const tk=(await mj('/token',{method:'POST',body:JSON.stringify({address:b.address,password:b.password})})).j.token;
 const l=await mj('/messages?page=1',{headers:{authorization:'Bearer '+tk}});const ms=(l.j&&l.j['hydra:member'])||[];
 return {list:ms.map(m=>({id:m.id,from:m.from&&m.from.address,subject:m.subject,at:m.createdAt,intro:m.intro})),read:async id=>(await mj('/messages/'+id,{headers:{authorization:'Bearer '+tk}})).j};}
const gotoTicket=async id=>{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await pg.waitForTimeout(4000);};
const gotoNew=async(q='')=>{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){await pg.goto(H+'/modules/'+T+'/records/new'+q,{waitUntil:'commit',timeout:60000}).catch(()=>{});if(await pg.waitForSelector('[data-rule-field="subject"]',{timeout:120000}).then(()=>true).catch(()=>false))break;}await pg.waitForTimeout(2500);};
const shot=async name=>{await pg.screenshot({path:path.join(OUT,'../screenshots/raw/'+name+'.png')});return name+'.png';};
const body_txt=async()=>(await pg.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
const findTicket=async subj=>{const r=await api('GET','/modules/'+T+'/records?page=1&per_page=50&q='+encodeURIComponent(subj));return arr(r.j&&r.j.data).map(fl).filter(o=>o.subject===subj);};
module.exports={CMID,D,enc,body,mailbox,inbox,gotoTicket,gotoNew,shot,body_txt,findTicket};
// Pick a value in a labelled combobox on the record form. label = visible field label text (without *).
async function pick(label,value,{type=true}={}){
 const cb=pg.locator(`xpath=//*[normalize-space(translate(text(),'*',''))="${label}"]/ancestor::*[.//button[@role="combobox"]][1]//button[@role="combobox"]`).first();
 if(!(await cb.count()))return 'no combobox '+label;await cb.scrollIntoViewIfNeeded().catch(()=>{});await cb.click();await pg.waitForTimeout(1200);
 if(type){const inp=pg.locator('[role=listbox] input, [cmdk-input], [role=dialog] input[type=text], [data-radix-popper-content-wrapper] input').first();if(await inp.count()){await inp.fill(value);await pg.waitForTimeout(2500);}}
 const opt=pg.locator('[role=option]').filter({hasText:value}).first();if(!(await opt.count())){const os=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);await pg.keyboard.press('Escape');return 'no option '+value+' in '+os.slice(0,15).join('|');}
 await opt.click();await pg.waitForTimeout(800);return 'ok';}
async function comboOptions(label){const cb=pg.locator(`xpath=//*[normalize-space(translate(text(),'*',''))="${label}"]/ancestor::*[.//button[@role="combobox"]][1]//button[@role="combobox"]`).first();
 if(!(await cb.count()))return null;await cb.click();await pg.waitForTimeout(1500);const os=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);await pg.keyboard.press('Escape');await pg.waitForTimeout(300);return os.map(s=>s.trim());}
module.exports.pick=pick;module.exports.comboOptions=comboOptions;
// Better field locator: nearest combobox to the label (marks it data-ms=1).
async function fieldBox(label){return pg.evaluate(lab=>{document.querySelectorAll('[data-ms]').forEach(e=>e.removeAttribute('data-ms'));
 const els=[...document.querySelectorAll('main *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.replace('*','').trim()===lab));
 for(const el of els){let a=el;for(let i=0;i<6&&a;i++){a=a.parentElement;const c=a&&a.querySelectorAll('[role=combobox]');if(c&&c.length===1){c[0].setAttribute('data-ms','1');return true;}if(c&&c.length>1)break;}}return false;},label);}
async function pick2(label,value){if(!(await fieldBox(label)))return 'no field '+label;const cb=pg.locator('[data-ms="1"]');await cb.scrollIntoViewIfNeeded().catch(()=>{});await cb.click();await pg.waitForTimeout(2000);
 const dlg=pg.locator('[role=dialog][aria-label="Choose a record"]');
 if(await dlg.count()){await dlg.locator('input[type=search]').fill(value);await pg.waitForTimeout(3000);const row=dlg.locator('tbody tr').filter({hasText:value}).first();if(!(await row.count())){await dlg.getByRole('button',{name:'Cancel'}).click();return 'no record '+value;}
  await row.click();await pg.waitForTimeout(500);const sel=dlg.getByRole('button',{name:/^Select$/});if(await sel.count()&&await sel.isEnabled())await sel.click();await pg.waitForTimeout(1500);return 'ok';}
 const inp=pg.locator('[data-radix-popper-content-wrapper] input, [role=listbox] input').first();if(await inp.count()){await inp.fill(value);await pg.waitForTimeout(2000);}
 const opt=pg.locator('[role=option]').filter({hasText:value}).first();if(!(await opt.count())){const os=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);await pg.keyboard.press('Escape');return 'no option '+value+' in '+os.slice(0,12).join('|');}
 await opt.click();await pg.waitForTimeout(800);return 'ok';}
async function opts2(label){if(!(await fieldBox(label)))return null;await pg.locator('[data-ms="1"]').click();await pg.waitForTimeout(2500);
 const dlg=pg.locator('[role=dialog][aria-label="Choose a record"]');let os;
 if(await dlg.count()){os=(await dlg.locator('tbody tr').allInnerTexts()).map(s=>s.split('\t').filter(Boolean)[0]);await dlg.getByRole('button',{name:'Cancel'}).click();}
 else{os=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);await pg.keyboard.press('Escape');}await pg.waitForTimeout(400);return os.map(s=>String(s).trim());}
module.exports.pick=pick2;module.exports.comboOptions=opts2;module.exports.fieldBox=fieldBox;
// Field by data-rule-field key: picks via its button (listbox) or record dialog.
async function pickF(key,value){const box=pg.locator('[data-rule-field="'+key+'"]').first();if(!(await box.count()))return 'no field '+key;
 const b=box.locator('button[aria-haspopup], button[role=combobox], [role=combobox]').first();await b.scrollIntoViewIfNeeded().catch(()=>{});await b.click();await pg.waitForTimeout(2000);
 const dlg=pg.locator('[role=dialog][aria-label="Choose a record"]');
 if(await dlg.count()){await dlg.locator('input[type=search]').fill(value);await pg.waitForTimeout(3000);const row=dlg.locator('tbody tr').filter({hasText:value}).first();if(!(await row.count())){await dlg.getByRole('button',{name:'Cancel'}).click();return 'no record '+value;}await row.click();await pg.waitForTimeout(500);const sel=dlg.getByRole('button',{name:/^Select$/});if(await sel.count()&&await sel.isEnabled())await sel.click();await pg.waitForTimeout(1500);return 'ok';}
 const inp=pg.locator('[role=listbox] input, [data-radix-popper-content-wrapper] input, [cmdk-input]').first();if(await inp.count()){await inp.fill(value);await pg.waitForTimeout(2000);}
 const opt=pg.locator('[role=option]').filter({hasText:new RegExp('^\\s*'+value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$')}).first();if(!(await opt.count())){const os=await pg.locator('[role=option]').allInnerTexts().catch(()=>[]);await pg.keyboard.press('Escape');return 'no option '+value+' in '+os.slice(0,40).join('|');}
 await opt.click();await pg.waitForTimeout(1000);return 'ok';}
async function optsF(key){const box=pg.locator('[data-rule-field="'+key+'"]').first();if(!(await box.count()))return null;const b=box.locator('button[aria-haspopup], button[role=combobox], [role=combobox]').first();await b.click();await pg.waitForTimeout(2000);
 const os=(await pg.locator('[role=option]').allInnerTexts().catch(()=>[])).map(s=>s.trim());await pg.keyboard.press('Escape');await pg.waitForTimeout(400);return os;}
const fieldKeys=async()=>pg.evaluate(()=>[...document.querySelectorAll('[data-rule-field]')].map(e=>e.getAttribute('data-rule-field')));
module.exports.pickF=pickF;module.exports.optsF=optsF;module.exports.fieldKeys=fieldKeys;
