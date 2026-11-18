const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
let F=arr((await api('GET','/modules/'+T+'/fields')).j.data); let f=F.find(x=>x.fieldName==='qa_rt20vr_secret');
if(!f){ const r=await api('POST','/modules/'+T+'/fields',{fields:[{fieldName:'qa_rt20vr_secret',datatypeKey:'single_line',labels:{en:'QA RT20 VR secret'},datatypeOptions:{encrypted:true,ephi:true},config:{encrypted:true,ephi:true,isEncrypted:true},required:false,unique:false,uniquePeerModuleIds:[],encrypted:true,isEncrypted:true,ephi:true}]}); o.create=r.s+' '+r.t.slice(0,300); if(r.s<300) LED('Desk Tickets field qa_rt20vr_secret (encryption probe, not on any layout)');
 F=arr((await api('GET','/modules/'+T+'/fields')).j.data); f=F.find(x=>x.fieldName==='qa_rt20vr_secret'); }
o.stored=f&&JSON.stringify({dto:f.datatypeOptions,cfg:f.config,keys:Object.keys(f).filter(k=>/encr|phi/i.test(k))});
o.dataTypes=JSON.stringify((await api('GET','/data-types')).j||'').match(/encrypt|ephi|phi/gi);
return o;
