const L=await modId('leads'); await sleep(5000);
const it=arr((await api('GET','/modules/'+L+'/records?q='+encodeURIComponent('QA SR1112 WF visitor')+'&per_page=20')).j.data).filter(x=>JSON.stringify(x).includes('QA SR1112 WF visitor'));
const out=it.map(x=>{const d=x.data||[];const g=f=>{const v=d.find(y=>y.field===f);return v&&v.value&&v.value.value;};return {id:x.id,src:g('lead_source'),score:g('score'),source:x.source};});
I.wfLeads=it.map(x=>x.id); SAVE(); return out;
