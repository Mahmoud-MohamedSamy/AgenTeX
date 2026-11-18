const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const I=JSON.parse(fs.readFileSync('vr/ids.json','utf8'));
const f=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(x=>(x.apiName||x.api_name||x.name)==='qa_ndc_rejection_reasons'); const o={f:f&&{type:f.type||f.dataType,opts:JSON.stringify(f.options||f.picklistValues||f.config||'').slice(0,300)}};
return o;
