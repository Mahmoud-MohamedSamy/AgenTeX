// mail.tm inbox as the customer: CS ticket -> agent reply -> must arrive in the outside inbox, no bounce. Also late check for hop1.
module.exports=async()=>{const R={log:[]};const L=s=>{R.log.push(new Date().toISOString().slice(11,19)+' '+s);console.log(s);};const PW=ms=>pg.waitForTimeout(ms);
 const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';const MT='https://api.mail.tm';
 const j=async(u,o={})=>{const r=await fetch(MT+u,{...o,headers:{'content-type':'application/json',...(o.headers||{})}});return {s:r.status,j:await r.json().catch(()=>null)};};
 const dom=(await j('/domains')).j['hydra:member'][0].domain;const addr='qa-em09-'+Date.now().toString(36)+'@'+dom;const pw=require('crypto').randomBytes(12).toString('hex');
 const ac=await j('/accounts',{method:'POST',body:JSON.stringify({address:addr,password:pw})});if(ac.s>=300){R.stop='mail.tm account '+ac.s;return R;}
 const tk=(await j('/token',{method:'POST',body:JSON.stringify({address:addr,password:pw})})).j.token;R.inbox=addr;L('inbox '+addr);
 require('fs').writeFileSync(OUT+'/a4-mailtm.json',JSON.stringify({address:addr,id:ac.j.id}));
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const SUBJ='QA EM09 outside inbox '+new Date().toISOString().slice(11,16).replace(':','');
 const cr=await api('POST','/modules/'+T+'/records',body({subject:SUBJ,department:CS,status:'Open',priority:'Medium',email:addr,owner:IDS.O}));
 const id=cr.j&&cr.j.data&&(cr.j.data.id||(fl(cr.j.data)||{}).id);if(!id){R.stop='create '+cr.s;return R;}R.ticket=id;LED('CL A4 CS ticket "'+SUBJ+'" '+id+' contact mail.tm '+addr);
 await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);
 await pg.getByRole('button',{name:/^Reply( All)?$/}).first().click();await PW(5000);const ed=pg.locator('[contenteditable=true]').last();await ed.click({position:{x:30,y:12}});await pg.keyboard.press('Control+Home');await pg.keyboard.type('QA EM-09 agent reply to an outside inbox.');await PW(2000);
 let send=null;const c=pg.getByRole('button',{name:/^Send$/});for(let i=0;i<await c.count();i++){const b=c.nth(i);if(await b.isVisible().catch(()=>false)&&!(await b.isDisabled().catch(()=>true)))send=b;}
 if(!send){R.stop='Send disabled';return R;}R.sentAt=new Date().toISOString().slice(11,19);await send.click();await PW(10000);LED('CL A4 agent reply to mail.tm inbox');
 const t0=Date.now();let msgs=[];while(Date.now()-t0<300000){msgs=((await j('/messages',{headers:{authorization:'Bearer '+tk}})).j||{})['hydra:member']||[];if(msgs.length)break;await W(15000);}
 R.arrived=msgs.map(x=>({from:x.from&&x.from.address,subject:x.subject,at:x.createdAt}));L('arrived '+JSON.stringify(R.arrived));
 if(msgs[0]){const full=(await j('/messages/'+msgs[0].id,{headers:{authorization:'Bearer '+tk}})).j;R.text=String(full.text||'').slice(0,300);R.headers={replyTo:full.replyTo,to:full.to};
  const src=await fetch(MT+'/sources/'+msgs[0].id,{headers:{authorization:'Bearer '+tk}}).then(r=>r.json()).catch(()=>null);const raw=src&&src.data||'';R.auth=(raw.match(/^(Authentication-Results|ARC-Authentication-Results|Received-SPF|DKIM-Signature):.*(\r?\n[ \t].*)*/gim)||[]).map(s=>s.replace(/\s+/g,' ').slice(0,260));R.msgid=(raw.match(/^Message-ID:.*$/im)||[''])[0];}
 R.sendStatus=((((await api('GET','/desk/tickets/'+id+'/replies')).j||{}).data)||[]).map(x=>x.direction+' '+x.status);
 R.hop1Late=arr(((await api('GET','/modules/'+T+'/records?q=TAVI2TAVI&per_page=50')).j||{}).data).map(fl).map(o=>o.ticket_number+' '+o.subject);
 await pg.screenshot({path:OUT+'/../screenshots/raw/cl-a4-cs-sent.png'});
 return R;};
