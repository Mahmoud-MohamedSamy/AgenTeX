const o={}; const to='mmohamed@anyware.software'; const red=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
const x=await mkRec('2630 send real',{email:to}); o.lead=x[1]; I.L2630b=x[1]; SAVE();
const d=await api('POST','/mail/drafts',{to:[to],subject:'QA RT17 2630 refused sender',body:'QA NDC-2630 refused sender check',body_html:'<p>QA NDC-2630 refused sender check</p>',record_type:'leads',record_id:x[1],attachments:[]});
const s=await api('POST','/mail/drafts/'+d.j.data.id+'/send',{}); o.send=red(SR(s));
await sleep(15000);
const m=await api('GET','/mail/records/leads/'+x[1]+'/emails?box=mails&limit=10'); o.mails=red(JSON.stringify(arr(m.j&&m.j.data).map(e=>({status:e.status,delivery:e.delivery_status,err:(e.last_error||'').slice(0,100)}))));
const m1=await api('GET','/mail/records/leads/'+I.L2630+'/emails?box=mails&limit=10'); o.mailsBounceCase=red(JSON.stringify(arr(m1.j&&m1.j.data).map(e=>{const k={}; for(const f of Object.keys(e)) if(/status|error|bounce|retry/i.test(f)) k[f]=e[f]; return k;})));
const tl=await api('GET','/timeline/records/leads/'+x[1]+'/feed'); o.timeline=(tl.t.match(/"entry_type":"(\w+)"/g)||[]).join(' ');
return o;
