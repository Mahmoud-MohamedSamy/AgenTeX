const T=JSON.parse(fs.readFileSync('../out/2807.json','utf8'));const L=T.L;const ids=T.ids.slice(20);const o={};const s=v=>({kind:'string',value:v});
const t0=Date.now();const j1=await api('POST','/modules/'+L+'/records/mass-update-jobs',{record_ids:ids,data:[{field:'lead_source',value:s('Referral')}]});o.job1=j1.s+' '+String(j1.t).slice(0,160)+' in '+(Date.now()-t0)+'ms';
const j2=await api('POST','/modules/'+L+'/records/mass-update-jobs',{record_ids:T.ids.slice(0,20),data:[{field:'lead_source',value:s('Partner')}]});o.job2WhileJob1Runs=j2.s+' '+String(j2.t).slice(0,220);
// no polling for 45 s (page closed)
const count=async v=>{let n=0;for(let i=0;i<ids.length;i+=30){const rs=await Promise.all(ids.slice(i,i+30).map(id=>api('GET','/modules/'+L+'/records/'+id)));for(const r of rs){if((r.j?.data?.data||[]).find(x=>x.field==='lead_source')?.value?.value===v)n++;}}return n;};
await sleep(45000);o.referralAt45s=await count('Referral')+'/180';
const jid=j1.j?.data?.job_id;if(jid){const g=(await api('GET','/modules/'+L+'/mass-update-jobs/'+jid)).j?.data;o.job1Status=g&&(g.status+' processed '+g.processed+'/'+g.requested+' updated '+g.updated+' failed '+g.failed);}
if(!/completed/.test(o.job1Status||'')){await sleep(60000);o.referralAt105s=await count('Referral')+'/180';const g=(await api('GET','/modules/'+L+'/mass-update-jobs/'+jid)).j?.data;o.job1StatusLater=g&&(g.status+' '+g.processed+'/'+g.requested);}
fs.writeFileSync('../out/2807-m5.json',JSON.stringify(o,null,1));return o;
