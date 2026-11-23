const A=process.env.RBAPP||'desk';const RE=/QA RT(1[89]|2[0-3])/;const B=+(process.env.BS||200);
const items=JSON.parse(fs.readFileSync(process.env.SRC,'utf8')).filter(x=>/QA RT(1[89]|2[0-3])/.test(x.record_label||''));
const ids=items.map(x=>x.id);const o={want:ids.length,ok:0,st:{},t0:Date.now()};
for(let i=0;i<ids.length;i+=B){for(let k=0;k<60;k++){const r=await api('POST','/audit/recycle-bin/run-jobs?app_key='+A,{action:'purge',ids:ids.slice(i,i+B)});o.st[r.s]=(o.st[r.s]||0)+1;if(r.s<300){o.ok+=Math.min(B,ids.length-i);break;}if(r.s===409){await sleep(10000);continue;}o.err=r.s+' '+String(r.t).slice(0,200);break;}if(o.err)break;}
o.secs=Math.round((Date.now()-o.t0)/1000);fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CLEANUP recycle bin '+A+': purge requested for '+o.ok+'/'+o.want+' QA RT18–23 items\n');return o;
