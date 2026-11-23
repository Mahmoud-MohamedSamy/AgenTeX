const RE=/QA RT24|Re: QA RT24/;const A=process.env.RBAPP;const o={};
const keys=A==='desk'?['desk','iam','files','mail','workflow']:['crm','iam','files','reporting','workflow','mail'];
let items=[],cur='';for(let i=0;i<20;i++){const r=await api('GET','/audit/recycle-bin/items?'+keys.map(k=>'app_key='+k).join('&')+'&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));items.push(...arr(r.j?.data));cur=r.j?.meta?.next_cursor;if(!cur)break;}
const mine=items.filter(x=>RE.test(x.record_label||''));o.total=items.length;o.mine=mine.length;o.labels=mine.map(x=>x.record_label).slice(0,40);
const ids=mine.map(x=>x.id);
if(ids.length){for(let k=0;k<30;k++){const r=await api('POST','/audit/recycle-bin/run-jobs?app_key='+A,{action:'purge',ids});o.purge=r.s+' '+String(r.t).slice(0,150);if(r.s!==409)break;await sleep(10000);}}
return o;
