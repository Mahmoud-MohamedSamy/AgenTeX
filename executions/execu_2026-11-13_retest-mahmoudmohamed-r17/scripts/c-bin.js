const mine=new Set([...(I.R07||[]),...(I.recs||[]),...(I.T74||[]),...(I.T23||[]),I.T23c,I.TK94,I.A35&&I.A35.ticket,...((I.A35&&I.A35.tasks)||[]),I.A35&&I.A35.call,I.S10&&I.S10.A.id,I.S10&&I.S10.B.id,I.S10&&I.S10.A.crm,I.S10&&I.S10.B.crm].filter(Boolean));
const q='app_key=crm&app_key=desk&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&app_key=metadata&limit=200';
let all=[],cur=null; const seen=new Set(); for(let p=0;p<80;p++){ const r=await api('GET','/audit/recycle-bin/items?'+q+(cur?'&cursor='+encodeURIComponent(cur):'')); const a=arr(r.j&&r.j.data); let fresh=0; for(const x of a){ if(!seen.has(x.id)){seen.add(x.id); all.push(x); fresh++;} } cur=r.j&&r.j.meta&&r.j.meta.next_cursor; if(!cur||!fresh) break; }
const pick=all.filter(x=>mine.has(x.record_id)||/^QA RT17/i.test(x.record_label||'')||/^qa_rt17_/i.test(x.record_label||''));
const res={ok:0,fail:[]}; for(let i=0;i<pick.length;i+=25){ const r=await api('POST','/audit/recycle-bin/delete',{ids:pick.slice(i,i+25).map(x=>x.id)}); if(r.s<300) res.ok+=Math.min(25,pick.length-i); else res.fail.push(SR(r)); }
LED('CLEANUP recycle bin: scanned '+all.length+', mine '+pick.length+', purged '+res.ok+(res.fail.length?' fail '+res.fail[0]:''));
return {scanned:all.length, mine:pick.length, labels:[...new Set(pick.map(x=>x.module_key))], res};
