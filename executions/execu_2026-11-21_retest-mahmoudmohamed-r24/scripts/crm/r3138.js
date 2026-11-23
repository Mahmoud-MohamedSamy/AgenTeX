const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const r=await api('GET','/modules/'+L+'/records?page_size=10&search='+encodeURIComponent('QA RT24 3138'));
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;log('crm',r.s,arr(r.j?.data||r.j).map(x=>{const d=Object.fromEntries((x.data||[]).map(f=>[f.field,val(f.value)]));return x.id+' '+d.first_name+' src='+d.lead_source}));
