const T='88e8ea44-1658-4df3-9930-d0902b91073d';const R={};
for(const q of ['search=AOF8z','q=AOF8z']){const r=await api('GET','/modules/'+T+'/records?'+q+'&per_page=50');const L=r.j?.data||[];R[q]=r.s+' n='+(Array.isArray(L)?L.length:'?');if(Array.isArray(L)&&L.length){R.hits=L.map(x=>{const g=k=>x.data.find(e=>e.field===k)?.value?.value;return [g('ticket_number'),g('subject'),g('status')].join(' | ');}).slice(0,12);break;}}
return R;
