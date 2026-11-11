// EM-05 check: did the customer's reply reach #2382? READ-ONLY.
module.exports=async()=>{const R={};const ID='c8590aab-2f4d-46a5-81b8-bb096c8736fc';const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');const PW=ms=>pg.waitForTimeout(ms);
 R.at=new Date().toISOString().slice(11,19);const t0=Date.now();let rs=[];
 while(Date.now()-t0<240000){rs=((await api('GET','/desk/tickets/'+ID+'/replies')).j||{}).data||[];if(rs.some(x=>x.direction==='inbound'))break;await W(20000);}
 R.waitedSec=Math.round((Date.now()-t0)/1000);
 R.replies=rs.map(x=>({dir:x.direction,status:x.status||x.delivery_status,at:String(x.created_at||x.received_at||'').slice(11,19),from:m(JSON.stringify(x.from||x.from_address||x.sender||'')).slice(0,70),subject:x.subject,text:String(x.body_text||x.text||x.snippet||x.preview||'').slice(0,120)}));
 const d=((await api('GET','/desk/tickets/'+ID)).j||{}).data||{};R.ticket={status:d.status,counts:d.counts};
 const r=await api('GET','/modules/'+T+'/records?page=1&per_page=60&sort_by=created_at&sort_dir=desc');
 R.newTicketsFromContact=arr(r.j&&r.j.data).map(fl).filter(o=>String(o.created_at)>'2026-11-10T09:50'&&(/EM-03|EM-05/i.test(String(o.subject))||/mmohamed@/i.test(String(o.email)))).map(o=>({no:o.ticket_number,s:o.subject,c:String(o.created_at).slice(11,19)}));
 const a=((await api('GET','/desk/tickets/'+ID+'/activity')).j||{}).data;R.activity=(Array.isArray(a)?a:[]).filter(x=>x.occurred_at>'2026-11-10T09:55').map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,140));
 const q=await api('GET','/desk/channels/quarantine');const s=await api('GET','/desk/channels/suppressions');const sp=await api('GET','/desk/channels/spam-contacts');R.lists={quarantine:q.s+' '+((q.j&&q.j.data)||[]).length,suppressions:s.s+' '+((s.j&&s.j.data)||[]).length,spam:sp.s+' '+((sp.j&&sp.j.data)||[]).length};
 try{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+ID,{waitUntil:'commit',timeout:60000});}catch(e){continue;}if(await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false))break;}await PW(5000);await pg.screenshot({path:OUT+'/../screenshots/raw/cl-em05-2382.png'});}catch(e){R.shotErr=String(e.message).slice(0,80);}
 return R;};
